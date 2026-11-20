from jsonld import ParsedOffer
from verify import QUIT, SKIP, parse_answer

OLD = 4_500_000  # current price in kuruş


def test_price_means_in_stock():
    assert parse_answer("42.999", OLD) == ParsedOffer(4_299_900, True)


def test_y_keeps_old_price_out_of_stock():
    assert parse_answer(" Y ", OLD) == ParsedOffer(OLD, False)


def test_empty_is_skip():
    assert parse_answer("", OLD) == SKIP


def test_q_is_quit():
    assert parse_answer("q", OLD) == QUIT


def test_garbage_and_zero_are_rejected():
    assert parse_answer("abc", OLD) is None
    assert parse_answer("0", OLD) is None