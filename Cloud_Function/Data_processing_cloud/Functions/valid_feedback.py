#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd

def is_valid_feedback(feedback):
    if pd.isna(feedback):
        return False
    words = feedback.split()
    return len(feedback) > 1 and len(words) > 2

