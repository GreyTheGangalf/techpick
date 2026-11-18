import json

from bs4 import BeautifulSoup


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