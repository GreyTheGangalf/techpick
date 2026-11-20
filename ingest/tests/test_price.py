from decimal import Decimal

import pytest

from price import parse_price

# python -m pytest ingest -v


@pytest.mark.parametrize(
    "raw, expected",
    [
        (42999, 4299900),
        (42999.5, 4299950),
        (Decimal("42999.555"), 4299956),
        ("42.999,00", 4299900), 
        ("42999.00", 4299900),
        ("42999.5", 4299950),
        (" 42.999,00 TL", 4299900),
        ("1.299.999", 129999900),
        ("42,5", 4250),
    ],
)
def test_valid_prices(raw, expected):
    assert parse_price(raw) == expected


@pytest.mark.parametrize("raw", [0, -5, True, None, "abc", ""])
def test_invalid_prices_return_none(raw):
    assert parse_price(raw) is None
