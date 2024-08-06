#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
from datetime import datetime

# def format_date(date_str):
#     # Check if it's NaN or float first
#     if pd.isna(date_str) or isinstance(date_str, float):
#         return None  # Return None for invalid dates
    
#     # Convert to string and strip any whitespace
#     date_str = str(date_str).strip()
    
#     # Try to parse the date assuming it's in the format '22/4/2024 15:43'
#     try:
#         date_obj = datetime.strptime(date_str, '%d/%m/%Y %H:%M')
#         formatted_date = date_obj.strftime('%d/%m/%Y')
#         return formatted_date
#     except ValueError:
#         pass
    
#     # Try to parse the date assuming it's in the format '22/04/24'
#     try:
#         date_obj = datetime.strptime(date_str, '%d/%m/%y')
#         formatted_date = date_obj.strftime('%d/%m/%y')
#         return formatted_date
#     except ValueError:
#         pass
    
#     # Try to parse the date assuming it's in the format '22/04/2024'
#     try:
#         date_obj = datetime.strptime(date_str, '%d/%m/%Y')
#         formatted_date = date_obj.strftime('%d/%m/%y')
#         return formatted_date
#     except ValueError:
#         pass

#     # If all parsing attempts fail, return None
#     return None

def format_date(date_str):
    # Check if it's NaN or float first
    if pd.isna(date_str) or isinstance(date_str, float):
        return None  # Return None for invalid dates
    
    # Convert to string and strip any whitespace
    date_str = str(date_str).strip()
    
    # Define the possible input formats
    input_formats = [
        '%d/%m/%Y %H:%M',  # '22/04/2024 15:45'
        '%d/%m/%Y',        # '22/04/2024'
        '%d/%m/%y',        # '22/04/24'
        '%d/%m/%y %H:%M',  # '22/4/24 15:45'
        '%d/%m/%Y',         # '22/4/2024'
        '%Y-%m-%d',        # '2024-04-22'
        '%Y-%m-%d %H:%M:%S', # '2024-04-22 15:45:00'
        '%y-%m-%d',        # '2024-04-22'
        '%y-%m-%d %H:%M:%S' # '2024-04-22 15:45:00'
    ]
    
    # Try to parse the date with the given formats
    for fmt in input_formats:
        try:
            date_obj = datetime.strptime(date_str, fmt)
            # Convert to the desired format '22/04/24'
            formatted_date = date_obj.strftime('%d/%m/%y')
            return formatted_date
        except ValueError:
            pass

    # If all parsing attempts fail, return None
    return None
