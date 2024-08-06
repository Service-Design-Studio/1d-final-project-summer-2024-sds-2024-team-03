#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException

def is_english(text):
    try:
        return detect(str(text)) == 'en'
    except LangDetectException:
        return False

