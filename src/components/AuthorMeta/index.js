import React, {useState} from "react";
import {auth, firestore} from "../../firebase";
import {toast} from "react-toastify";

function AuthorMeta(props) {
  const { avatar, firstName, lastName, nickName, bio, id } = props.data;
  const {code} = props

  const [follows, setFollows] = useState(props.data.follows);

  console.log('follows', follows);

  // const [follows, setFollows] = useState(props.data.follows);
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
      setFollows(temp)
      toast.success('You followed ' + nickName)
      firestore.collection("activities").doc().set({
        owner: auth.currentUser.uid,
        title: "Following",
        method: "start",
        nickName: nickName,
        followUser: id,
        cover: avatar,
        createdAt: new Date()
      }).then(() => {

      });
    }).catch(err => {
      toast.error(err)
    })

  }
  return (
    <div className="author__meta">
      <div className="author__avatar author__avatar--verified">
        <img src={avatar} alt="" />
      </div>
      <h1 className="author__name">
        {firstName } { lastName }
      </h1>
      <h2 className="author__nickname">
        {nickName}
      </h2>
      <p className="author__text">{bio}</p>
      <div className="author__code">
        <input type="text" value={code || ''} id="author-code" readOnly />
        <button type="button">
          <span>Copied</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M18,19H6a3,3,0,0,1-3-3V8A1,1,0,0,0,1,8v8a5,5,0,0,0,5,5H18a1,1,0,0,0,0-2Zm5-9.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19l-.09,0L16.06,3H8A3,3,0,0,0,5,6v8a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V10S23,10,23,9.94ZM17,6.41,19.59,9H18a1,1,0,0,1-1-1ZM21,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V6A1,1,0,0,1,8,5h7V8a3,3,0,0,0,3,3h3Z" />
          </svg>
        </button>
      </div>
      <div className="author__wrap">
        <div className="author__followers">
          {
            follows
            ?<p>{follows.length}</p>
            :<p>0</p>
          }
          <span>Followers</span>
        </div>
        <button className="author__follow" type="button" onClick={followUser}>Follow</button>
      </div>
    </div>
  );
}
export default AuthorMeta;
