import pytest
import pandas as pd
from Data_processing_cloud.Functions.valid_feedback import is_valid_feedback 

def test_is_valid_feedback():
    assert not is_valid_feedback(None)
    assert not is_valid_feedback("")
    assert not is_valid_feedback(" ")
    assert not is_valid_feedback(pd.NA)
    assert not is_valid_feedback(pd.NaT)
    assert not is_valid_feedback("A")
    assert not is_valid_feedback("A B")
    assert not is_valid_feedback("This is")

    assert is_valid_feedback("This is good")
    assert is_valid_feedback("A B C")
    assert is_valid_feedback("Feedback with more than three words.")

    assert not is_valid_feedback("!")
    assert not is_valid_feedback("A B!")
    assert is_valid_feedback("This is good!")
    assert is_valid_feedback("Check this out: amazing!")

    assert not is_valid_feedback("123")
    assert not is_valid_feedback("1 2")
    assert is_valid_feedback("This is 100% valid")

    assert not is_valid_feedback("123 abc")
    assert is_valid_feedback("123 abc def")

if __name__ == "__main__":
    pytest.main()
