import React, { useState } from "react";
import "./detail.css";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";

const Detail = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  return (
    <div className="detail">
      <div className="user">
        <img src="/avatar.png" alt="" />
        <h2>John Doe</h2>
        <p>Lorem, ipsum dolor sit amet consectetur.</p>
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
        <button
          onClick={() => {
            isBlocked
              ? toast.success("User Unblocked!")
              : toast.error("User Blocked!");
            setIsBlocked(!isBlocked);
          }}
        >
          {!isBlocked ? "Block User" : "Unblock User"}
        </button>
        <button
          onClick={() => {
            auth.signOut(), toast.warn("Logged out!");
          }}
          className="logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
