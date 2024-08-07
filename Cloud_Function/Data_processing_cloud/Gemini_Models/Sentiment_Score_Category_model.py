#!/usr/bin/env python
# coding: utf-8

import vertexai
from vertexai.generative_models import GenerativeModel
import vertexai.preview.generative_models as generative_models
import json
import logging
from google.api_core.exceptions import ResourceExhausted
import time

def classify_sentiment(text):
    vertexai.init(project="jbaaam", location="us-central1")
    if not text.strip():  # Check if the text is empty or contains only whitespace
        return 2.6, "Neutral"

    # Define the system instruction text for sentiment analysis
    system_instruction= """
You are a Sentiment Analyzer for a Bank. Analyze customer feedback texts to extract meaningful insights and sentiment. Provide only the JSON format as the outcome.

Follow these specific instructions to process the text:

<INSTRUCTIONS>
 1. If the feedback includes a \"question:answer\" format (separated by the first colon in the text), use the question as context for understanding the nature of the feedback for example if it is comparative in nature.
 2. Identify key comparative words or phrases that indicate a comparison with other banks or products.
 3. Generate a sentiment score on a scale from 0.0 to 5.0, where 0 indicates extreme dissatisfaction and 5 indicates high satisfaction.
 4. Categorize the sentiment based on the following ranges:
    - 0.0 to 1.0: \'Frustrated\': Indicates severe dissatisfaction from unresolved or recurring issues. Customers are unlikely to recommend the product or service and may warn others against using it.

    - 1.1 to 2.5: \'Unsatisfied\': Reflects displeasure from specific shortcomings. Customers are hesitant to recommend and may highlight negative aspects when discussing the product or service.

    - 2.6 to 3.5: \'Neutral\': Represents indifference; experiences are neither significantly positive nor negative. Recommendations may be lukewarm or noncommittal. Short feedback with no/minimal context

    - 3.6 to 4.5: \'Satisfied\': Customers are generally pleased and feel their expectations have been met. They are likely to recommend the product or service, acknowledging some minor flaws.

    - 4.6 to 5.0: \'Excited\': Shows high enthusiasm and exceeded expectations. Customers actively promote the product or service, sharing positive experiences and recommending it highly.5. Provide a detailed description of the sentiment.
6. If the feedback does not give you any sentiment value and you need addition context, then it belongs to the Neutral Category.
7. Ensure the output is formatted in a valid JSON with sentiment_score, sentiment_category, sentiment_description only
</INSTRUCTIONS>

<EXAMPLES>
<Input>
"Why are you MORE satisfied with DBS' local payment and transfer services than [Field-Competitor_Bank]\'s?: More ATMs, very easy to use (payment/transfer)\"
</Input>
<Output>
{"sentiment_score": .3.7,"sentiment_category": "Satisfied","sentiment_description": "The customer expresses a higher satisfaction with DBS due to more ATMs and easier usability compared to [Field-Competitor_Bank]."}
</Output>

<Input>
"Why are you LESS satisfied with DBS' local payment and transfer services than [Field-Competitor_Bank]\'s?: Credit card rebate payment without tie to monthly spending (payment/transfer)"
</Input>
<Output>
{"sentiment_score": 2.4,"sentiment_category": "Unsatisfied","sentiment_description": "The customer is less satisfied due to the lack of tied rebates with DBS compared to [Field-Competitor_Bank], suggesting a desire for better benefits."}
</Output>

<Input>
"Uninstall paylah when after reinstall have difficulty authentication my email when I tried many times"
</Input>
<Output>
{"sentiment_score":1.3,"sentiment_category":"Frustrated","sentiment_description":"The customer expresses significant frustration due to difficulties in re-authenticating their email after reinstalling the Paylah app, despite multiple attempts. This experience has likely led to a negative perception of the app\'s usability and customer support."}
</Output>

<Input>
"Meh"
</Input>

<Output>
{"sentiment_score":2.6,"sentiment_category":"Neutral","sentiment_description":"The customer has no comments and hence is neutral."}
</Output>


</EXAMPLES>
"""

    # Configure the model
    model = GenerativeModel(
        "gemini-1.5-flash-001",
        system_instruction=[system_instruction]
    )

    # Setup generation configuration
    generation_config = {
        "max_output_tokens": 256,
        "temperature": 0.2,
        "top_p": 0.95,
    }

    # Define safety settings
    safety_settings = {
        generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    }

    responses = model.generate_content(
        [text],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=False,
    )

    
    retries = 0
    max_retries=2
    while retries < max_retries:
        try:
            responses = model.generate_content(
                [text],
                generation_config=generation_config,
                safety_settings=safety_settings,
                stream=False,
            )
            json_data = responses.text
            # print(json_data)
            clean_json_string = json_data.strip('```json \n')
            data = json.loads(clean_json_string)

            if "sentiment_score" in data and "sentiment_category" in data:
                return data["sentiment_score"], data["sentiment_category"]
            else:
                raise ValueError("JSON response does not contain expected keys.")
        
        except Exception as e:
            logging.error(f"Attempt {retries+1}: Error occurred - {e}")
            retries += 1
            if retries < max_retries:
                logging.info("Retrying after 10 seconds...")
                time.sleep(10)
            else:
                logging.error("Max retries exceeded.")
                return None, None



