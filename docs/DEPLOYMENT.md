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

gcloud builds submit --tag gcr.io/jbaaam/jbaaam
```

ID: jbaaam

5. Deploy image to GC run

```bash
gcloud run deploy --image gcr.io/PROJECT_ID/myapp --platform managed

gcloud run deploy --image gcr.io/jbaaam/jbaaam --platform managed
```

[10] asia-southeast2

6. RMB TO DO: on your rc file (~/.zshrc)
   Add Google Application Credential

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./jbaaam-upload-key.json"
```

Common errors
1. "Not ready and cannot serve traffic. The user-provided container failed to start and listen on the port"
   - Related to Postgresql db deployment, happens after every new table created/destroyed in Postgresql, go to gcloud sql and connect to "internal gcloud"
