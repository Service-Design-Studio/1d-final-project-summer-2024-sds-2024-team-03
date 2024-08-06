from Data_processing_cloud.authentification import access_secret_version, download_file_from_bucket, execute_postgres_query
from Data_processing_cloud.pubsub_helper import publish_message
import sys

def clear_logs(db_user, db_password, db_host, db_name):
    # SQL query to delete all records from logs table
    query = "DELETE FROM logs"
    
    # Execute the query
    try:
        execute_postgres_query(db_user, db_password, db_name, db_host, query)
        print("Logs cleared successfully.")
    except Exception as e:
        publish_message(f"Failed to clear logs: {e}",'ERROR')
        print(f"Failed to clear logs: {e}")
        print("Database transaction rolled back due to an error.")
        sys.exit(1)