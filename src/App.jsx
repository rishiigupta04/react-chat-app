import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import Chat from "./components/chat/Chat";
import List from "./components/list/List";
import Detail from "./components/detail/Detail";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { Route, Routes, useNavigate } from "react-router-dom";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    });

    return () => unSub();
  }, [fetchUserInfo, navigate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container" style={{ overflow: "hidden" }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <>
                <List />
                {chatId && <Chat />}
                {chatId && <Detail />}
              </>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
      <Notification />
    </div>
  );
};

export default App;
