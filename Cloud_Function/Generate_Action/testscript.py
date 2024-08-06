import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
from google.oauth2 import service_account

# Path to your service account key
key_path = "/Users/joel/Downloads/jbaaam-060272bd3d02.json"  # Update this path

# Authenticate using the service account key
credentials = service_account.Credentials.from_service_account_file(key_path)
project_id = "jbaaam"

# Initialize Vertex AI
vertexai.init(project=project_id, location="us-central1", credentials=credentials)
model = GenerativeModel(model_name="gemini-1.5-flash-001")
generation_config = GenerationConfig(
    temperature=0.3,
    top_p=0.9,
    top_k=2,
    candidate_count=1,
    max_output_tokens=900,
)

prompt = "Test prompt"
response = model.generate_content(prompt, generation_config=generation_config)
print(response)
