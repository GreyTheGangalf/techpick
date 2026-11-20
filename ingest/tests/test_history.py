import pytest

from history import should_record_history


@pytest.mark.parametrize(
    "old_price, new_price, has_history, expected",
    [
        (4299900, 4299900, True, False),   # same price, history exists -> skip
        (4299900, 4199900, True, True),    # price dropped
        (4299900, 4399900, True, True),    # price rose
        (4299900, 4299900, False, True),   # first run: baseline row
    ],
)
def test_should_record_history(old_price, new_price, has_history, expected):
    assert should_record_history(old_price, new_price, has_history) is expected