import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (chat) => chat.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setImg({
      file: null,
      url: "",
    });
    setText("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText(text + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "/avatar.png"} alt="" />
          <div className="texts">
            <span>
              {isReceiverBlocked || isCurrentUserBlocked
                ? "User (Blocked)"
                : user?.username}
            </span>
            <p>Hey, I'm new to this platform!</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="" />
          <img src="/video.png" alt="" />
          <img src="/info.png" alt="" />
        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            key={message?.createdAt}
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span></span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}

        {img.url && (
          <div className="message">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        {!(isCurrentUserBlocked || isReceiverBlocked) && (
          <div className="icons">
            <label htmlFor="file">
              <img src="/img.png" alt="" />
            </label>
            <input
              type="file"
              name=""
              id="file"
              style={{
                display: "none",
              }}
              onChange={handleImg}
            />
            <img src="/camera.png" alt="" />
            <img src="/mic.png" alt="" />
          </div>
        )}
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          value={text}
          name=""
          id=""
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "Can't message a blocked user"
              : "Type a message..."
          }
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div className="emoji">
          <img src="/emoji.png" alt="" onClick={() => setOpen(!open)} />

          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>

        <button
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          onClick={handleSend}
          className="sendButton"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
