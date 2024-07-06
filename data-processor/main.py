import logging
import inference

def gcs_event(event, context):
    """Background Cloud Function to be triggered by Cloud Storage.
       This function is executed when a file is uploaded to the specified Cloud Storage bucket.
    Args:
        event (dict): The dictionary with data specific to this type of event. The `data` field contains the Cloud Storage object metadata.
        context (google.cloud.functions.Context): The Cloud Functions event metadata.
    """
    file = event
    logging.info(f"Processing file: {file['name']}.")

    # Add your custom logic here, for example:
    result = inference.process_content(file)  # Use the function from helper.py
    print(result)

    # For demonstration, we'll just print the file details
    print(f"Event ID: {context.event_id}")
    print(f"Event type: {context.event_type}")
    
