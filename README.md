# JBAAAM
Frontend: React and Typescript
## Meet the members
- Adelaine Suhendro, 1007059, CSD
- Avitra Phon, 1006946, CSD
- Bryan Tan Wei An, 1006891, DAI
- Andrew Yu Ming Xin, 1006879, DAI
- Joel Lim, 1006866, DAI
- Gay Kai Feng Matthew, 1006878, DAI

## More Info
View our
- [FrontEnd](https://jbaaam-frontend.et.r.appspot.com/)
- [Project Handout](https://github.com/ilenhanako/SDS-2024-Team-03/files/15323228/Final.Project.Handout.Summer.2024.1.docx)
- [Website](https://sites.google.com/view/jbaaam/home)
- [HI-FI Figma Prototype](https://www.figma.com/proto/kTLbEtR91dCn9nWa8NLiuC/Hifi-Prototype?node-id=0-1&t=BTGPwEbyxkxrfKef-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2)
- [![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/QpCtzJAE)
- [![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15059043&assignment_repo_type=AssignmentRepo)


## Deploying to Google Cloud
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