import pytest
import pandas as pd
from datetime import datetime
from Data_processing_cloud.Functions.format_date import format_date  

def test_format_date_valid():
    assert format_date('22/04/2024 15:45') == '22/04/24'
    assert format_date('22/04/2024') == '22/04/24'
    assert format_date('22/04/24') == '22/04/24'
    assert format_date('22/4/24 15:45') == '22/04/24'
    assert format_date('22/4/2024') == '22/04/24'
    assert format_date('2024-04-22') == '22/04/24'
    assert format_date('2024-04-22 15:45:00') == '22/04/24'
    assert format_date('24-04-22') == '22/04/24'
    assert format_date('24-04-22 15:45:00') == '22/04/24'

def test_format_date_invalid():
    assert format_date(None) == None
    assert format_date('') == None
    assert format_date(' ') == None
    assert format_date(pd.NA) == None
    assert format_date(pd.NaT) == None
    assert format_date('invalid date') == None
    assert format_date('99/99/9999') == None
    assert format_date(1234567890.0) == None

def test_format_date_edge_cases():
    assert format_date('22/04/24 25:61') == None  # Invalid time
    assert format_date('31/02/2024') == None  # Invalid date
    assert format_date('2024-13-01') == None  # Invalid month
    assert format_date('29/02/2019') == None  # Non-leap year

def test_format_date_whitespace():
    assert format_date(' 22/04/2024 15:45 ') == '22/04/24'
    assert format_date(' 2024-04-22 ') == '22/04/24'

if __name__ == "__main__":
    pytest.main()
