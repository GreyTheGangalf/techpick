import pytest

from jsonld import extract_jsonld, find_product, read_offer, ParsedOffer

TAG = "script"


def tag(body: str, type_: str = "application/ld+json") -> str:
    return f'<{TAG} type="{type_}">{body}</{TAG}>'


HTML = (
    "<html><head>"
    + tag('{"@type": "Product", "name": "Laptop"}')
    + tag('[{"@type": "BreadcrumbList"}, 5]')
    + tag("{broken json")
    + tag("var notJsonLd = 1;", type_="text/javascript")
    + "</head></html>"
)


def test_extracts_objects_and_skips_broken_blocks():
    items = extract_jsonld(HTML)
    assert [i["@type"] for i in items] == ["Product", "BreadcrumbList"]


def test_page_without_jsonld_returns_empty_list():
    assert extract_jsonld("<html></html>") == []

@pytest.mark.parametrize(
    "items",
    [
        [{"@type": "BreadcrumbList"}, {"@type": "Product", "name": "Laptop"}],
        [{"@type": ["Product", "Thing"], "name": "Laptop"}],
        [{"@graph": [{"@type": "WebPage"}, {"@type": "Product", "name": "Laptop"}]}],
    ],
)
def test_find_product(items):
    assert find_product(items)["name"] == "Laptop"


def test_find_product_returns_none_without_product():
    assert find_product([{"@type": "Organization"}]) is None

@pytest.mark.parametrize(
    "offers, expected",
    [
        ({"price": "42999.00", "priceCurrency": "TRY", "availability": "https://schema.org/InStock"}, ParsedOffer(4299900, True)),
        ({"price": 42999, "availability": "http://schema.org/OutOfStock"}, ParsedOffer(4299900, False)),
        ([{"price": "41.500,00", "availability": "InStock"}, {"price": "45000"}], ParsedOffer(4150000, True)),
        ({"@type": "AggregateOffer", "lowPrice": "39999", "availability": "https://schema.org/InStock"}, ParsedOffer(3999900, True)),
        ({"price": "42999"}, ParsedOffer(4299900, False)),
    ],
)
def test_read_offer(offers, expected):
    assert read_offer({"@type": "Product", "offers": offers}) == expected


@pytest.mark.parametrize(
    "product",
    [
        {"@type": "Product"},
        {"@type": "Product", "offers": []},
        {"@type": "Product", "offers": {"price": "abc"}},
        {"@type": "Product", "offers": {"price": "999", "priceCurrency": "USD"}},
    ],
)
def test_read_offer_returns_none(product):
    assert read_offer(product) is None