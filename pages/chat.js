import { useContext, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
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
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { classNames } from "../utilities";
import { GlobalContext } from "../context/GlobalState";
import Warning from "../components/Warning";
import Image from "next/image";

const Chat = () => {
  const [user] = useAuthState(auth);

  return (
    <section>
      {user ? (
        <ChatRoom />
      ) : (
        <Warning
          title="Authentication needed"
          description="To access this chat feature, you need to be signed in."
        />
      )}
    </section>
  );
};

function ChatRoom() {
  const { setToast, setErrorMsg, unknownError, setLoad } =
    useContext(GlobalContext);
  const dummy = useRef();
  const messagesRef = collection(database, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limitToLast(25));
  const [messages] = useCollectionData(q);
  const [formValue, setFormValue] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue.trim() === "") {
      setErrorMsg("Error sending message", "Message cannot be empty.");
      setToast(true);
      setFormValue("");
      return;
    }
    setLoad(true);
    const { uid, photoURL } = auth.currentUser;
    try {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      });
      dummy.current.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      unknownError();
    } finally {
      setFormValue("");
      setLoad(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div>
        {messages &&
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
        <div ref={dummy}></div>
      </div>
      <form className="flex space-x-1 sm:space-x-3" onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Say something nice"
          className="w-full rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple"
        />
        <div className="mt-3 rounded-md sm:mt-0 sm:flex-shrink-0">
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
      <Image
        layout="fixed"
        width="40px"
        height="40px"
        src={photoURL}
        alt="Avatar of the user"
        style={{ borderRadius: "50%" }}
        referrerPolicy="no-referrer"
        priority
      />
      <div className="inline-flex mx-3 items-center rounded-full bg-cyber-purple text-white px-5 py-2 overflow-scroll">
        {text}
      </div>
    </div>
  );
}

export default Chat;
