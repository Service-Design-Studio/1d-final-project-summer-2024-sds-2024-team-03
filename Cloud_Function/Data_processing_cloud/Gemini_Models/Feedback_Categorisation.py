import base64
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
import vertexai.preview.generative_models as generative_models
import pandas as pd
import json
import re

def feedback_categorisation(text,product):

  # Initialize Vertex AI with your project ID and location
#   project_id = "jbaaam"

#   vertexai.init(project=project_id, location="us-central1")



  textsi_1 = """
  You are a system that helps to categorise the customer feedbacks into the most relevant feedback category associated with the products. The output must only contain one feedback category

  <INSTRUCTIONS>
  1. First, recognize the product that the feedback is talking about. The feedback will be in the form [product]:feedback.
  2. Using the product mentioned in the feedback, identify the specific issue being discussed and match it to one of the feedback categories listed below and it must only be from the categories listed below. Ensure the feedback category is relevant to the product.

  Here are the products mapped to their associated Feedback Categories: 
  - Debit Card: ['Statement', 'Card Delivery', 'Card Application', 'Card Activation', 'Cashback', 'Rewards', 'Card Replacement', 'Card Renewal', 'Charges/Fees & Interest', 'Card Limit', 'Scam/Fraud', 'Staff related', 'Technical/System Related', 'T&C', 'Card Blocked']
  - Credit Card: ['Statement', 'Card Delivery', 'Card Application', 'Card Activation', 'Cashback', 'Rewards', 'Card Replacement', 'Card Renewal', 'Charges/Fees & Interest', 'Card Limit', 'Scam/Fraud', 'Staff related', 'Credit Application', 'Credit Limit', 'Supplementary Credit Card', 'Fee Waiver']
  - Personal Loan: ['Loan Settlement', 'Loan Application', 'Process Related', 'Charges/Fees & Interest', 'Loan Disbursement', 'Technical/System Related', 'Credit Loan', 'Staff Related', 'GIRO auto deduction']
  - Cashline: ['Loan Settlement', 'Loan Application', 'Process Related', 'Charges/Fees & Interest', 'Loan Disbursement', 'Technical/System Related', 'Credit Loan', 'Staff Related', 'GIRO auto deduction']
  - Education Loan (Tuition Fee Loan): ['Loan Settlement', 'Loan Application', 'Process Related', 'Charges/Fees & Interest', 'Loan Disbursement', 'Technical/System Related', 'Credit Loan', 'Staff Related', 'GIRO auto deduction']
  - Renovation Loan: ['Loan Settlement', 'Loan Application', 'Process Related', 'Charges/Fees & Interest', 'Loan Disbursement', 'Technical/System Related', 'Staff Related', 'GIRO auto deduction']
  - Mortgage/Home Loan: ['Loan Settlement', 'Loan Application', 'Process Related', 'Charges/Fees & Interest', 'Loan Disbursement', 'Technical/System Related',  'Staff Related', 'GIRO auto deduction']
  - Car Loan: ['Loan Settlement', 'Loan Application', 'Process Related', 'Charges/Fees & Interest', 'Loan Disbursement', 'Technical/System Related', 'Staff Related', 'GIRO auto deduction']
  - General Insurance: ['Rate/Policy', 'Process Related', 'Application', 'Staff Related', 'Claim Related']
  - Life Insurance: ['Rate/Policy', 'Process Related', 'Application', 'Staff Related', 'Claim Related']
  - Payments: ['Scam/Fraud', 'Technical/System Related']
  - DBS Deposit Account: ['Account Opening', 'Account Closure', 'Account Related (deposit/withdrawal)', 'Charges/Fees & Interest', 'Technical/System Related', 'Rewards', 'Payments', 'Features', 'UI/UX']
  - PayNow: ['Account Opening', 'Account Closure', 'Account Related (deposit/withdrawal)', 'Charges/Fees & Interest', 'Technical/System Related', 'Rewards', 'Payments', 'Features', 'UI/UX', 'Process', 'Transaction Related']
  - Cheque: ['Account Opening', 'Account Closure', 'Account Related (deposit/withdrawal)', 'Charges/Fees & Interest', 'Technical/System Related', 'Rewards', 'Payments']
  - GIRO: ['Account Opening', 'Account Closure', 'Account Related (deposit/withdrawal)', 'Technical/System Related', 'Rewards', 'Payments','Process Related]
  - Smart Buddy: ['Charges/Fees & Interest', 'Card replacement', 'Marketing & Promotions']
  - digiVault: ['Account Opening', 'Account Closure', 'Account Related (deposit/withdrawal)','Technical/System Related', 'Rewards', 'Payments']
  - DBS Hotline: ['Staff Related', 'Fraud/Scam', 'Waiting time', 'IVR menu']
  - DBS Branches/Staff: ['Staff related', 'Fraud/Scam', 'Technical/System Related', 'Process/Transaction Handling', 'Waiting time']
  - Websites: ['Content', 'Navigation', 'Clarity']
  - Overseas Transfer: ['Exchange Rates/Fee related', 'Scam/Fraud', 'Process', 'Rewards', 'Transaction Related', 'Features', 'Technical/System Related','UI/UX', 'Application']
  - Digibank App: ['Log In', 'Log Out', 'Technical/System Related', 'Process Related', 'Digital Token', 'OTP', 'Account Opening', 'Features','Bill statement','Transaction related' ,  'Charges/Fee & Interest', 'Advertisement', 'Others', 'Lag/Intermittent Logout']
  - Internet Banking(iBanking): ['Log In', 'Log Out', 'Technical/System Related', 'Process Related', 'Digital Token', 'OTP', 'Account Opening', 'Features', 'Charges/Fee & Interest', 'Advertisement', 'Others', 'Transaction related' ,'Lag/Intermittent Logout']
  - Paylah!: ['Log In', 'Log Out', 'Technical/System Related', 'Digital token', 'OTP','Features','Wallet Closure','Transaction Related','Marketing & promotions','Process related','UI/UX','CNY','Staff related','Account opening','Account closure','Account management', 'Advertisement']
  - Vickers: ['Fee related', 'Technical/System Related','Process related','Application', 'Digibot','Equity trading' ,'Statement','Rewards','Others','Features','OTP','UI/UX']
  - Unit Trust: ['Charges/Fees & Interest','Technical/System Related','Process related','Application','Digibot','Equity trading','Statement','Rewards','Features','Saving/Investment Plans']
  - Non-Unit Trust/Equities: ['Charges/Fees & Interest', 'Technical/System Related', 'Process related', 'Application', 'Digibot','Online Equity Trading','Statement','Rewards','Features','Saving/Investment Plans']
  - digiPortfolio: ['Charges/Fees & Interest','Technical/System Related', 'Process related', 'Application', 'Digibot', 'Equity Trading', 'Statement','Rewards','Features','Saving/Investment Plans']
  - Treasures Relationship Manager(RM): ['Charges/Fees & Interest', 'Process related', 'Staff related']
  - SSB: ['Passbook', 'Deposit/Withdrawal', 'Technical/System Related', 'Process related', 'Features','Deposit Discrepancy','Hardware','Card/Cash retain','Location','UI/UX','Service unavailability']
  - VTM(Video Teller Machine): ['Passbook','Technical/System Related', 'Process related', 'Features', 'Staff related','UI/UX']
  - Phone Banking: ['UI/UX','Process related', 'Others', 'Waiting time',' Verification process', 'IVR','Features','Transaction related']
  - Coin Deposit Machine: ['Passbook',' Deposit/Withdrawal', 'Technical/System Related', 'Process related']]
  - DBS Treasures (General):['Charges/Fees & Interest', 'Technical/System Related', 'Process related', 'Application', 'Digibot','Online Equity Trading','Statement','Rewards','Features','Saving/Investment Plans']
  - DBS Wealth Planning Manager:['Charges/Fees & Interest', 'Process related', 'Staff related']
  3. Be as specific to the feedback category as you can be. For example, if the feedback is talking about a UI/UX problem, do not categorize it under 'Technical/System Related'; classify it as 'UI/UX'. If the feedback is about login issues, classify it under 'Log In' instead of 'Technical/System Related'.
  4. The output is only the feedback category (DO NOT GIVE ANY REASONING).

  Here is some context for some feedback categories:
  - Verification Process: This category is dedicated to understanding customer experiences and challenges with the verification process required when contacting customer support via hotlines or doing phone banking. It includes feedback on the requirements to enter sensitive information like National ID or credit card numbers, and the system's response to input errors or delays or more. It refers to anything that requires to verify your details, or identity. Anything with the word verification or verify is it. 
  - UI/UX: Feedback concerning the design, usability, and functionality of user interfaces across banking services, including ATMs, digital banking apps, and online platforms. This category should capture customer experiences with issues like screen visibility, responsiveness of touch interfaces, and overall ease of navigating through digital and physical banking environments. Any feedback with interface belongs to here. 
  - IVR: This category collects insights into customer experiences with the Interactive Voice Response (IVR) system during phone banking. Feedback often includes issues with the systems navigation, option selection, timing out during entries, or difficulties in reaching a live agent can also include automated voice issues. This feedback is crucial for identifying pain points in the IVR journey and enhancing user experience.
  - IVR Menu: This category is focused on gathering customer feedback specifically related to the IVR menu layout, navigation, and functionality. This feedback is essential for identifying usability issues and opportunities for simplification.
  - Rate/Policy: This category includes the word rate. focuses on gathering customer opinions about the pricing and policy structures of financial and insurance products. It includes feedback on interest rates, insurance premiums, and general policy terms. This information is vital for assessing competitive positioning and customer satisfaction.
  - Digital Token: Feedback concerning experiences with the use and setup of digital tokens for securing transactions and account access. This category includes customer reports on the process of setting up digital tokens, the reliability and speed of token generation, and general satisfaction or frustration with using digital tokens instead of traditional physical tokens.
  - Card/Cash Retain Issues: Feedback concerning instances where ATMs retain customers' cards or cash during transactions. This category captures insights into the frequency of these occurrences, the impact on customer convenience, the effectiveness of the resolution process, and overall communication during such events.
  - CNY: Feedback concerning specific features, promotions, or services offered by the bank in celebration of or to facilitate activities during Chinese New Year or issues with them. This includes experiences with electronic red envelopes (eAng Baos), currency exchange issues during the festival, and any cultural considerations in service delivery.
  - Hardware: Feedback concerning issues with keypads, card readers, faint ink from printers, and overall ATM machine cleanliness and functionality. 
  - Others: If the feedbacks are very general and you feel like you need more context to understand, classify it as Others
  </INSTRUCTION>


  <EXAMPLE>
  <INPUT>
  "Digibank App: Unable to update my mail addresses because system doesn't allow me to key in numbers. So how am I suppose to key in house numbers or postcode??"
  </INPUT>
  <OUTPUT>
  Technical/System Issue
  </OUTPUT>

  <INPUT>
  "PayLah!:so many ads blocking the screen."
  </INPUT>
  <OUTPUT>
  Advertisement
  </OUTPUT>

  <INPUT>The above question should allow us to choose more options instead of one option </INPUT>
  <OUTPUT> Others </OUTPUT>

  </EXAMPLE>
  """


  # Initialize the Gemini model
  model = GenerativeModel(model_name="gemini-1.0-pro-002", system_instruction=textsi_1)
  safety_settings = {
        generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
        generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
        generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
        generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_ONLY_HIGH,
    }
  generation_config = GenerationConfig(
    temperature=0.3,  # Lower temperature for more deterministic output
    top_p=1,
    top_k=1,
    candidate_count=1,
    max_output_tokens=1024,  # Set a higher limit for more detailed responses
  )
  try:
        response = model.generate_content(f'{product}:{text}', generation_config=generation_config, safety_settings=safety_settings)
        json_result = response.text

        # Extract feedback category directly from the response text
        feedback_category = json_result.split(':')[-1].strip()

        # Clean the result
        pattern = r"[\*\'\"]"
        cleaned_result = re.sub(pattern, "", feedback_category)
        return cleaned_result

  except Exception as e:
      print(f"Unexpected error for feedback: {text}, product: {product}, error: {e}")
      return "Others"


