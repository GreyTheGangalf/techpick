import sys

import requests

from fetch import TIMEOUT_S, USER_AGENT
from jsonld import extract_jsonld, find_product

url = sys.argv[1]
r = requests.get(
    url,
    headers={"User-Agent": USER_AGENT, "Accept-Language": "tr-TR,tr;q=0.9"},
    timeout=TIMEOUT_S,
)
print("1) status:", r.status_code, "| bytes:", len(r.text))
items = extract_jsonld(r.text)
print("2) jsonld types:", [i.get("@type") for i in items])
product = find_product(items)
print("3) product found:", product is not None)
if product:
    print("4) offers:", product.get("offers"))
