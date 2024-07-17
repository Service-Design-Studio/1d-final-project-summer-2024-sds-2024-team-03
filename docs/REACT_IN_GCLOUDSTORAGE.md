# Configure the bucket for static website hosting

gsutil web set -m index.html -e 404.html gs://jbaaam_frontend/

# Make the bucket public

gsutil iam ch allUsers:objectViewer gs://jbaaam_frontend/

# Upload your website files

gsutil cp -r frontend/\* gs://jbaaam_frontend/

# Link to site:

http://jbaaam_frontend.storage.googleapis.com/index.html
