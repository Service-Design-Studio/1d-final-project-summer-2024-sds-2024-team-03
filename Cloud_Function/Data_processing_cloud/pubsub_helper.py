# from google.cloud import pubsub_v1

# publisher = pubsub_v1.PublisherClient()
# topic_path = publisher.topic_path('903333611831', 'projects/jbaaam/topics/eventarc-asia-southeast1-data-processor-fn-616423-253')

# def publish_message(data: str):
#     """Publishes a message to a Pub/Sub topic."""
#     try:
#         # Data must be a bytestring
#         publisher.publish(topic_path, data.encode('utf-8'))
#         print(f"Published message to Pub/Sub: {data}")
#     except Exception as e:
#         print(f"Failed to publish message: {str(e)}")

import psycopg2
import psycopg2.extras
from datetime import datetime
from google.cloud import secretmanager
# from zoneinfo import ZoneInfo
import pytz

def access_secret_version(secret_id, project_id):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("UTF-8")

def publish_message(message,status):

    project_id = '903333611831'
    
    db_user_secret_id = 'DB_USER'
    db_password_secret_id = 'DB_PASS'
    storage_bucket_name = 'jbaaam_upload'
    
    # Retrieve secrets
    db_user = access_secret_version(db_user_secret_id, project_id)
    db_password = access_secret_version(db_password_secret_id, project_id)

    query= "INSERT INTO logs (log_message,status) VALUES %s"
    # singapore_time_zoneinfo = datetime.now(ZoneInfo("Asia/Singapore"))

    # singapore_tz = pytz.timezone('Asia/Singapore')

    # Get the current time in Singapore
    # singapore_time_pytz = datetime.now(singapore_tz)
    # print(f'pytz: {singapore_time_pytz}')

    data = [(message, status)]

    conn = None
    cursor = None 

    try:
        conn = psycopg2.connect(
            dbname='feedback_db',  
            user=db_user, 
            password=db_password,
            host='34.124.203.237',  
            port='5432'  
        )
        cursor = conn.cursor()
        psycopg2.extras.execute_values(cursor, query, data) 
        conn.commit()
        print("Log message successfully recorded.")
    except psycopg2.DatabaseError as e:
        print(f"Failed to log message to database: {e}")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Database connection closed for logging.")

    