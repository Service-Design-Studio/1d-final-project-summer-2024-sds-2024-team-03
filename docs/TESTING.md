## CURL Test Actionable Page

```bash
curl -X POST http://localhost:3000/actionables.json \
     -H "Content-Type: application/json" \
     -d '{
           "actionable": {
             "action": "New Actionable",
             "status": "In Progress",
             "subproduct": "Credit Card",
             "actionable_category": "To Fix",
             "feedback_category": "Application",
             "feedback_json": "sucks"
           }
         }'
```

## Test Upload File with CURL

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

CRUD: currently no C, U or D for sprint2 (analytics)

## Backend Unit Testing with Rspec

1. To generate the rspeccode

```bash
bundle exec rspec
```

2. To generate code coverage
   coverage/index.html

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

## Backend Unit Testing with Rspec

## Integration Testing with Cucumber

To setup the testing with cucumber, run the following command.

bundle exec rake db:migrate RAILS_ENV=test

bundle exec cucumber

rails db:migrate RAILS_ENV=test
