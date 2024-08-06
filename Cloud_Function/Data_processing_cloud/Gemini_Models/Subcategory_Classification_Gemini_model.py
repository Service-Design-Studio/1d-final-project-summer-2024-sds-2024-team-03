#!/usr/bin/env python
# coding: utf-8

# In[ ]:


# pip install --upgrade google-cloud-aiplatform
# gcloud auth application-default login


# In[12]:

import logging
import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
import pandas as pd
from Data_processing_cloud.matching_subproduct import find_best_match
from Data_processing_cloud.pubsub_helper import publish_message


#line by line
def classify_subcategory(text):
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    textsi_1 = """You are a system that helps to categorize customer feedback as input into product categories for a banking company. 

Classify the given text into one of the following categories only (exact case sentivity and name and spacing): Debit Card, Credit Card, Personal Loan, Cashline, Education Loan (Tuition Fee Loan), Renovation Loan, Mortgage/Home Loan, Car Loan, DigiBank App, Internet Banking(iBanking), Paylah!, Vickers, Unit-Trust, Non-Unit Trust/Equities, digiPortfolio, Treasures Relationship Manager(RM), SSB, VTM(Video Teller Machine), Phone Banking, Coin Deposit Machine, General Insurance, Life Insurance, Payments, DBS Deposit Account, Paynow, Cheque, GIRO, digiVault, DBS Hotline, DBS Branches/Staff, Overseas Transfer, Contact Center, Others, DBS Wealth Planning Manager, Websites, DBS Treasures (General). 

<INSTRUCTIONS> 
1. If the text consists of a single word or is a general comment without detailed information about products (e.g., 'Well Done', 'good', 'nil', 'great', 'No Comment', 'Na', '-', '..'), classify it as Others. 
2. If the text mentions talking or asking someone for help or waiting for a response or metions customer service officer (CSO), classify it as DBS Branches/Staff. However if it is specifically in a call then classify it as "DBS Hotline". 
3. If the text mentions 'account','interest rates', 'account opening', 'withdrawal', or 'deposit', classify it as DBS Deposit Account. Provide only the category name as your answer. 
4. If the text mentions 'automated machines' or 'ATM', classify it as 'SSB' which is the full form for Self-Service Banking.
5. If the text mentions 'digital banking' or 'app', classify it as DigiBank App.
6. If the text mentions 'trading', classify it as Vickers.
7. If the text mentions 'video teller machine', classify as VTM.
8. If the text mentions a RM/staff or receiving help with DBS Treasures, classify it as Treasures Relationship Manager(RM), otherwise classify it as DBS Treasures (General)
9. If the text mentions 'coin deposit' classify it as Coin Deposit Machine (not Coint)

Provide only the category name as your answer with no quotations.
</INSTRUCTIONS> 

<EXAMPLES> 
<Input>Personally banking interest rates are not as attractive as other banks in Singapore.</Input> 
<Output>DBS Deposit Account</Output> 
<Reason>It talks about banking and its interest rates which are associated with account-related services.</Reason> 

<Input>CM says that coin deposit machine does not give the option to deposit coins.</Input>
<Output> Coin Deposit Machine </Output>

<Input>nil</Input> 
<Output>Others</Output> 
<Reason>It is a general comment without detailed information about products.</Reason> 

<Input>Need help with my account so I called</Input> 
<Output>DBS Hotline</Output> 
<Reason>It mentions needing help, indicating interaction with customer support via call.</Reason> 

<Input>The app is very poor and dated, even the pin entry keyboard is non standard and buggy. You should really be 100% native like the main banking app. I want a super simple view on how my stocks are performing and $ based on the original purchase price. I find it really amazing that the only way to make such a fundamental view is with a custom made custom portfolio.</Input> 
<Output>Non-Unit Trust/Equities</Output> 
<Reason>It discusses the performance and management of stocks, which falls under non-unit trust investments.</Reason> 

</EXAMPLES>""" 

    try:
        generation_config = {
            "max_output_tokens": 2048,
            "temperature": 1,
            "top_p": 1,
        }
        safety_settings = {
            generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
            generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
            generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
            generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }

        model = GenerativeModel(
            "projects/903333611831/locations/asia-southeast1/endpoints/6000136107843387392",
            system_instruction=textsi_1
        )
        chat = model.start_chat(response_validation=False)
        logging.info("Model chat session started. Sending text for subcategory classification.")
        response = chat.send_message(
            text,
            generation_config=generation_config,
            safety_settings=safety_settings
        )

        # logging.info(f"Received response: {response.text}")
        if response.text == 'Coint Deposit Machine':
            return 'Coin Deposit Machine'
        else:
            result= find_best_match(response.text)
            return result
        

    except Exception as e:
        print(f"Model response timed out: {e}")
        publish_message(f"Model response timed out: {e}","ERROR")
        return "Timeout - Operation could not be completed"
    # except GoogleAPICallError as e:
    #     print(f"Failed to call model: {e}")
    #     return "Error - Could not process the request"

