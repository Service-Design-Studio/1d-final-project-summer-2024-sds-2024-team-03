import psycopg2
from Data_processing_cloud.pubsub_helper import publish_message
import sys

def get_latest_log_status(db_user, db_password, db_host, db_name):
    """Retrieve the latest log status from the PostgreSQL database."""
    query = "SELECT status FROM logs ORDER BY created_at DESC LIMIT 1"
    conn = None
    cursor = None

    try:
        # Establish a connection to the PostgreSQL database
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user, 
            password=db_password,  
            host=db_host,  
            port='5432'  
        )
        cursor = conn.cursor()  # Create a cursor object

        cursor.execute(query)  # Execute the SQL query
        result = cursor.fetchone()  # Fetch the first row

        if result:
            print("Latest log status retrieved successfully.")
            return result[0]  # Return the 'status' from the fetched row
        else:
            print("No logs found.")
            return None

    except psycopg2.DatabaseError as e:
        print("Entering psycopg2.DatabaseError exception block")
        publish_message(f"Database error: {e}", 'ERROR')
        print(f"Database error: {e}")
        sys.exit(1) 

    except Exception as e:
        publish_message(f"An unexpected error occurred: {e}", 'ERROR')
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)

    finally:
        # Ensure that the cursor and connection are closed properly
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Database connection closed.")
