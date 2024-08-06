# MICROSERVICE 2:

Main application, React, is deployed in GCloud Storage and has google storage domain.
React application wil call the microservice (which is developed in Rails) and it's deployed on Gcloud Run.

Another Microservice is developed in GCloud Function (linking to python models)

Definition of Microservice:

1. "perform a related set of operations": only one function, Rails is to call APIs, React for frontend, Python for backend model
2. "independently deployed and operated": Rails(deployed in GCloud Run, ) independently deployable, React(deployed in GCloud storage) independently deployable, Python(deployed in GCloud Function) independently deployable
3. "readily incorporated with other external services": Rails can connect to frontend through APIs

How to prove independently deployable: Have 3 different autodeploy on Git

## Configure the bucket for static website hosting

gsutil web set -m index.html -e 404.html gs://jbaaam_frontend/

## Make the bucket public

gsutil iam ch allUsers:objectViewer gs://jbaaam_frontend/

## Upload your website files, FROM ROOT!!

gsutil cp -r react/build/\* gs://jbaaam_frontend/

## Link to site:

[FrontEnd site loads a javascript react application](https://jbaaam_frontend.storage.googleapis.com/index.html)

[!! Google Cloud Endpoint is deployed rails site](https://jbaaam-yl5rojgcbq-et.a.run.app/)

# MICROSERVICE 3:

Another rails application (same repo), with CRUD API
