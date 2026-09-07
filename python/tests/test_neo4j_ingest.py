import sys
from unittest.mock import MagicMock

# Mock dependencies only if unavailable – unconditional global mocks here would
# leak into other tests (e.g. a MagicMock pandas breaks pyarrow.to_pandas).
try:
    import neo4j  # noqa: F401
except ImportError:
    sys.modules["neo4j"] = MagicMock()
try:
    import dotenv  # noqa: F401
except ImportError:
    sys.modules["dotenv"] = MagicMock()

import unittest
from io import StringIO
from unittest.mock import patch

from idx import graph as neo4j_ingest


class TestNeo4jIngest(unittest.TestCase):
    def test_ingest_all_stock_profiles_file_not_found(self):
        """Test that ingest_all_stock_profiles handles FileNotFoundError gracefully."""
        # Using a path that definitely doesn't exist
        dummy_path = "non_existent_file_12345.json"

        # Capture stdout to verify the error message
        with patch("sys.stdout", new=StringIO()) as fake_out:
            # The function should catch FileNotFoundError and return None
            result = neo4j_ingest.ingest_all_stock_profiles(data_path=dummy_path)

            output = fake_out.getvalue().strip()
            self.assertIn(f"Error: Data file not found at {dummy_path}", output)
            self.assertIsNone(result)

    def test_ingest_all_stock_summaries_file_not_found(self):
        """Test that ingest_all_stock_summaries handles FileNotFoundError gracefully."""
        # Using a path that definitely doesn't exist
        dummy_path = "non_existent_file_12345.json"

        # Capture stdout to verify the error message
        with patch("sys.stdout", new=StringIO()) as fake_out:
            # The function should catch FileNotFoundError and return None
            result = neo4j_ingest.ingest_all_stock_summaries(data_path=dummy_path)

            output = fake_out.getvalue().strip()
            self.assertIn(f"Error: Data file not found at {dummy_path}", output)
            self.assertIsNone(result)

    def test_clean_indonesian_name(self):
        self.assertEqual(neo4j_ingest.clean_indonesian_name("  Budi Santoso  "), "Budi Santoso")
        self.assertEqual(neo4j_ingest.clean_indonesian_name(""), "")
        self.assertEqual(neo4j_ingest.clean_indonesian_name(None), "")

    def test_ingest_stock_profiles_tx(self):
        mock_tx = MagicMock()
        batch = [
            {
                "kode": "TEST",
                "name": "Test Company",
                "directors": [{"name": "Director 1", "jabatan": "Dir", "afiliasi": False}],
                "commissioners": [{"name": "Comm 1", "jabatan": "Comm", "independen": True}],
                "secretaries": [{"name": "Sec 1", "phone": "123", "email": "a@b.com", "fax": ""}],
                "audit_committee": [{"name": "Aud 1", "jabatan": "Head"}],
                "shareholders": [
                    {
                        "name": "Shareholder 1",
                        "jumlah": 100,
                        "kategori": "Local",
                        "pengendali": True,
                        "persentase": 51.0,
                    }
                ],
                "subsidiaries": [
                    {
                        "name": "Sub 1",
                        "bidang_usaha": "Finance",
                        "lokasi": "Jakarta",
                        "jumlah_aset": 1000,
                        "satuan": "Juta",
                        "status_operasi": "Aktif",
                        "tahun_komersil": "2020",
                        "mata_uang": "IDR",
                        "persentase": 90.0,
                    }
                ],
            }
        ]
        neo4j_ingest.ingest_stock_profiles(mock_tx, batch)
        self.assertGreaterEqual(mock_tx.run.call_count, 7)

    @patch("idx.graph.get_neo4j_driver")
    def test_ingest_all_stock_profiles_success(self, mock_get_driver):
        import json
        import tempfile

        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_get_driver.return_value = mock_driver

        data = {
            "TEST": {
                "Profiles": [
                    {
                        "KodeEmiten": "TEST",
                        "NamaEmiten": "Test Corp",
                        "TanggalPencatatan": "2020-01-01",
                    }
                ],
                "Direksi": [{"Nama": "Budi", "Jabatan": "Direktur Utama"}],
            }
        }
        with tempfile.NamedTemporaryFile("w", delete=False, suffix=".json") as f:
            json.dump(data, f)
            temp_path = f.name

        try:
            res = neo4j_ingest.ingest_all_stock_profiles(data_path=temp_path)
            self.assertTrue(res)
            mock_session.execute_write.assert_called()
        finally:
            import os

            if os.path.exists(temp_path):
                os.remove(temp_path)

    @patch("idx.graph.get_neo4j_driver")
    def test_ingest_all_stock_summaries_success(self, mock_get_driver):
        import json
        import tempfile

        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_get_driver.return_value = mock_driver

        data = {
            "data": [
                {
                    "StockCode": "TEST",
                    "Date": "2026-08-01T00:00:00",
                    "OpenPrice": 1000,
                    "Close": 1050,
                }
            ]
        }
        with tempfile.NamedTemporaryFile("w", delete=False, suffix=".json") as f:
            json.dump(data, f)
            temp_path = f.name

        try:
            res = neo4j_ingest.ingest_all_stock_summaries(data_path=temp_path)
            self.assertTrue(res)
            mock_session.execute_write.assert_called()
        finally:
            import os

            if os.path.exists(temp_path):
                os.remove(temp_path)


if __name__ == "__main__":
    unittest.main()
