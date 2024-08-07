## Frontend Unit Testing with JestJS

1. **Navigate to 'react' directory and Install Necessary Libraries:**

   ```bash
   npm i jest-environment-jsdom @babel/core @babel/preset-env @babel/preset-typescript @types/jest @types/testing-library__jest-dom babel-jest jest-fetch-mock ts-jest
   ```

2. **Initialize files**

src\setupTests.ts

```bash
import "@testing-library/jest-dom"
```

.babelrc

```bash
{
 "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

babel.config.js

```bash
module.exports = {
 presets: [
     ["@babel/preset-env", {targets: {node: "current"}}],
     "@babel/preset-typescript",
 ],
};
```

jest.config.js

```bash
module.exports = {
 transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
 testEnvironment: "jsdom",
 setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
```

tsconfig.json

```bash
{
"compilerOptions": {
 "target": "es5",
 "lib": [
   "dom",
   "dom.iterable",
   "esnext"
 ],
 "allowJs": true,
 "skipLibCheck": true,
 "esModuleInterop": true,
 "allowSyntheticDefaultImports": true,
 "strict": true,
 "forceConsistentCasingInFileNames": true,
 "noFallthroughCasesInSwitch": true,
 "module": "esnext",
 "moduleResolution": "node",
 "resolveJsonModule": true,
 "isolatedModules": true,
 "noEmit": true,
 "jsx": "react-jsx"
},
"types": ["node", "jest", "@testing-library/jest-dom", "testing-library__jest-dom"],
"include": [
 "src"
, "Dashboard.tsx"  ]
}
```

3. **Write tests**

   Eg. for Dashboard.tsx, write tests in Dashboard.test.tsx

4. **Run Tests**

Runs all tests with extension of [.test.tsx]

```bash
npm test
```

5. **Disable Tests**
   To disable, simply rename the file to not match [.test.tsx] Eg. Dashboard.test.disabled.tsx

## Integration Testing with Cucumber

+ All features/user stories along with happy and sad path scenarios are under [./features](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/tree/main/features)
+ All other steps definitions are under [./features/step_definitions](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/tree/main/features/step_definitions)

1. To prepare database for testing

```
bundle exec rake db:migrate RAILS_ENV=test
rails db:migrate RAILS_ENV=test
```

2. Run all acceptance tests

```
bundle exec cucumber
```

## Backend Unit Testing with Rspec

+ Testing are defined under [./spec](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/tree/main/spec)
+ Model Unit Testing [./spec/models](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/tree/main/spec/models)
+ Controllers Unit Testing [./spec/requests](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/tree/main/spec/requests)

1. Run unit testing using Rspec

```bash
bundle exec rspec
```

2. Automatically generates code coverage report in [coverage/index.html](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/blob/main/coverage/index.html)
   
+ Using Minitest
Testing are defined under [./test](https://github.com/Service-Design-Studio/1d-final-project-summer-2024-sds-2024-team-03/tree/main/test)

Run unit testing using Minitest
```
rails test
```

## Microservice CURL Tests 

### Actionable Page

```bash
# INFERENCE ACTIONABLE
curl -X GET http://localhost:3000/actionables/inference

# CREATE RESTful
curl -X POST http://localhost:3000/actionables.json \
     -H "Content-Type: application/json" \
     -d '{
           "actionable": {
             "action": "New Actionable 3",
             "status": "New",
             "subproduct": "currency card",
             "actionable_category": "To Promote",
             "feedback_category": "application",
             "feedback_json": "sucks"
           }
         }'

# READ RESTful
curl -X GET http://localhost:3000/actionables.json \
     -H "Content-Type: application/json"

# UPDATE RESTful
curl -X PATCH "http://localhost:3000/actionables/592.json" \
     -H "Content-Type: application/json" \
     -d '{
           "actionable": {
             "status": "done"
           }
         }'

# DELETE RESTful
curl -X DELETE "http://localhost:3000/actionables/592.json" \
     -H "Content-Type: application/json"
```

### Analytics page

Based on the routes.rb:

```rb
resources :analytics do
    get 'get_earliest_latest_dates', on: :collection
    get 'filter_products', on: :collection
    get 'filter_sources', on: :collection
    get 'get_sentiment_scores', on: :collection
    get 'get_overall_sentiment_scores', on: :collection
    get 'get_sentiments_sorted', on: :collection
    get 'get_sentiments_distribution', on: :collection
    post 'uploads', on: :collection # Added upload action as a collection route

  end
```

Test the above RESTFUL(identify api end point by a URL pattern) api calls by:

```bash
curl -X GET http://127.0.0.1:3000/analytics/get_earliest_latest_dates
curl -X GET http://127.0.0.1:3000/analytics/filter_products
curl -X GET http://127.0.0.1:3000/analytics/filter_sources
curl -X GET "http://127.0.0.1:3000/analytics/get_overall_sentiment_scores?fromDate=25/06/2024&toDate=02/07/2024&product=DBS%20Treasure&source=Product%20Survey"
curl -X GET "http://127.0.0.1:3000/analytics/get_sentiments_distribution?fromDate=02/07/2024&toDate=09/07/2024&product=DBS%20Treasure&source=Product%20Survey"

curl -X POST \
     -H "Content-Type: multipart/form-data" \
     -F "file=@README.md" \
     http://127.0.0.1:3000/analytics/uploads
```

not used yet:

```bash
curl -X GET http://127.0.0.1:3000/analytics/get_sentiments_sorted
curl -X GET http://127.0.0.1:3000/analytics/get_sentiment_scores
```
