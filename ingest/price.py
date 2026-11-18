from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import re


def _parse_price_str(text: str) -> int | None:
    # 1) keep only digits and separators: " 42.999,00 TL" -> "42.999,00"
    cleaned = re.sub(r"[^\d.,]", "", text)
    if not cleaned:
        return None

    # 2) decide which character is the decimal separator (or none)
    last_dot = cleaned.rfind(".")
    last_comma = cleaned.rfind(",")
    if last_dot != -1 and last_comma != -1:
        decimal_sep = "." if last_dot > last_comma else ","
    elif last_dot != -1 or last_comma != -1:
        sep = "." if last_dot != -1 else ","
        digits_after = len(cleaned) - cleaned.rfind(sep) - 1
        if cleaned.count(sep) > 1 or digits_after == 3:
            decimal_sep = None  # "42.999" or "1.299.999" -> thousands
        else:
            decimal_sep = sep  # "42999.5" or "42999,90"
    else:
        decimal_sep = None

    # 3) rewrite into the form Decimal understands: "42999.00"
    if decimal_sep is None:
        normalized = cleaned.replace(".", "").replace(",", "")
    else:
        thousands_sep = "," if decimal_sep == "." else "."
        normalized = cleaned.replace(thousands_sep, "").replace(decimal_sep, ".")

    try:
        return _to_kurus(Decimal(normalized))
    except InvalidOperation:
        return None


def parse_price(raw) -> int | None:
    """Convert a price value from JSON-LD to integer kuruş, or None if unparseable."""
    if isinstance(raw, bool):
        return None
    if isinstance(raw, (int, float, Decimal)):
        value = Decimal(str(raw))
        return _to_kurus(value)
    if isinstance(raw, str):
        return _parse_price_str(raw)
    return None


def _to_kurus(value: Decimal) -> int | None:
    if value <= 0:
        return None
    return int((value * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
