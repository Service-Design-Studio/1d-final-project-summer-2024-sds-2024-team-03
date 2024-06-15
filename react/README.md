# JBAAAM-frontend
# **IMPT** Only for React, JBAAAM-main will be the combined.
Frontend: React and Typescript

## Deploying to Google Cloud for REACT
## **IMPT** NOT NEEDED, Deploy through rails
Install the Google Cloud SDK on your machine. You can do this by running the following command in your terminal:
```/bin/bash -c "$(curl -fsSL https://sdk.cloud.google.com)"```

Authenticate your Google Cloud account by running:
```gcloud auth login```

Set your Google Cloud project. Replace YOUR_PROJECT_ID with your actual project ID:
```gcloud config set project YOUR_PROJECT_ID```

Navigate to your React app directory:
```cd JBAAAM-frontend```

Create an app.yaml file in the root of your React app directory with the following content:
```yml
runtime: nodejs22

automatic_scaling:
  target_cpu_utilization: 0.65

env_variables:
  NODE_ENV: "production"

instance_class: F2

entrypoint: npm start
```

Deploy your app to Google Cloud by running:
```gcloud app deploy```
- 8 asia south-east 2

View your deployed React app by running:
```gcloud app browse```