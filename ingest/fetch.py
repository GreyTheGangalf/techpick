import requests

USER_AGENT = "Mozilla/5.0 (compatible; TechPickBot/0.1)"
TIMEOUT_S = 20


def fetch_html(url: str) -> str | None:
    """Download a page, or None on any network error or non-200 status."""
    try:
        resp = requests.get(
            url,
            headers={"User-Agent": USER_AGENT, "Accept-Language": "tr-TR,tr;q=0.9"},
            timeout=TIMEOUT_S,
        )
    except requests.RequestException:
        return None
    if resp.status_code != 200:
        return None
    return resp.text
