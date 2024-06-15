## Deploy Rails app on GC
1. Authenticate GC account
```bash
gcloud auth login
```

2. Set up GC Proj
```bash
gcloud config set project PROJECT_ID
```

3. Have dockerfile

4. Build docker image
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/myapp
```

5. Deploy image to GC run
```bash
gcloud run deploy --image gcr.io/PROJECT_ID/myapp --platform managed
```
[10] asia-southeast2