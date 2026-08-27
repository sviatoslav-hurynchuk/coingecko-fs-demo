import pytest
from backend.app.models import CryptoProject, FilterCriteria
from backend.app.services.filter_service import CryptoFilterService


@pytest.fixture
def base_valid_project():
    return CryptoProject(
        id="test-coin",
        symbol="tst",
        name="Test Coin",
        current_price=1.0,
        market_cap=10_000_000.0,
        fully_diluted_valuation=20_000_000.0,
        total_volume=100_000.0,
        total_supply=20_000_000.0,
        max_supply=20_000_000.0,
        preview_listing=True,
        tvl=200_000.0
    )


def test_valid_project_passes_all_default_criteria(base_valid_project):
    criteria = FilterCriteria()
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, criteria)
    assert is_match is True
    assert reason is None


def test_market_cap_zero_or_negative_fails(base_valid_project):
    base_valid_project.market_cap = 0.0
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "Market cap" in reason


def test_preview_listing_false_fails(base_valid_project):
    base_valid_project.preview_listing = False
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "preview_listing" in reason


def test_max_supply_not_equal_total_supply_fails(base_valid_project):
    base_valid_project.total_supply = 20_000_000.0
    base_valid_project.max_supply = 50_000_000.0
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "max_supply" in reason


def test_missing_supply_fails_equality_check(base_valid_project):
    base_valid_project.max_supply = None
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "must be defined" in reason


def test_fdv_above_100m_fails(base_valid_project):
    base_valid_project.fully_diluted_valuation = 150_000_000.0
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "FDV" in reason


def test_fdv_boundary_100m_fails(base_valid_project):
    base_valid_project.fully_diluted_valuation = 100_000_000.0
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "FDV" in reason


def test_volume_below_or_equal_50k_fails(base_valid_project):
    base_valid_project.total_volume = 50_000.0
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "Volume" in reason


def test_tvl_below_or_equal_50k_fails(base_valid_project):
    base_valid_project.tvl = 49_999.0
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "TVL" in reason


def test_tvl_none_fails(base_valid_project):
    base_valid_project.tvl = None
    is_match, reason = CryptoFilterService.matches_project(base_valid_project, FilterCriteria())
    assert is_match is False
    assert "TVL" in reason


def test_partial_search_filter():
    proj1 = CryptoProject(
        id="ethereum",
        symbol="eth",
        name="Ethereum",
        current_price=3000.0,
        market_cap=10_000_000.0,
        fully_diluted_valuation=20_000_000.0,
        total_volume=100_000.0,
        total_supply=10_000.0,
        max_supply=10_000.0,
        preview_listing=True,
        tvl=100_000.0
    )
    proj2 = CryptoProject(
        id="bitcoin",
        symbol="btc",
        name="Bitcoin",
        current_price=60000.0,
        market_cap=10_000_000.0,
        fully_diluted_valuation=20_000_000.0,
        total_volume=100_000.0,
        total_supply=10_000.0,
        max_supply=10_000.0,
        preview_listing=True,
        tvl=100_000.0
    )

    criteria = FilterCriteria()
    results = CryptoFilterService.apply_filters([proj1, proj2], criteria, search_query="eth")
    assert len(results) == 1
    assert results[0].id == "ethereum"
