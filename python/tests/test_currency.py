"""
Unit tests for the dynamic USD/IDR exchange rate engine.
"""

import json
import os
import tempfile
import unittest
from unittest.mock import patch

from idx.core.currency import get_usd_idr_rate


class TestCurrencyEngine(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.cache_file = os.path.join(self.temp_dir.name, "usd_idr_rate.json")

    def tearDown(self):
        self.temp_dir.cleanup()

    @patch("idx.core.currency.CACHE_FILE")
    def test_default_rate_fallback(self, mock_cache_file):
        mock_cache_file.__str__.return_value = self.cache_file
        # When cache doesn't exist and network fetch fails, returns default
        with patch("idx.core.currency.fetch_live_usd_idr_rate", return_value=None):
            with patch("idx.core.currency.CACHE_FILE", self.cache_file):
                rate = get_usd_idr_rate(default_rate=16250.0)
                self.assertEqual(rate, 16250.0)

    def test_cached_rate_retrieval(self):
        # Seed cache
        with open(self.cache_file, "w", encoding="utf-8") as f:
            json.dump({"rate": 16450.0, "timestamp": 9999999999.0, "source": "test"}, f)

        with patch("idx.core.currency.CACHE_FILE", self.cache_file):
            rate = get_usd_idr_rate()
            self.assertEqual(rate, 16450.0)

    def test_live_rate_fetch_and_cache(self):
        with patch("idx.core.currency.CACHE_FILE", self.cache_file):
            with patch("idx.core.currency.fetch_live_usd_idr_rate", return_value=16325.0):
                rate = get_usd_idr_rate(force_refresh=True)
                self.assertEqual(rate, 16325.0)
                # Verify file was written
                self.assertTrue(os.path.exists(self.cache_file))
                with open(self.cache_file) as f:
                    data = json.load(f)
                    self.assertEqual(data["rate"], 16325.0)

    def test_corrupt_cache_handling(self):
        with open(self.cache_file, "w") as f:
            f.write("invalid json{")
        with patch("idx.core.currency.CACHE_FILE", self.cache_file):
            with patch("idx.core.currency.fetch_live_usd_idr_rate", return_value=16200.0):
                rate = get_usd_idr_rate()
                self.assertEqual(rate, 16200.0)

    @patch("yfinance.Ticker")
    def test_fetch_live_via_yfinance_fast_info(self, mock_ticker_cls):
        from idx.core.currency import fetch_live_usd_idr_rate

        mock_ticker = mock_ticker_cls.return_value
        mock_ticker.fast_info.last_price = 16250.0
        rate = fetch_live_usd_idr_rate()
        self.assertEqual(rate, 16250.0)

    @patch("yfinance.Ticker")
    def test_fetch_live_via_yfinance_history(self, mock_ticker_cls):
        import pandas as pd

        from idx.core.currency import fetch_live_usd_idr_rate

        mock_ticker = mock_ticker_cls.return_value
        mock_ticker.fast_info = None
        mock_ticker.history.return_value = pd.DataFrame({"Close": [16300.0]})
        rate = fetch_live_usd_idr_rate()
        self.assertEqual(rate, 16300.0)

    @patch("yfinance.Ticker")
    @patch("urllib.request.urlopen")
    def test_fetch_live_via_open_exchange_fallback(self, mock_urlopen, mock_ticker_cls):
        from unittest.mock import MagicMock

        from idx.core.currency import fetch_live_usd_idr_rate

        mock_ticker_cls.side_effect = RuntimeError("yfinance down")

        mock_resp = MagicMock()
        mock_resp.read.return_value = b'{"rates": {"IDR": 16400.0}}'
        mock_resp.__enter__.return_value = mock_resp
        mock_urlopen.return_value = mock_resp

        rate = fetch_live_usd_idr_rate()
        self.assertEqual(rate, 16400.0)
