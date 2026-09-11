"""Unit tests for LHKPN & PEP Political Capital Radar."""

from idx.lhkpn_radar import LHKPNRadar, clean_name
from idx.mcp.server import handle_tool_call


def test_clean_name():
    assert clean_name("DR. H. PRABOWO SUBIANTO, S.E., M.M.") == "PRABOWO SUBIANTO"
    assert clean_name("IR. HAMID AWALUDDIN, S.H., PH.D.") == "HAMID AWALUDDIN"
    assert clean_name("ERICK THOHIR, B.A., M.B.A.") == "ERICK THOHIR"


def test_lhkpn_radar_scan():
    radar = LHKPNRadar()
    overlaps = radar.scan_pep_overlaps()
    assert len(overlaps) >= 6
    names = [o["official_name"] for o in overlaps]
    assert "PRABOWO SUBIANTO" in names
    assert "ERICK THOHIR" in names
    assert "LUHUT BINSAR PANDJAITAN" in names


def test_lhkpn_radar_query_filter():
    radar = LHKPNRadar()
    adro_overlaps = radar.scan_pep_overlaps(query="ADRO")
    assert len(adro_overlaps) >= 1
    assert any("ADRO" in [t["ticker"] for t in o["tickers"]] for o in adro_overlaps)

    toba_overlaps = radar.scan_pep_overlaps(query="TOBA")
    assert len(toba_overlaps) >= 1
    assert any("TOBA" in [t["ticker"] for t in o["tickers"]] for o in toba_overlaps)


def test_mcp_pep_tool_call():
    resp = handle_tool_call("idx_scan_pep_overlaps", {"query": "Erick"})
    assert "ERICK THOHIR" in resp
    assert "ADRO" in resp
