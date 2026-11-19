import os
import sys
import time
from collections import Counter
from pathlib import Path

import psycopg
from dotenv import load_dotenv

from db import load_targets, update_offer
from fetch import fetch_html
from jsonld import parse_jsonld

DELAY_S = 1  # be polite: one request per second


def main() -> int:
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")  # local only
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL is not set", file=sys.stderr)
        return 1

    ok, failed = Counter(), Counter()
    price_changes = 0

    with psycopg.connect(url, autocommit=True) as conn:
        targets = load_targets(conn)
        for offer_id, page_url, store in targets:
            html = fetch_html(page_url)
            parsed = parse_jsonld(html) if html else None
            if parsed is None:
                failed[store] += 1
                print(f"FAIL {store} offer={offer_id} {page_url}")
            else:
                ok[store] += 1
                if update_offer(conn, offer_id, parsed):
                    price_changes += 1
            time.sleep(DELAY_S)

    for store in sorted(ok.keys() | failed.keys()):
        print(f"{store}: {ok[store]}/{ok[store] + failed[store]} ok")
    print(f"total: {ok.total()} ok, {failed.total()} failed, {price_changes} history rows")
    return 1 if targets and not ok else 0


if __name__ == "__main__":
    sys.exit(main())