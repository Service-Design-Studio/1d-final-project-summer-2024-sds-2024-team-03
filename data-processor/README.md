# MicroService: Data Processor

## Step 1: Enable Necessary APIs

Enable the Cloud Functions and Cloud Storage APIs for your project:

1. Go to the [Cloud Functions API page](https://console.cloud.google.com/apis/library/cloudfunctions.googleapis.com).
2. Go to the [Cloud Storage API page](https://console.cloud.google.com/apis/library/storage.googleapis.com).
3. Go to the [Eventarc API](https://console.cloud.google.com/apis/library/eventarc.googleapis.com?authuser=5&project=jbaaam)

## Step 2: Write Your Cloud Function

Create a directory for your function and write your Python code.

1. Create a directory for your function:

```bash
mkdir data-processor
cd data-processor
```

2. Create a main.py file with your function code:

```py
import logging

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
    # - Read the file
    # - Process the content
    # - Store the results somewhere

    # For demonstration, we'll just print the file details
    print(f"Event ID: {context.event_id}")
    print(f"Event type: {context.event_type}")
    print(f"Bucket: {file['bucket']}")
    print(f"File: {file['name']}")
    print(f"Metageneration: {file['metageneration']}")
    print(f"Created: {file['timeCreated']}")
    print(f"Updated: {file['updated']}")
```

3. Create a requirements.txt file if you have any dependencies. For this simple example, it can be empty:

```bash
touch requirements.txt
```

## Step 3: Deploy the Cloud Function

Deploy your function with a trigger for Cloud Storage events:

```bash
gcloud functions deploy data_processor_fn \
  --gen2 \
  --runtime=python39 \
  --trigger-event=google.storage.object.finalize \
  --trigger-resource=jbaaam_upload \
  --entry-point=gcs_event \
  --region=asia-southeast1

OR

gcloud functions deploy data_processor_fn --trigger-event google.storage.object.finalize --trigger-resource jbaaam_upload --runtime python39 --region asia-southeast1

```

The --trigger-event flag specifies the type of event that will trigger the function, and --trigger-resource specifies the bucket to monitor.

## Step 4: Verify the Deployment

Once deployed, you can verify your function:
gcloud functions describe gcs_event_function --gen2 --region=us-central1

## Step 5: Testing Your Function

Upload a file to your specified Cloud Storage bucket to trigger the function. You can do this through the Google Cloud Console or using the gsutil command-line tool:
gsutil cp path/to/your/file gs://YOUR_BUCKET_NAME/

Your Cloud Function should automatically be triggered by the file upload, and you should see the logging output in the Cloud Functions logs.

## Step 5: Viewing Logs

To view the logs for your function, use the following command:
gcloud functions logs read gcs_event_function --gen2 --region=us-central1

## fix from stack

[stackoverflow](https://stackoverflow.com/questions/74285987/how-do-i-deploy-a-google-cloud-function-2nd-generation)

```bash
PROJECT_ID=$(gcloud config get-value project)

PROJECT_NUMBER=$(gcloud projects list --filter="project_id:$PROJECT_ID" --format='value(project_number)')

SERVICE_ACCOUNT=$(gsutil kms serviceaccount -p $PROJECT_NUMBER)

gcloud projects add-iam-policy-binding jbaaam \
 --member serviceAccount:$SERVICE_ACCOUNT \
 --role roles/pubsub.publisher
```
