import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { database } from "../firebaseConfig";
import {
  collection,
  orderBy,
  addDoc,
  query,
  serverTimestamp,
  limitToLast,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import navStyles from "../styles/Nav.module.css";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Toast from "../components/Toast";
import { classNames } from "../utilities";

const chat = () => {
  const [user] = useAuthState(auth);

  return <section>{user ? <ChatRoom /> : <SignInWarning />}</section>;
};

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(database, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limitToLast(25));
  const [messages] = useCollectionData(q);
  const [formValue, setFormValue] = useState("");
  const [show, setShow] = useState(false);
  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue === "") {
      setShow(true);
      return;
    }
    const { uid, photoURL } = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Toast
        show={show}
        setShow={setShow}
        isSuccess={false}
        title="Unable to send message"
        description="Message cannot be empty."
      />
      <div>
        {messages &&
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
        <div ref={dummy}></div>
      </div>
      <form className="flex" onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Say something nice"
          className="w-full rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple"
        />
        <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
          <button
            type="submit"
            className="inline-flex items-center rounded-full border border-transparent bg-cyber-purple p-3 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PaperAirplaneIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const msgStatus = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div
      className={classNames(
        msgStatus === "sent" && "flex-row-reverse",
        "flex items-center my-3"
      )}
    >
      <img
        className={navStyles.pfp}
        src={photoURL}
        referrerPolicy="no-referrer"
      />
      <div className="inline-flex mx-3 items-center rounded-full bg-cyber-purple text-white px-5 py-2 overflow-scroll">
        {text}
      </div>
    </div>
  );
}

function SignInWarning() {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Authentication needed
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>To access this chat feature, you need to be signed in.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default chat;