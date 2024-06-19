# Production: Linking React to Rails

## create static file in react build folder

in react directory, run on terminal:

```bash
npm run build
```

## copy content

Copy content in react/build folder to public/react_build

## change static js build

copy the /react_build/static/js/main.\_\_\_.js into app>views>layouts>jbaaam.html.erb

## Run gcloud deployment

Look at DEPLOYMENT.md for instructions

# Development

-   For ruby, just use rails server
-   For react, from react directory, run:

```bash
npm start
```
