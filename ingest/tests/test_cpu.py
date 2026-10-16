import pytest

from normalize.cpu import Match, clean_text, load_aliases, load_catalog, normalize_cpu


@pytest.fixture(scope="module")
def catalog():
    return load_catalog()


@pytest.fixture(scope="module")
def aliases():
    return load_aliases()


# --- clean_text: already implemented, should pass from the start ---------------

@pytest.mark.parametrize("raw, expected", [
    ("Intel® Core™ i7-14650HX İşlemci 2.2 GHz", "intel core i7-14650hx"),
    ("AMD Ryzen(TM) 5 7640HS 5,0GHz", "amd ryzen 5 7640hs"),
    ("  Intel   Core 5 Processor 210H ", "intel core 5 210h"),
])
def test_clean_text(raw, expected):
    assert clean_text(raw) == expected


# --- normalize_cpu: passes once cpu_key is implemented --------------------------

@pytest.mark.parametrize("raw, expected", [
    ("Intel® Core™ i7-14650HX İşlemci 2.2 GHz", "Intel Core i7-14650HX"),
    ("i7 14650HX", "Intel Core i7-14650HX"),
    ("Intel Core i9 13900HX 24 MB", "Intel Core i9-13900HX"),
    ("Intel Core 5 Processor 210H", "Intel Core 5 210H"),
    ("AMD Ryzen™ AI 9 HX 370", "AMD Ryzen AI 9 HX 370"),
    ("Ryzen 5 7640HS 4.3GHz", "AMD Ryzen 5 7640HS"),
    ("AMD Ryzen 7 260", "AMD Ryzen 7 260"),
])
def test_rule_matches(raw, expected, catalog, aliases):
    assert normalize_cpu(raw, catalog, aliases) == Match(expected, "rule")


@pytest.mark.parametrize("raw", [
    "Intel Core i3-1215U",      # real CPU, but not in our catalog
    "AMD Ryzen 7 2600",         # must not match "Ryzen 7 260"
    "16 GB DDR5 RAM",           # not a CPU at all
])
def test_no_match_goes_to_review(raw, catalog, aliases):
    assert normalize_cpu(raw, catalog, aliases) is None


def test_alias_wins(catalog, aliases):
    raw = "Apple M4 çip 10 çekirdekli CPU"
    assert normalize_cpu(raw, catalog, aliases) == Match("Apple M4 10-Core", "alias")
