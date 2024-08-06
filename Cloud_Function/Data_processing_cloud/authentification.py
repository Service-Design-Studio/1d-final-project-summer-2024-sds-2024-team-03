from google.cloud import secretmanager
from google.cloud import storage
from psycopg2 import sql, extras
import psycopg2
from Data_processing_cloud.pubsub_helper import publish_message

import os
import vertexai
import sys

# Function to retrieve secret from Secret Manager
def access_secret_version(secret_id, project_id):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("UTF-8")

# Function to download a file from Google Cloud Storage bucket
def download_file_from_bucket(bucket_name, file_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    local_dir = "/tmp/uploads"
    os.makedirs(local_dir, exist_ok=True)

    clean_file_name = os.path.basename(file_name)
    temp_local_file = os.path.join(local_dir, clean_file_name)
    
    print(f"Downloading file to: {temp_local_file}")

    blob.download_to_filename(temp_local_file)
    return temp_local_file

# Function to connect to PostgreSQL and execute queries
def execute_postgres_query(db_user, db_password, db_name, db_host, query, data=None):

    conn = None
    cursor = None
    
    try:
        
        conn = psycopg2.connect(
            # dbname=db_name,
            # user=db_user,
            # password=db_password,
            # host=db_host
            dbname=db_name,
            user=db_user, 
            password=db_password,  
            host='34.124.203.237',  
            port='5432'  
        )
        # Create a new cursor
        cursor = conn.cursor()

        # Execute the query with or without data
        if data:
            extras.execute_values(cursor, query, data)
        else:
            cursor.execute(query)

        # Commit the changes to the database
        conn.commit()
        print("Query executed and changes committed successfully.")
    
    except psycopg2.DatabaseError as e:
        # Handle database related errors
        print(f"Database error: {e}")
        if conn:
            conn.rollback()  # Rollback the transaction on error
            publish_message("Database transaction rolled back due to an error.",'ERROR')
            print("Database transaction rolled back due to an error.")
            sys.exit(1)
    
    except Exception as e:
        # Handle other general errors
        publish_message(f"An unexpected error occurred: {e}","ERROR")
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)
    
    finally:
        # Close the cursor and the connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Database connection closed.")


# def execute_postgres_query(db_user, db_password, db_name, db_host, query):
#     conn = psycopg2.connect(
#         dbname=db_name,
#         user=db_user,
#         password=db_password,
#         host=db_host
#     )
#     cursor = conn.cursor()
#     cursor.execute(query)
#     conn.commit()
#     cursor.close()
#     conn.close()

# def init_vertex_ai():
#     # Initialize Vertex AI
#     os.environ["GOOGLE_CLOUD_PROJECT"] = "903333611831"
#     vertexai.init(project="903333611831", location="asia-southeast1") ##for Subcategory Classification Model
#     vertexai.init(project="jbaaam", location="us-central1") ##for sentiment analysis model

