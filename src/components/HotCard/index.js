import React, {useEffect, useState} from "react";
import './style.css';
import {auth, firestore} from "../../firebase";
import {toast} from "react-toastify";
function HotCard(props) {
  const {
    ownerId,
    image,
    name,
    creatorId,
    category,
    id,
    verified,
  } = props.data;

  const [ownerAvatar, setOwnerAvatar] = useState("/assets/img/avatars/avatar.jpg")
  const [nickName, setNickName] = useState("@unkown")
  const getAvatar = async () => {
    const url = (await firestore.collection("users").doc(ownerId).get()).data()
    if (url) {
      setOwnerAvatar(url?.avatar)
      setNickName(url?.nickName)
    }
  }

  useEffect(() => {
    getAvatar()
  }, [ownerId])

  return (
    <div className="collection">
      <a href="#" className="collection__cover" >
        <img src={image ? image : ''} />
      </a>
      <div className="collection__meta">
        <a href="#" className="collection__avatar collection__avatar--verified">
          <img src={ownerAvatar} alt="" />
        </a>
        <h3 className="collection__name"><a href="collection.html">{name}</a></h3>
        <span className="collection__number">{category}</span>
      </div>
    </div>
  );
}

export default HotCard;
