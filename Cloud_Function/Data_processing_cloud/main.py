#!/usr/bin/env python
# coding: utf-8

# In[6]:


import os
from Data_processing_cloud.pubsub_helper import publish_message
# from zoneinfo import ZoneInfo
def parse_filename(file_path):

    filename = os.path.basename(file_path)
    # Split the filename using the double underscore separator
    parts = filename.split('__')
    
    # Check if the filename is in the correct format
    if len(parts) < 3:
        publish_message("Error: Filename format is incorrect. Expected format: 'product__source__fname'","ERROR")
        raise ValueError("Filename format is incorrect. Expected format: 'product__source__fname'")
    
    # Extract the product and source values
    product = parts[0]
    source = parts[1]
    
    return product, source


# In[11]:


# Cloud Function entry point
import os
import pandas as pd
from Data_processing_cloud.authentification import access_secret_version, download_file_from_bucket, execute_postgres_query
from  Data_processing_cloud.Functions.survey_problem_solution import process_survey_data
from Data_processing_cloud.Functions.five_Star_Review import process_five_star_reviews
from Data_processing_cloud.Functions.social_media import process_social_media_data
from Data_processing_cloud.Functions.voice_call import process_voice_call_data
import logging
from Data_processing_cloud.clear_logs import clear_logs
from Data_processing_cloud.check_logs import get_latest_log_status 
import vertexai

##event and context is passed by google bucket
def process_data(event,context):
    print("Script started")
    # cloud_logger.info(f"Context: {context}")
    os.environ["GOOGLE_CLOUD_PROJECT"] = "903333611831"
    vertexai.init(project="903333611831", location="asia-southeast1") ##for Subcategory Classification Model
    vertexai.init(project="jbaaam", location="us-central1") ##for sentiment analysis model

    project_id = '903333611831'
    
    db_user_secret_id = 'DB_USER'
    db_password_secret_id = 'DB_PASS'
    storage_bucket_name = 'jbaaam_upload'
    
    # Retrieve secrets
    db_user = access_secret_version(db_user_secret_id, project_id)
    db_password = access_secret_version(db_password_secret_id, project_id)
    print("Secrets retrieved successfully")
    print (f'DB_USER: {db_user}, DB_PASSWORD:{db_password}')

    last_status = get_latest_log_status(db_user, db_password, '/cloudsql/jbaaam:asia-southeast1:feedback', 'feedback_db')
    if last_status not in ['SUCCESS', 'ERROR', None]:
        print(f"Cannot proceed, the last process status was: {last_status}. Please wait until its status is SUCCESS")
        publish_message(f"Cannot proceed, the last process status was: {last_status}. Please wait until its status is SUCCESS", 'ERROR')

        return  # Exit the function if the last status is not 'succeeded'



    clear_logs(db_user, db_password, '/cloudsql/jbaaam:asia-southeast1:feedback', 'feedback_db')

    try: 

        ##Get info from trigger in bucket
        file = event
        file_name= file["name"]
        bucket_name=file['bucket']

        # content_type = event['data']['contentType']
        # time_created = event['data']['timeCreated']
        print(f"File: {file_name}, Bucket: {bucket_name}")

        
        # Download the file from Google Cloud Storage
        local_file_path = download_file_from_bucket(bucket_name, file_name)

        # local_file_path='/Users/phonavitra/Desktop/term 5/Service Studio/Test/Others__Social Media__smalltest.csv'
        product, source=parse_filename(file_name)

        # df = pd.read_csv(local_file_path)

        if source == "Product Survey" or source == "Problem Solution Survey"or source == "CSS" or source == "Problem Solution":
            data= process_survey_data(product, source, local_file_path)
        elif source == "Call Center" or source == "Call Centre" or source == 'Service Request':
            data=process_voice_call_data(local_file_path, product,source)
        elif source == "Social Media":
            data= process_social_media_data(local_file_path,product,source)
        elif source == "5 Star Review" or source == "5 Star Logout":
            data= process_five_star_reviews(local_file_path,product,source)
        else:
            # Raise a ValueError for unsupported source values
            publish_message("Error: Source not supported: {}".format(source),'ERROR')
            raise ValueError("Source not supported: {}".format(source))

        publish_message(f"Filename: {file_name}. Data classification started",'IN PROGRESS')

        data= data[data['Subcategory'].apply(lambda x: len(x.split()) <= 5 if isinstance(x, str) else False)]
        data= data[data['Feedback Category'].apply(lambda x: len(x.split()) <= 5 if isinstance(x, str) else False)]
        data = data[data['Sentiment'].apply(lambda x: len(x.split()) == 1 if isinstance(x, str) else False)]



        def valid_score(score):
            try:
                score = float(score)
                return 0.0 <= score <= 5.0
            except ValueError:
                return False
        
        data=data[data['Sentiment Score'].apply(valid_score)]

        data = data.dropna(subset=['Feedback Category', 'Sentiment', 'Sentiment Score','Subcategory'])


        # Insert processed data into PostgreSQL
        # Prepare the data for insertion
        if isinstance(data, pd.DataFrame) and not data.empty:
            data_to_insert = [
                (
                    row['Date'], 
                    row['Feedback'], 
                    row['Product'], 
                    row['Subcategory'], 
                    row['Feedback Category'], 
                    row['Sentiment'], 
                    row['Sentiment Score'], 
                    row['Source']
                )
                for index, row in data.iterrows()
            ]
        else:
            publish_message("Error:No data to process or data is not in expected format.",'ERROR')
            print("No data to process or data is not in expected format.")
            return

        query = """INSERT INTO analytics_result (date, feedback, product, subcategory, feedback_category, sentiment, sentiment_score, source) VALUES %s"""
        execute_postgres_query(db_user, db_password, 'feedback_db', '/cloudsql/jbaaam:asia-southeast1:feedback', query,data_to_insert)

        
        # Delete the temporary file
        os.remove(local_file_path)
        publish_message("Data classification completed and added to database.",'SUCCESS')

        # return "Data processing and storage complete"
        # output_file_path = f'/Users/phonavitra/Desktop/term 5/Service Studio/Test/Model Results (All sources)/Social Media_Results.csv'
        # try:
        #     data.to_csv(output_file_path, index=False)
        #     print(f"Data transformation complete. File saved to: {output_file_path}")
        # except Exception as e:
        #     print(f"Error saving transformed data: {e}")
        #     raise

        print("Script ended")

    except Exception as e: 
        print(f"An error occurred: {e}")
        publish_message("Error - Operation could not be completed", 'ERROR')
        return


# process_data(None,None)


# In[ ]:




