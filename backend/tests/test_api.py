import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "plan" in data
    assert "base_url" in data


def test_get_projects_default():
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "applied_filters" in data
    assert "source" in data
    assert isinstance(data["items"], list)

    for item in data["items"]:
        assert item["market_cap"] > 0
        assert item["preview_listing"] is True
        assert item["max_supply"] == item["total_supply"]
        assert (item["fully_diluted_valuation"] or 0) < 100_000_000
        assert item["total_volume"] > 50_000
        assert (item["tvl"] or 0) > 50_000


def test_get_projects_custom_fdv_filter():
    response = client.get("/api/projects?max_fdv=10000000")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        fdv = item["fully_diluted_valuation"] or (item["current_price"] * (item["max_supply"] or 0))
        assert fdv < 10_000_000


def test_get_projects_search():
    response = client.get("/api/projects?search=aero")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert "aero" in item["name"].lower() or "aero" in item["symbol"].lower()
