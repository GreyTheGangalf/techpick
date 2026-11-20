def should_record_history(old_price: int, new_price: int, has_history: bool) -> bool:
    """Write a price_history row when the price changes, or to start an empty history."""
    if not has_history:
        return True
    return old_price != new_price