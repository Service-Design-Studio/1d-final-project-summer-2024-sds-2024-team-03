
def clear_actionables(db_user, db_password, db_host, db_name):
    """
    Clears the actionable items in the database.
    You can add the actual logic to clear the actionable model here.
    """
    import psycopg2
    try:
        # Establish the connection
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host=db_host
        )
        cur = conn.cursor()
        
        # Execute the query to clear the actionable items
        cur.execute("DELETE FROM actionables WHERE status = %s", ('New',))
        
        # Commit the changes
        conn.commit()
        
        # Close the cursor and connection
        cur.close()
        conn.close()
        
        print("Actionable items cleared.")
    except Exception as e:
        print(f"Error clearing actionable items: {e}")