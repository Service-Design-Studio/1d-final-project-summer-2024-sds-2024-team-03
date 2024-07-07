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
