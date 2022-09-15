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

```sh
npm run dev
```

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
```