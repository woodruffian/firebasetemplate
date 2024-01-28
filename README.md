# firebase-auth

## Project setup

```
npm install
```

you'll need a copy of my firebaseConfig.js file in order to push data and authentication into the same database. Alternatively, you can create your own Firebase realtime database and use that one for development if you like. After you set up the database, you have to add an application to it and then it will give you the credentials to put into your firebaseConfig.js file:

// Your web app's Firebase configuration
export const firebaseConfig = {
apiKey:
authDomain:
databaseURL:
projectId:
storageBucket:
messagingSenderId:
appId:
};

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
