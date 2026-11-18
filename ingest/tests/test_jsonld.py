from jsonld import extract_jsonld

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