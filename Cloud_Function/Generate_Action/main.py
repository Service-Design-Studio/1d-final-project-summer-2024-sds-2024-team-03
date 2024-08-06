import google.cloud.aiplatform as vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
import pandas as pd
from collections import defaultdict
import json
import re
import functions_framework
from auth import access_secret_version, execute_postgres_query, init_vertex_ai, fetch_data
from datetime import datetime
from google.cloud import firestore, storage
import uuid
from clear_actionables import clear_actionables
import time

db = firestore.Client()

# def save_df_to_bucket(df, bucket_name, file_name):
#     storage_client = storage.Client()
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(file_name)
#     blob.upload_from_string(df.to_csv(index=False), 'text/csv')
#     print(f'DataFrame saved to bucket {bucket_name} as {file_name}')

# Initialize Vertex AI
project_id = "jbaaam"
init_vertex_ai()
model = GenerativeModel(model_name="gemini-1.5-flash-001")
generation_config = GenerationConfig(
    temperature=0.3,
    top_p=0.9,
    top_k=2,
    candidate_count=1,
    max_output_tokens=900,
)

def generate_actionable_items(df, request_id):
    product_feedback = defaultdict(list)
    # feedback_categories = defaultdict(list)
    feedback_categories = defaultdict(set)

    for _, row in df.iterrows():
        product_feedback[row['Subcategory']].append(row['Feedback'])
        feedback_categories[row['Subcategory']].add(row['Feedback Category'].lower())

    summarized_actions = []

    for product in product_feedback:
        request_status = db.collection('requests').document(request_id).get().to_dict().get('status')
        if request_status == 'canceled':
            print(f"Request {request_id} was canceled. Stopping processing.")
            return None

        feedbacks = product_feedback[product]
        categories = list(feedback_categories[product])

        combined_feedback = " | ".join([fb for fb in feedbacks if fb is not None])
        combined_feedback_category = " | ".join(categories)

        prompt = f"""
        Product: {product}
        Combined Feedback: {combined_feedback}

        Based on the combined feedback for the product "{product}", please generate one general actionable item that addresses the main themes or issues across all the feedback for this product.

        Format the response as follows:
        Category: [To Fix/To Promote/Keep in mind/To Amplify]
        Action: [Summarized general action]

        Ensure that the category is classified according to this:
        1. To Fix: regarding issues that require maintenance or repair, where services are not working
        2. To Promote: regarding feedback that talks about certain promotions that could be done or undermarketed stuff.
        3. Keep in mind: regarding feedback that compliments the service, and any form of suggestions
        4. To Amplify: regarding feedback that is neutral, but could have room for improvements.

        Ensure that the action is:
        1. Always provided
        2. As general as possible while still being relevant to the specific product. It should be very general.
        3. Addresses the most common or significant issues/themes in the feedback
        4. Focused on improving the overall product or customer experience

        Examples of generalized actions for various products:
        1. Savings Account: "Enhance interest rates and account features to improve customer satisfaction"
        2. Mobile Banking App: "Prioritise app stability and user interface improvements based on customer feedback"
        3. Credit Cards: "Revamp reward program and address common billing concerns"
        4. Customer Service: "Implement comprehensive training program to address recurring customer issues"
        5. Loans: "Streamline application process and improve communication throughout the loan lifecycle"

        Ensure response is:
        1. Always includes all specified fields
        2. Is formatted clearly and consistently according to the provided format, DO NOT GIVE ANY HEADERS
        Remember to tailor the action to the specific product and the themes present in the combined feedback.
        REMEMBER TO COMPLETE ALL GENERATED RESPONSES FOR ALL PRODUCTS 
        """

        response = model.generate_content(prompt, generation_config=generation_config)
        response_text = response.text.strip()
        response_text_cleaned = re.sub(r'^##.*?\n', '', response_text, flags=re.DOTALL).strip()

        actionable_category = 'Not specified'
        action = 'Not specified'

        lines = response_text_cleaned.split('\n')
        current_item = {
            'subproduct': product,
            'actionable_category': actionable_category,
            'action': action,
            # 'feedback_count': len(feedbacks),
            'feedback_json': feedbacks,  # Store as list
            'status': 'New',
            'feedback_category': categories,  # Store as list
        }
        for line in lines:
            line = line.strip()
            if line.startswith('Category:'):
                current_item['actionable_category'] = line.split(':')[1].strip()
            elif line.startswith('Action:'):
                current_item['action'] = line.split(':')[1].strip()

        if 'actionable_category' in current_item and 'action' in current_item:
            summarized_actions.append(current_item)
        else:
            print(f"Warning: Incomplete response for product '{product}'. Response text: {response_text}")

    return json.dumps(summarized_actions, indent=4)


