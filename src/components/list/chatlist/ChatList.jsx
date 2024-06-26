import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

// This component renders the chat list of the current user.
// It fetches the chat data from the Firestore database and displays it in the UI.
const ChatList = () => {
  // State variables to store the chat data and the add mode.
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  // Get the current user from the user store.
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  // Fetch the chat data from Firestore when the component mounts or when the current user changes.
  useEffect(() => {
    // Subscribe to changes in the chat data of the current user.
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        // Get the chat items from the response.
        const items = res.data().chats;

        // Fetch the user data for each chat item.
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        // Wait for all the user data fetches to complete and store them in the chat data.
        const chatData = await Promise.all(promises);

        // Sort the chat data by the last message timestamp in descending order.
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    // Cleanup the Firestore subscription when the component unmounts.
    return () => unSub();
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  // Render the chat list UI.
  return (
    <div className="chatList">
      {/* Search bar for filtering the chat list */}
      <div className="search">
        <div className="searchBar">
          <img src="/search.png" alt="" />
          <input
            type="text"
            name=""
            id=""
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {/* Toggle add mode button */}
        <img
          onClick={() => setAddMode(!addMode)}
          src={addMode ? "/minus.png" : "/plus.png"}
          alt=""
          className="add"
        />
      </div>

      {/* Render each chat item */}
      {filteredChats.map((chat) => (
        <div
          key={chat.chatId}
          className="item"
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "/avatar.png"
                : chat.user.avatar || "/avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {/* Render the add user UI if add mode is enabled */}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
