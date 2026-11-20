from jsonld import ParsedOffer
from price import parse_price
import os
import sys
from pathlib import Path

import psycopg
from dotenv import load_dotenv

from db import load_due_manual, update_offer

SKIP = "skip"
QUIT = "quit"
IN_STOCK_DAYS = 5
OUT_OF_STOCK_DAYS = 14


def parse_answer(text: str, current_price: int) -> ParsedOffer | str | None:
    """Turn what the user typed into an action for one offer."""
    text = text.strip().casefold()
    if text == "":
        return SKIP
    if text == "q":
        return QUIT
    if text == "y":
        return ParsedOffer(current_price, in_stock=False)
    price = parse_price(text)
    if price is None or price <= 0:
        return None
    return ParsedOffer(price, in_stock=True)


def format_tl(kurus: int) -> str:
    return f"{kurus // 100:,} TL".replace(",", ".")


def main() -> int:
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL is not set", file=sys.stderr)
        return 1

    done = 0
    with psycopg.connect(url, autocommit=True) as conn:
        due = load_due_manual(conn, IN_STOCK_DAYS, OUT_OF_STOCK_DAYS)
        print(
            f"{len(due)} offers due. price / y = out of stock / Enter = skip / q = quit"
        )
        for i, row in enumerate(due, 1):
            offer_id, page_url, store, seller, model, price, in_stock, seen = row
            stock = "in stock" if in_stock else "OUT OF STOCK"
            print(f"\n[{i}/{len(due)}] {model} | {store} {seller}".rstrip())
            print(
                f"  now: {format_tl(price)}, {stock}, checked {seen.astimezone():%d.%m %H:%M}"
            )
            print(f"  {page_url}")
            while (action := parse_answer(input("  > "), price)) is None:
                print("  could not read that, try again")
            if action == QUIT:
                break
            if action == SKIP:
                continue
            update_offer(conn, offer_id, action)
            done += 1

    print(f"\n{done} offers verified")
    return 0


if __name__ == "__main__":
    sys.exit(main())
