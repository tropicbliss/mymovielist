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

```sh
npm run dev
```
