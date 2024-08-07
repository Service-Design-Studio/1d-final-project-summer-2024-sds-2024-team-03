<div align="center">

![SUTD Logo](https://silvaco.com/wp-content/uploads/2020/02/stud_logo_large1-300x159.jpg)

</div>

<div align="center">
  
# 60.004 - Service Design Studio 2024

</div>

<h3 align="center" style="text-decoration: none;">A joint collaboration between SUTD, DBS and Google</h3>

<div align="center">

⭐[WebApp](https://jbaaam_frontend.storage.googleapis.com/index.html). ⭐[Google Site](https://sites.google.com/view/jbaaam/home). [Hi-Fi Figma Prototype](https://www.figma.com/proto/kTLbEtR91dCn9nWa8NLiuC/Hifi-Prototype?node-id=0-1&t=BTGPwEbyxkxrfKef-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2). [Miro for all Design Iterations](https://miro.com/app/board/uXjVKFI343k=/).

</div>

VOCUS, is An AI-Powered Single Page Web-App for Customer Feedback Analysis, made by JBAAAM! 

Our ultimate goal is to increase efficiency and accuracy in feedback analysis by reducing manual work empowers and enhances the customer experience team in a way that seamlessly integrates into their pre-existing workflow. We aim to improve decision-making and provide a centralized platform that consolidates and analyzes feedback from diverse sources. 

⭐Comprehensive features

- 🤖 Three-Layer AI Automated Feedback Categorization: Using fine-tuned and distilled Gemini language models for the deepest level of categorization. 

- 🗣️ Automated Sentiment Analysis: To gauge customer emotions and sentiments accurately. 

- 📊 In-Depth and Tailored Visualization: Offering insights into categorization to reveal trends and customer reception at a glance. 

- 💡 AI-Driven Recommendations: Generating data-driven, actionable recommendations based on aggregated feedback from diverse sources. 

# Acknowledgments
- Adelaine Suhendro <a href="https://linkedin.com/in/adelaine-suhendro" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="adelaine-suhendro" height="11" width="15" /></a>
- Avitra Phon <a href="https://linkedin.com/in/avitraphon" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="avitraphon" height="11" width="15" /></a>
- Andrew Yu Ming Xin <a href="https://linkedin.com/in/andrewyumx" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="andrewyumx" height="11" width="15" /></a>
- Bryan Tan Wei An <a href="https://linkedin.com/in/bryantanwa" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="bryantanwa" height="11" width="15" /></a>
- Gay Kai Feng Matthew <a href="https://linkedin.com/in/matthew-gay-a16754296" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="matthew-gay-a16754296" height="11" width="15" /></a>
- Joel Lim <a href="https://linkedin.com/in/joel-lim-2a0096271" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="joel-lim-2a0096271" height="11" width="15" /></a>

# Problem Statement

How might we automate the interpretation and classification of all feedbacks and translate it into effective actionable insights that empower the CX team to enhance the customer experience?”

# Architecture

![media](https://github.com/user-attachments/assets/eb0e8f87-4f08-4c2a-9d58-c31048d7dc36)

Our architecture might seem typical for web applications, but we use a variety of technologies, all learned from scratch. 

### Programming Languages and Frameworks:
- Frontend: TypeScript with React.
- Backend API: Ruby with Rails.
- Microservices: Developed in Python and deployed as serverless solutions.
- CICD: Developed as GitHub action, and trigger on Pull Request merge.
  
### Overview:
- Frontend: Built with TypeScript and React.
- Backend API: Uses Ruby on Rails, employing RESTful APIs.
- Microservices: Two Python-based microservices, deployed as serverless functions.

This diverse setup has been quite a journey for us! 

## Front End
Our frontend layer is developed in TypeScript using React. WWe opted for TypeScript because its strong typing enhances robustness against typing errors, though it added some complexity to the development process. Our frontend is hosted on Google Cloud Storage, which is unconventional since it's typically used for file storage, but it works well for our web application. The frontend communicates with the backend via API calls.

## Backend API
We designed the backend API to be a pure API layer without business logic, using RESTful APIs as supported by Rails. We developed around 20 APIs, mainly focused on actionable and analytic data models. The upload API is the most complex, as it handles multipart data and integrates with Google Cloud Storage. This API is independently deployable and functions as a microservice, deployed serverlessly via Docker on Google Cloud Run. The build process, including Docker image creation, takes about 10 minutes.

We also have two other serverless microservices.

## 2 other microservices
Both additional microservices are simpler and also developed as serverless solutions. Instead of using Docker, we chose Google Cloud Functions to avoid unnecessary complexity. This decision simplifies deployment and reduces the wait time, as building a Docker image is not required. These microservices, written in Python

The first microservice is an event-driven service triggered by file uploads to a bucket. It performs data cleanup and validation, enriches the data by calling the Gemini API, and finally stores the clean and curated information in an Analytics table.

The second microservice is an HTTP service called by the backend API. It takes input parameters, reads a subset of analytic records based on those parameters, processes them with an ML model, integrates results from the Gemini API, and stores the final information in an Actionable table. 

## DB layer
Last but not least, our application uses a database to store the final curated data, while raw data is kept in Google Storage. This setup ensures that all API calls read data from the database. In our demo, you'll see sleek data statistical presentations. Despite the complex statistics, we maintain a simple and clean data model. Basic computations like sums and aggregations are handled in the API layer. For more detailed computations, we use the frontend, displaying results with our React-based graph library, Nivo built on top of D3.js.

## Getting Started

### 1. Install Ruby

Open up a command line prompt. On macOS open Terminal.app; on Windows choose "Run" from your Start menu and type cmd.exe. Any commands prefaced with a dollar sign $ should be run in the command line. Verify that you have a current version of Ruby installed:

```ruby
$ ruby --version
```

Rails requires Ruby version 3.1.0 or later. It is preferred to use the latest Ruby version. If the version number returned is less than that number (such as 2.3.7, or 1.8.7), you'll need to install a fresh copy of Ruby.

To install Rails on Windows, you'll first need to install [Ruby Installer](https://rubyinstaller.org/). 

For more installation methods for most Operating Systems take a look at [ruby-lang.org.](https://www.ruby-lang.org/en/documentation/installation/)

### 2. Install SQLite 3

You will also need an installation of the SQLite3 database. Many popular UNIX-like OSes ship with an acceptable version of SQLite3. Others can find installation instructions at the  [SQLite3 website](https://www.sqlite.org/index.html)

Verify that it is correctly installed and in your load PATH:
```ruby
$ sqlite3 --version
```

### 3. Install Rails

To install Rails, use the gem install command provided by RubyGems:

```ruby
$ gem install rails
```

Rails will not run as expected if you are unable to install any of above required dependencies. Once you have finished installing all required above, to verify that you succesfully acquired tools and softwares without any error or system conflict, use the following command

```ruby
$ rails --version
```

If command line prompt returns result of "Rails 7.x.x" for the above command, congratulations, you have set up all required dependencies successfully and are ready to embark on Ruby on Rails journey. 

Otherwise, if command line prompts fail to return output as expected, then the best workaround is properly starting from the first step again. And this time, make sure you follow every steps diligently. 

## [Run Development](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/blob/main/docs/INIT.md)

## [Yes to Tests](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/blob/main/docs/TESTING.md)

### Troubleshooting

- Using Active Record

```
rails console
```

- Common ActiveRecord commands

```ruby
### BASIC OPERATIONS

# Create a new record in User model
user = User.create(name: "David", occupation: "Code Artist")

# return a collection with all users
users = User.all

# return the first user
user = User.first

# return the first user named David
david = User.find_by(name: 'David')

# update an entity in table
# approach 1:
user = User.find_by(name: 'David')
user.name = 'Dave'
user.save

# approach 2:
user = User.find_by(name: 'David')
user.update(name: 'Dave')

### ACITVE RECORD COMMON METHODS
# where method
users = User.where(name: 'John', age: 25)
users = User.where('age > ? AND name LIKE ?', 18, '%John%')

# Order method
Users=User.where(name: ‘DAVID’, occupation: ‘Code’).order(created_at: :desc)

# Find_by method
User=User.find_by(name: 'John', age: 25)

# Like method
Customer.where("email IS NOT NULL and email NOT LIKE '%@%’ ")

# Update all method
User. where(age: 25).update_all(name: 'John', gender: 'Male')

# Limit method
User.order(created_at: :desc).limit(20)

# Working Date and Time
User.where(“created_at > ?”,Date.new(2023,1,1))
User.where(“EXTRACT(MONTH FROM created_at)=?”,7)
```

## Time to Deploy!

### Deployment is a 3-step process

1. [Link React to Rails](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/blob/main/docs/deployment/REACT_TO_RAILS.md)
2. [Cloud Run for Frontend](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/blob/main/docs/deployment/CLOUDRUN.md)
3. [Cloud Storage for Backend](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/blob/main/docs/deployment/CLOUDSTORAGE.md)
3. [Data Processor Microservice](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/blob/main/docs/ml/DATA_PROCESSOR.md)
