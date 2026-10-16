"""Map raw CPU text from store pages to the canonical model names in cpus.csv.

Store pages write the same CPU in many ways:
    "Intel® Core™ i7-14650HX İşlemci 2.2 GHz", "i7 14650HX", "Core i7-14650HX"
All of them must resolve to the single catalog row "Intel Core i7-14650HX",
so the configuration can be linked to its benchmark scores.

Resolution order:
    1. aliases.csv  -- matches a human has already confirmed (always trusted)
    2. cpu_key()    -- rule-based: reduce both sides to the same key and compare
    3. None         -- no match; the text goes to manual review

Run the tests from the ingest/ folder:
    python -m pytest
"""

from __future__ import annotations

import csv
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

REPO_ROOT = Path(__file__).resolve().parents[2]
CPUS_CSV = REPO_ROOT / "packages" / "db" / "seed" / "cpus.csv"
ALIASES_CSV = Path(__file__).with_name("aliases.csv")


@dataclass(frozen=True)
class Match:
    canonical: str                      # exact `model` value from cpus.csv
    method: Literal["alias", "rule"]    # how it was found; useful for measuring the rules later


def clean_text(raw: str) -> str:
    """Remove noise that never identifies a CPU. Does not try to understand the model."""
    # Strip symbols before NFKC: NFKC turns "™" into the letters "TM" ("Core™" -> "coretm").
    text = re.sub(r"[®™©]", " ", raw)
    text = unicodedata.normalize("NFKC", text)
    # Turkish dotted capital I: "İ".lower() returns "i" + a combining dot (2 characters),
    # which would silently break every later comparison. Replace it first.
    text = text.replace("İ", "I").replace("ı", "i")
    text = text.lower()
    text = re.sub(r"\(r\)|\(tm\)", " ", text)
    # Clock speeds and cache sizes: "2.2 ghz", "5,0ghz", "24 mb"
    text = re.sub(r"\d+([.,]\d+)?\s*(ghz|mhz|mb)\b", " ", text)
    text = re.sub(r"\b(işlemci|islemci|processor|cpu)\b", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def cpu_key(text: str) -> str | None:
    """Reduce a cleaned CPU text to a comparable key, or None if no model is found.

    The same function runs on catalog names and on store text, so two strings
    describe the same CPU exactly when their keys are equal. Examples:

        "intel core i7-14650hx"      -> "i7 14650hx"
        "core i7 14650hx"            -> "i7 14650hx"
        "intel core 5 210h"          -> "core 5 210h"
        "amd ryzen ai 9 hx 370"      -> "ryzen ai 9 hx 370"
        "ryzen 5 7640hs"             -> "ryzen 5 7640hs"
        "8 gb ddr5 ram"              -> None
    """
    # TODO(human): implement the rules with regular expressions.
    # - Intel Core Ultra / Core i: tier (i5, i7, i9, ultra 7 ...) + model number with suffix
    # - Intel Core 3/5/7 (new naming, no "i"): "core 5" + model number
    # - AMD Ryzen: optional "ai", tier digit, optional "hx"/"pro", model number + suffix
    # - Treat "-" and " " the same, so "i7-14650hx" and "i7 14650hx" give one key.
    # - Apple chips are left to aliases.csv for now: store pages rarely state the core count.
    # Run `python -m pytest` after each rule; tests/test_cpu.py lists the cases to pass.
    raise NotImplementedError


def load_catalog(path: Path = CPUS_CSV) -> dict[str, str]:
    """Return {key: canonical model} for every catalog CPU that cpu_key understands."""
    catalog: dict[str, str] = {}
    with path.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            key = cpu_key(clean_text(row["model"]))
            if key is None:
                continue  # e.g. Apple rows; reachable only through aliases
            if key in catalog:
                raise ValueError(f"Two catalog CPUs share the key {key!r}: "
                                 f"{catalog[key]!r} and {row['model']!r}")
            catalog[key] = row["model"]
    return catalog


def load_aliases(path: Path = ALIASES_CSV) -> dict[str, str]:
    """Return {cleaned raw text: canonical model} for confirmed CPU aliases."""
    with path.open(encoding="utf-8", newline="") as f:
        return {clean_text(r["raw_text"]): r["canonical"]
                for r in csv.DictReader(f) if r["kind"] == "cpu"}


def normalize_cpu(raw: str, catalog: dict[str, str], aliases: dict[str, str]) -> Match | None:
    text = clean_text(raw)
    if text in aliases:
        return Match(aliases[text], "alias")
    key = cpu_key(text)
    if key is not None and key in catalog:
        return Match(catalog[key], "rule")
    return None
