import json
from bs4 import BeautifulSoup
from typing import NamedTuple
from price import parse_price


def extract_jsonld(html: str) -> list[dict]:
    """Return every JSON-LD object found in the page, skipping broken blocks."""
    soup = BeautifulSoup(html, "html.parser")
    items = []
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.get_text())
        except json.JSONDecodeError:
            continue
        blocks = data if isinstance(data, list) else [data]
        items.extend(b for b in blocks if isinstance(b, dict))
    return items


def find_product(items: list[dict]) -> dict | None:
    """Return the first object whose @type includes Product, looking inside @graph too."""
    queue = list(items)
    while queue:
        item = queue.pop(0)
        graph = item.get("@graph")
        if isinstance(graph, list):
            queue.extend(g for g in graph if isinstance(g, dict))
        if _has_type(item, "Product"):
            return item
    return None


def _has_type(item: dict, wanted: str) -> bool:
    types = item.get("@type")
    if isinstance(types, str):
        types = [types]
    return isinstance(types, list) and wanted in types

IN_STOCK = {"InStock", "LimitedAvailability", "OnlineOnly"}


class ParsedOffer(NamedTuple):
    price_kurus: int
    in_stock: bool


def read_offer(product: dict) -> ParsedOffer | None:
    """Read price and stock from a Product's offers, or None if unusable."""
    offer = product.get("offers")
    if isinstance(offer, list):
        offer = offer[0] if offer else None
    if not isinstance(offer, dict):
        return None
    if offer.get("priceCurrency", "TRY") not in ("TRY", "TL"):
        return None
    price = parse_price(offer.get("price", offer.get("lowPrice")))
    if price is None:
        return None
    availability = str(offer.get("availability", ""))
    in_stock = availability.rsplit("/", 1)[-1] in IN_STOCK
    return ParsedOffer(price, in_stock)