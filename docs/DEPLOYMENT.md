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

7. USELESS:

```bash
https://cloud.google.com/sql/docs/postgres/connect-run

gcloud run services update jbaaam \
 --add-cloudsql-instances=jbaaam:asia-southeast1:feedback \
--update-env-vars=INSTANCE_CONNECTION_NAME=jbaaam:asia-southeast1:feedback \
 --update-secrets=DB_USER=postgres:latest \
 --update-secrets=DB_PASS=JBAAAMinstance:latest \
 --update-secrets=DB_NAME=feedback_db:latest


 gcloud run services update SERVICE_NAME \
 --add-cloudsql-instances=INSTANCE_CONNECTION_NAME
--update-env-vars=INSTANCE_CONNECTION_NAME=INSTANCE_CONNECTION_NAME_SECRET \
 --update-secrets=DB_USER=DB_USER_SECRET:latest \
 --update-secrets=DB_PASS=DB_PASS_SECRET:latest \
 --update-secrets=DB_NAME=DB_NAME_SECRET:latest
```

gcloud run services update jbaaam \
 --add-cloudsql-instances=jbaaam:asia-southeast1:feedback \
 --update-env-vars=INSTANCE_CONNECTION_NAME=jbaaam:asia-southeast1:feedback,DB_USER=postgres,DB_PASSWORD=JBAAAMinstance

gcloud auth application-default login
