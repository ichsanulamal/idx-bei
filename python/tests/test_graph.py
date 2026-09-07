"""
Tests for Neo4j UBO resolution, circular cross-holdings, and board centrality.
"""

import unittest
from unittest.mock import MagicMock, patch

from idx.graph import calculate_board_centrality, detect_cross_holdings, get_ubo_tree


class TestGraph(unittest.TestCase):
    @patch("idx.graph.get_neo4j_driver")
    def test_get_ubo_tree_neo4j(self, mock_get_driver):
        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_res = MagicMock()
        mock_res.single.return_value = {
            "name": "Bank Central Asia Tbk",
            "ultimate_owners": ["Djarum Group", "Robert Budi Hartono"],
            "key_insiders": ["Jahja Setiaatmadja"],
        }
        mock_session.run.return_value = mock_res
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_get_driver.return_value = mock_driver

        tree = get_ubo_tree("BBCA")
        self.assertEqual(tree["ticker"], "BBCA")
        self.assertEqual(tree["engine"], "neo4j")
        self.assertIn("Djarum Group", tree["ultimate_owners"])

    def test_get_ubo_tree_offline_fallback(self):
        with patch("idx.graph.get_neo4j_driver", return_value=None):
            tree = get_ubo_tree("BBCA")
            self.assertIn("ticker", tree)
            self.assertEqual(tree["ticker"], "BBCA")

    def test_detect_cross_holdings_fallback(self):
        with patch("idx.graph.get_neo4j_driver", return_value=None):
            loops = detect_cross_holdings()
            self.assertIsInstance(loops, list)
            self.assertGreaterEqual(len(loops), 1)

    def test_calculate_board_centrality_fallback(self):
        with patch("idx.graph.get_neo4j_driver", return_value=None):
            df_c = calculate_board_centrality(top_n=10)
            self.assertIn("insider", df_c.columns)
            self.assertIn("board_seats", df_c.columns)

    @patch("idx.graph.get_neo4j_driver")
    def test_detect_cross_holdings_neo4j(self, mock_get_driver):
        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_session.run.return_value.data.return_value = [
            {"loop_nodes": ["BRPT", "TPIA", "BRPT"], "loop_depth": 2}
        ]
        mock_get_driver.return_value = mock_driver

        loops = detect_cross_holdings()
        self.assertEqual(len(loops), 1)

    @patch("idx.graph.get_neo4j_driver")
    def test_calculate_board_centrality_neo4j(self, mock_get_driver):
        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_session.run.return_value.data.return_value = [
            {"insider": "Test Insider", "board_seats": 5, "companies": ["BBCA", "BBRI"]}
        ]
        mock_get_driver.return_value = mock_driver

        df = calculate_board_centrality(top_n=5)
        self.assertEqual(len(df), 1)
        self.assertEqual(df.iloc[0]["insider"], "Test Insider")

    @patch("idx.graph.get_ubo_tree")
    def test_get_company_network(self, mock_get_ubo):
        from idx.graph import get_company_network

        mock_get_ubo.return_value = {
            "ticker": "BBCA",
            "company_name": "Bank Central Asia Tbk",
            "engine": "neo4j",
            "ultimate_owners": ["Djarum Group"],
            "shareholders": [{"name": "PT Dwimuria Investama", "pct": 54.9, "pengendali": True}],
            "directors": [{"name": "Jahja Setiaatmadja", "title": "President Director"}],
            "commissioners": [{"name": "Raden Pardede", "title": "Commissioner"}],
            "subsidiaries": [{"name": "PT BCA Finance", "pct": 99.9}],
            "interlocks": [{"insider": "Jahja Setiaatmadja", "company": "JECC"}],
        }

        res = get_company_network("BBCA")
        self.assertEqual(res["ticker"], "BBCA")
        self.assertGreaterEqual(len(res["nodes"]), 4)
        self.assertGreaterEqual(len(res["edges"]), 3)
        self.assertEqual(res["summary"]["controlling_owner"], "PT Dwimuria Investama")
        self.assertEqual(res["summary"]["engine"], "neo4j")

    @patch("idx.graph.get_ubo_tree")
    def test_get_company_network_not_found(self, mock_get_ubo):
        from idx.graph import get_company_network

        mock_get_ubo.return_value = {"ticker": "XYZ", "status": "not_found"}
        res = get_company_network("XYZ")
        self.assertEqual(len(res["nodes"]), 0)


if __name__ == "__main__":
    unittest.main()
