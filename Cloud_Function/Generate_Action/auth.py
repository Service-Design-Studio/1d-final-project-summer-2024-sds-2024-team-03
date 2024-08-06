import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
from google.oauth2 import service_account
from google.cloud import secretmanager
from psycopg2 import sql, extras
import psycopg2
import os
import pandas as pd
import psycopg2.extras

# # Path to your service account key
# key_path = "/Users/joel/Downloads/jbaaam-060272bd3d02.json"  # Update this path

# # Authenticate using the service account key
# credentials = service_account.Credentials.from_service_account_file(key_path)
# project_id = "jbaaam"



# prompt = "Test prompt"
# response = model.generate_content(prompt, generation_config=generation_config)
# print(response)

def init_vertex_ai():
    # Initialize Vertex AI
    os.environ["GOOGLE_CLOUD_PROJECT"] = "903333611831"
    vertexai.init(project="jbaaam", location="us-central1") ##for sentiment analysis model

def access_secret_version(secret_id, project_id):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("UTF-8")


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
        # publish_message(f"Database error: {e}")
        print(f"Database error: {e}")
        if conn:
            conn.rollback()  # Rollback the transaction on error
            print("Database transaction rolled back due to an error.")
    
    except Exception as e:
        # Handle other general errors
        # publish_message(f"An unexpected error occurred: {e}")
        print(f"An unexpected error occurred: {e}")
    
    finally:
        # Close the cursor and the connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Database connection closed.")

def fetch_data(db_user, db_password, db_name, db_host,source, from_date, to_date, product):

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
        
        cursor = conn.cursor()

        if not source or not product:
            print("Source or Product list is empty.")
            return pd.DataFrame()  # Return an empty DataFrame if source or product is empty
        
        query = """
            SELECT * FROM analytics
            WHERE source = ANY(%s)
            AND product = ANY(%s)
            AND TO_DATE(date, 'DD/MM/YYYY') BETWEEN TO_DATE(%s, 'DD/MM/YYYY') AND TO_DATE(%s, 'DD/MM/YYYY');
        """
        
        cursor.execute(query, (source, product, from_date, to_date))
        
        rows = cursor.fetchall()
        df = pd.DataFrame(rows, columns=['Date', 'Feedback', 'Product', 'Subcategory', 'Feedback Category', 'Sentiment', 'Sentiment Score', 'Source']) 
        
        return df

    except Exception as e:
        print(f"Failed to fetch: {e}")

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Database connection closed.")


        

