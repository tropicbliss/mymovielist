# mymovielist

Remember to create `firebaseConfig.js` in the root directory with the following format:


```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "foo",
  authDomain: "bar",
  projectId: "baz",
  storageBucket: "qux",
  messagingSenderId: "fred",
  appId: "thud",
};
```

In the `functions` directory, create `apiKeys.js` in the following format:

```js
const NEWS_API_KEY = "foo";
const OMDB_API_KEY = "bar";

module.exports = { NEWS_API_KEY, OMDB_API_KEY };
```

```sh
npm run dev
```
