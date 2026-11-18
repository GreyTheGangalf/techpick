import psycopg

from history import should_record_history
from jsonld import ParsedOffer


def update_offer(conn: psycopg.Connection, offer_id: int, parsed: ParsedOffer) -> bool:
    """Save a successful price check. Returns True if a price_history row was written."""
    with conn.transaction():
        row = conn.execute(
            """
            SELECT o.price_kurus,
            EXISTS (SELECT 1 FROM price_history h WHERE h.offer_id = o.id)
            FROM offers o
            WHERE o.id = %s
            """,
            (offer_id,),
        ).fetchone()
        if row is None:
            return False
        old_price, has_history = row

        conn.execute(
            "UPDATE offers SET price_kurus = %s, in_stock = %s, last_seen_at = now() WHERE id = %s",
            (parsed.price_kurus, parsed.in_stock, offer_id),
        )
        if not should_record_history(old_price, parsed.price_kurus, has_history):
            return False

        conn.execute(
            "INSERT INTO price_history (offer_id, price_kurus) VALUES (%s, %s)",
            (offer_id, parsed.price_kurus),
        )
        return True
