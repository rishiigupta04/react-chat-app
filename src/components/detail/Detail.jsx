import React, { useState } from "react";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { toast } from "react-toastify";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";

const Detail = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    auth.signOut();
    resetChat();
  };
  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "/avatar.png"} alt="" />
        <h2>
          {isReceiverBlocked || isCurrentUserBlocked
            ? "User (Blocked)"
            : user?.username}
        </h2>
        <p>Hey, I'm new to this platform!</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="/arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://image.cnbcfm.com/api/v1/image/101074162-breaking-bad_r.jpg?v=1497619874&w=1920&h=1080"
                  alt=""
                />
                <span>photo_2024.png</span>
              </div>
              <img src="/download.png" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