###PRO MODEL
# import vertexai
# from vertexai.generative_models import GenerativeModel
# import vertexai.preview.generative_models as generative_models
# import json

# def classify_sentiment(text):
#     vertexai.init(project="jbaaam", location="us-central1")

#     # Define the system instruction text for sentiment analysis
#     system_instruction= """\"\"\"
# You are a Sentiment Analyzer for a Bank. Analyze customer feedback texts to extract meaningful insights and sentiment. Ensure the output is ONLY a valid JSON format with sentiment_score, sentiment_category, sentiment_description only. Follow these specific instructions to process the text:

# <INSTRUCTIONS>
# 1. If the feedback includes a \"question:answer\" format (separated by the first colon in the text), use the question as context for understanding the nature of the feedback for example if it is comparative in nature.
# 2. Identify key comparative words or phrases that indicate a comparison with other banks or products.
# 3. Generate a sentiment score on a scale from 0.0 to 5.0, where 0 indicates extreme dissatisfaction and 5 indicates high satisfaction.
# 4. Categorize the sentiment based on the following ranges:
# - 0.0 to 1.0: \'Frustrated\': Indicates severe dissatisfaction from unresolved or recurring issues. Customers are unlikely to recommend the product or service and may warn others against using it.

# - 1.1 to 2.5: \'Unsatisfied\': Reflects displeasure from specific shortcomings. Customers are hesitant to recommend and may highlight negative aspects when discussing the product or service.

# - 2.6 to 3.5: \'Neutral\': Represents indifference; experiences are neither significantly positive nor negative. Recommendations may be lukewarm or noncommittal. Short feedback with no/minimal context

# - 3.6 to 4.5: \'Satisfied\': Customers are generally pleased and feel their expectations have been met. They are likely to recommend the product or service, acknowledging some minor flaws.

# - 4.6 to 5.0: \'Excited\': Shows high enthusiasm and exceeded expectations. Customers actively promote the product or service, sharing positive experiences and recommending it highly.5. Provide a detailed description of the sentiment.
# 6. Ensure the output is ONLY a valid JSON format with sentiment_score, sentiment_category, sentiment_description only
# <OUTPUT Format>
# {\"sentiment_score\": int, \"sentiment_category\":string, \"sentiment_description\":short description only}
# </OUTPUT FORMAT>

# </INSTRUCTIONS>
# <EXAMPLE>

# input: Why are you MORE satisfied with DBS\\\' local payment and transfer services than [Field-Competitor_Bank]\\\'s?: More ATMs, very easy to use (payment/transfer)
# output: {
# \\\"sentiment_score\\\": 3.7,
# \\\"sentiment_category\\\": \\\"Satisfied\\\",
# \\\"sentiment_description\\\": \\\"The customer expresses a higher satisfaction with DBS due to more ATMs and easier usability compared to [Field-Competitor_Bank].\\\"
# }

# input: Why are you LESS satisfied with DBS\\\' local payment and transfer services than [Field-Competitor_Bank]\\\'s?: Credit card rebate payment without tie to monthly spending (payment/transfer)
# output: {
# \\\"sentiment_score\\\": 2.4,
# \\\"sentiment_category\\\": \\\"Unsatisfied\\\",
# \\\"sentiment_description\\\": \\\"The customer is less satisfied due to the lack of tied rebates with DBS compared to [Field-Competitor_Bank], suggesting a desire for better benefits.\\\"
# }

# input: Uninstall paylah when after reinstall have difficulty authentication my email when I tried many times
# output: {"sentiment_score\\\":1.3,\\\"sentiment_category":"Frustrated","sentiment_description":"The customer expresses significant frustration due to difficulties in re-authenticating their email after reinstalling the Paylah app, despite multiple attempts. This experience has likely led to a negative perception of the app\\\'s usability and customer support.\\\"}

# input: Meh
# output: {"sentiment_score":2.6,"sentiment_category":"Neutral","sentiment_description":"The customer has no comments and hence is neutral."}

# </EXAMPLE>"""


#     # Configure the model
#     model = GenerativeModel(
#         "gemini-1.0-pro-002",
#         system_instruction=[system_instruction]
#     )

#     # Setup generation configuration
#     generation_config = {
#         "max_output_tokens": 2048,
#         "temperature": 0.2,
#         "top_p": 1,
#     }

#     # Define safety settings
#     safety_settings = {
#         generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
#         generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
#         generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
#         generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
#     }

#     responses = model.generate_content(
#         [text],
#         generation_config=generation_config,
#         safety_settings=safety_settings,
#         stream=False,
#     )

    
#     json_data= responses.text
#     clean_json_string = json_data.strip('```json \n')
#     data= json.loads(clean_json_string)

#     # return json_data


#     return (data["sentiment_score"], data["sentiment_category"])





