import React, { useEffect, useState } from "react";
import "./InstProfile.css";
import profileImage from "../../assets/Profile image.png";
import back from "../../assets/Background of Profile Image.jpg";
import { Button } from "react-bootstrap";
import { useProfile } from "../../contexts/ProfileContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import BootstrapModal from "./BootstrapModal";
import { useNight } from "../../contexts/NightContextProvider";
import PostCardForProfile from "../post/allPosts/PostCardForProfile";

const InstProfile = () => {
  const {
    getProfileInfo,
    profileMe,
    getPosts,
    myPosts,
    getMyPosts,
    posts,
    deletePost,
    getOnePost,
    onePost,
  } = useProfile();
  const [profile, setProfile] = useState(profileMe);
  console.log(profileMe);
  const { id } = useParams();
  const [grid, setGrid] = useState(true);
  const [lgShow, setLgShow] = useState(false);

  const renderTimestamp = (timestamp) => {
    let prefix = "";
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
      // less than one minute ago
      prefix = "just now...";
    } else if (timeDiff < 60 && timeDiff > 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      // less than 7 days ago
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  const navigate = useNavigate();
  useEffect(() => {
    getProfileInfo();
    getPosts();
  }, []);

  useEffect(() => {
    getMyPosts();
  }, [posts]);

  useEffect(() => {
    setProfile(profileMe);
  }, [profileMe]);

  const [posts1, setPost1] = useState(myPosts);
  const { night, setNight } = useNight();

  return (
    <div
      className="big-profile"
      style={{
        backgroundColor: `${night ? "white" : "black"}`,
        position: "absolute",
        top: "0",
        width: "96.5%",
        paddingTop: "2rem",
      }}
    >
      <div className={night ? "profile" : "profile2"}>
        <div className="profile-header">
          <div className="profile-image-container">
            <img src={profile.avatar} alt="Profile" className="profile-image" />
          </div>
          <div className="profile-info">
            <div className="profile-username-container">
              <h2 className="profile-username">
                {profile.name}
                {profile.last_name}
              </h2>
              <span>
                {/* <button className="msg-button">Message</button> */}
                <Button
                  onClick={() => {
                    navigate(`/profile/edit/${profile.id}`);
                  }}
                  variant="outline-primary"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/add-post`);
                  }}
                  variant="outline-success"
                >
                  Make Post
                </Button>
              </span>
            </div>
            <div>
              <p className="profile-bio">bio: {profile.bio}</p>
              <p className="profile-bio">email: {profile.email}</p>
              <p className="profile-bio">
                tongue: {profile.programming_language}
              </p>
              <p className="profile-bio">group: {profile.group}</p>
              <p className="profile-bio">live since: {profile.date_of_birth}</p>
            </div>
          </div>
        </div>
        <div className="upperPostsContainer">
          <h1>Activity</h1>
          <span>
            <button onClick={() => setGrid(true)}>
              <i class="bi bi-grid-3x3"></i>
            </button>
            <button onClick={() => setGrid(false)}>
              <i style={{ fontSize: "2.7rem" }} class="bi bi-list"></i>
            </button>
          </span>
        </div>
        <div className={grid ? "profile-content" : "profile-content2"}>
          {profileMe?.posts?.map((post) => (
            <div key={post.id}>
              {grid ? (
                <div className="post">
                  <div className="post-image-container">
                    <img
                      src={`http://34.125.13.20/${post.image}`}
                      alt="Post"
                      className="post-image"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <p className="post-caption">{post.title}</p>
                    <small style={{ opacity: "0.6" }}>
                      {renderTimestamp(post.created_at)}
                    </small>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <Button
                      onClick={() => {
                        deletePost(post.id);
                      }}
                      variant="outline-danger"
                    >
                      delete
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(`/edit-post/${post.id}`);
                      }}
                      variant="outline-success"
                    >
                      edit
                    </Button>

                    <Button
                      onClick={() => {
                        getOnePost(post.id);
                        setLgShow(true);
                      }}
                      variant="outline-primary"
                    >
                      details
                    </Button>
                  </div>
                  {lgShow ? (
                    <ProfileModal
                      setLgShow={setLgShow}
                      profileMe={profileMe}
                      myPosts={myPosts}
                      lgShow={lgShow}
                      onePost={onePost}
                      getOnePost={getOnePost}
                    />
                  ) : null}
                </div>
              ) : (
                <div className="profile-content2">
                  <PostCardForProfile post={post} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstProfile;
