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


def load_targets(conn: psycopg.Connection) -> list[tuple[int, str, str, str]]:
    """Return (offer_id, url, store_name, seller_name) for every offer in a jsonld store."""
    return conn.execute(
        """
        SELECT o.id, o.url, s.name, o.seller_name
        FROM offers o
        JOIN stores s ON s.id = o.store_id
        WHERE s.fetch_method = 'jsonld'
        ORDER BY s.name, o.id
        """
    ).fetchall()


def load_due_manual(
    conn: psycopg.Connection, in_stock_days: int, out_of_stock_days: int
) -> list[tuple]:
    """Manual-store offers due for a check, oldest first.
    Out-of-stock offers are already hidden, so they are checked less often."""
    return conn.execute(
        """
        SELECT o.id, o.url, s.name, o.seller_name,
               f.brand || ' ' || f.name || ' ' || c.variant_name,
               o.price_kurus, o.in_stock, o.last_seen_at
        FROM offers o
        JOIN stores s ON s.id = o.store_id
        JOIN configurations c ON c.id = o.configuration_id
        JOIN model_families f ON f.id = c.family_id
        WHERE s.fetch_method = 'manual'
          AND o.last_seen_at < now() - make_interval(
                days => CASE WHEN o.in_stock THEN %s ELSE %s END)
        ORDER BY o.last_seen_at, o.id
        """,
        (in_stock_days, out_of_stock_days),
    ).fetchall()
