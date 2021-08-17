import React, {useState} from "react";
import "./style.css";
import {auth, firestore} from "../../firebase";
import {toast} from "react-toastify";
function Author(props) {
  const { id, bgImage, avatar, firstName, lastName, nickName, bio } = props.data;
  const [follows, setFollows] = useState(props.data.follows);

  const followUser = () => {
    if (auth.currentUser == null) {
      toast.error('You need to logged in before make likes')
      return
    }

    if (follows.includes(auth.currentUser.uid)) {
      toast.error('You already followed this NFT')
      return
    }

    if (id === auth.currentUser.uid) {
      toast.error('You are a owner')
      return
    }

    const temp = [...follows, auth.currentUser.uid];

    firestore.collection("users").doc(id).update({ follows: temp }).then(() => {
      setFollows(temp);
      toast.success('You followed ' + nickName);
      firestore.collection("activities").doc().set({
        owner: auth.currentUser.uid,
        title: "Following",
        method: "start",
        nickName: nickName,
        cover: avatar,
        followUser: id,
        createdAt: new Date()
      }).then(() => {

      });
    }).catch(err => {
      toast.error(err)
    })

  }

  return (
    <div className="author">
      <a
        href="/creator"
        className="author__cover author__cover--bg"
        data-bg={bgImage}
      ></a>
      <div className="author__meta">
        <a href="/creator" className="author__avatar author__avatar--verified">
          <img src={avatar} alt="" />
        </a>
        <h3 className="author__name">
          <a href="/creator">{firstName} {lastName}</a>
        </h3>
        <h3 className="author__nickname">
          <a href="/creator">{nickName}</a>
        </h3>
        <p className="author__text">{bio}</p>
        <div className="author__wrap">
          <div className="author__followers">
            {follows
              ?<p>{follows.length}</p>
              :<p>0</p>
            }
            <span>Followers</span>
          </div>
          <button className="author__follow" type="button" onClick={followUser}>
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
export default Author;