@functions_framework.http
def generate_actions(request):

    source = request.args.getlist('source')
    to_date = request.args.get('to_date')
    from_date = request.args.get('from_date')
    product = request.args.getlist('product')
    request_id = request.headers.get('X-Request-Id', str(uuid.uuid4()))
    print(f'request from http. Source:{source}, To Date: {to_date}, From Date: {from_date}, product: {product}, request_id: {request_id}')

    project_id = '903333611831'

    db_user_secret_id = 'DB_USER'
    db_password_secret_id = 'DB_PASS'

    # Retrieve secrets
    db_user = access_secret_version(db_user_secret_id, project_id)
    db_password = access_secret_version(db_password_secret_id, project_id)
    db_host = '/cloudsql/jbaaam:asia-southeast1:feedback'
    db_name = 'feedback_db'

    clear_actionables(db_user, db_password, db_host, db_name)

    requests_ref = db.collection('requests')
    running_requests = list(requests_ref.where('status', '==', 'running').stream())

    if not running_requests:
        print("No running requests found.")
    else:
        print(f"Found {len(running_requests)} running requests.")

    for req in running_requests:
        print(f"Cancelling request {req.id}")
        req.reference.update({'status': 'canceled'})

    # Wait until all running requests are marked as canceled
    while any(req.reference.get().to_dict().get('status') == 'running' for req in running_requests):
        print("Waiting for running requests to be canceled...")
        for req in running_requests:
            print(f"Request {req.id} status: {req.reference.get().to_dict().get('status')}")
        time.sleep(1)

    # Mark the current request as running
    requests_ref.document(request_id).set({
        'status': 'running',
        'timestamp': datetime.utcnow()
    })

    df = fetch_data(db_user, db_password, db_name, db_host, source, from_date, to_date, product)

    if df.empty:
        print("No data fetched. Exiting without generating actionables.")
        requests_ref.document(request_id).update({'status': 'completed'})
        return json.dumps({"message": "No data available to process actionables"}), 200
    else:
        print(df.head())
        # bucket_name = 'jbaaam_cloudbuild'
        # file_name = f'actionables_{request_id}.csv'
        # save_df_to_bucket(df, bucket_name, file_name)
        # print('saved data to bucket')

    action_items_json = generate_actionable_items(df, request_id)
    if action_items_json is None:
        # If action_items is empty, it means processing was stopped
        requests_ref.document(request_id).update({'status': 'canceled'})
        return json.dumps({"message": "Request was canceled and processing stopped"}), 200
    print("Actionable Model completed")
    action_items = json.loads(action_items_json)

    # Insert the actionable items into the database
    data_to_insert = [
        (
            item['action'],
            item['status'],
            item['subproduct'],
            item['actionable_category'],
            json.dumps(item['feedback_category']),
            json.dumps(item['feedback_json']),  # item['feedback_data'] if the schema is list
            datetime.now(),
            datetime.now()
        ) for item in action_items
    ]

    insert_query = """
    INSERT INTO actionables (action, status, subproduct, actionable_category, feedback_category, feedback_json, created_at, updated_at)
    VALUES %s;
    """
    execute_postgres_query(db_user, db_password, db_name, db_host, insert_query, data_to_insert)

    requests_ref.document(request_id).update({'status': 'completed'})

    return json.dumps({"message": "Actionable items processed and stored successfully"}, indent=4), 200
