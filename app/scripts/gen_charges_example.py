"""Generates src/lib/charges-example.gen.json — the /  homepage cost illustration.

website/docs/06 §3.2: illustrative charge numbers on the site must be *computed*
by ``packages/charges`` (a real invocation, committed as a fixture with its
inputs shown), never typed into copy. This script is that invocation.

Run from the repo root:  uv run python website/app/scripts/gen_charges_example.py

The fixture is committed; re-run whenever the rate book changes (claims ledger
CL-004's review trigger). The scenario is one round trip: BUY then SELL,
Rs 1,00,000 notional each side, NSE equity intraday (MIS).
"""

from __future__ import annotations

import datetime as dt
import json
from pathlib import Path

from alphaedge_charges import ChargesEngine, default_rate_book

# Fixed, stated inputs — part of the fixture so the page can show them.
TRADE_DATE = dt.date(2026, 8, 1)
NOTIONAL_PAISE = 100_000_00  # Rs 1,00,000 each side
SEGMENT = "equity_intraday"
EXCHANGE = "NSE"

OUT = Path(__file__).resolve().parent.parent / "src" / "lib" / "charges-example.gen.json"


def main() -> None:
    engine = ChargesEngine(default_rate_book())
    buy = engine.compute(
        segment=SEGMENT,
        exchange=EXCHANGE,
        side="buy",
        order_turnover_paise=NOTIONAL_PAISE,
        trade_date=TRADE_DATE,
    )
    sell = engine.compute(
        segment=SEGMENT,
        exchange=EXCHANGE,
        side="sell",
        order_turnover_paise=NOTIONAL_PAISE,
        trade_date=TRADE_DATE,
    )

    lines = [
        ("Brokerage", buy.brokerage, sell.brokerage),
        ("STT", buy.stt, sell.stt),
        ("Exchange transaction", buy.exchange_txn, sell.exchange_txn),
        ("SEBI fee", buy.sebi_fee, sell.sebi_fee),
        ("Stamp duty", buy.stamp_duty, sell.stamp_duty),
        ("GST", buy.gst, sell.gst),
    ]
    fixture = {
        "_generated_by": "website/app/scripts/gen_charges_example.py — do not edit by hand",
        "inputs": {
            "scenario": "One intraday round trip (BUY + SELL)",
            "notional_paise_per_side": NOTIONAL_PAISE,
            "segment": SEGMENT,
            "exchange": EXCHANGE,
            "product": "MIS",
            "trade_date": TRADE_DATE.isoformat(),
        },
        "lines": [
            {"label": label, "buy_paise": b, "sell_paise": s} for label, b, s in lines
        ],
        "buy_total_paise": buy.total,
        "sell_total_paise": sell.total,
        "round_trip_total_paise": buy.total + sell.total,
    }
    OUT.write_text(json.dumps(fixture, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUT} (round trip total: {fixture['round_trip_total_paise']} paise)")


if __name__ == "__main__":
    main()
