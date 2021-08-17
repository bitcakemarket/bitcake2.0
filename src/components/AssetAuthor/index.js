import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore, auth } from "../../firebase";
import "./style.css";
function Item(props) {
  const { id } = useParams();
  const [creatorData, setCreatorData] = useState({ avatar: "/assets/img/avatars/avatar.jpg", firstName: "User", lastName: "" })
  const [collectionData, setCollectionData] = useState({ avatar: "/assets/img/avatars/avatar.jpg", firstName: "User", lastName: "" })
  // const { ownerId } = props.data;
  const [uid, setUid] = useState('')
  const getAvatars = async () => {
    let nft_item = (
      await firestore.collection("nfts").doc(id).get()
    ).data();
    setCreatorData((await firestore.collection("users").doc(nft_item.creatorId).get()).data())
    setCollectionData((await firestore.collection("collections").doc(nft_item.collection).get()).data())
  }
  useEffect(() => {
    if (id === "image" || id === "audio" || id === "video") {
      
    } else {
      getAvatars()
    }
  }, [id])
  return (
    <ul className="asset__authors">
      <li>
        <span>Creator</span>
        <div className="asset__author asset__author--verified">
          <img src={creatorData.avatar} alt=""/>
          <a href={`/creator/${id}`}>{creatorData.firstName} {creatorData.lastName}</a>
        </div>
      </li>
      <li>
        <span>Collection</span>
        <div className="asset__author ">
          <img src={collectionData.image} alt=""/>
          <a href="/collection">{collectionData.name}</a>
        </div>
      </li>
    </ul>
  );
}

export default Item;
