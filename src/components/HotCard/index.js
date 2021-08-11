import React, {useEffect, useState} from "react";
import './style.css';
import {auth, firestore} from "../../firebase";
import {toast} from "react-toastify";
import { Link } from "react-router-dom";

import $ from "jquery";
import ipfs from "../../utils/ipfsApi";

function HotCard(props) {
  const {
    creatorId,
    name,
    id
  } = props.data;

  const [coverImage, setCoverImage] = useState(props.data.coverImage);
  const [image, setImage] = useState(props.data.image);

  const [ownerAvatar, setOwnerAvatar] = useState("/assets/img/avatars/avatar.jpg")
  const [nickName, setNickName] = useState("@unkown")
  const getAvatar = async () => {
    const url = (await firestore.collection("users").doc(creatorId).get()).data()
    if (url) {
      setOwnerAvatar(url?.avatar)
      setNickName(url?.nickName)
    }
  }
  const changeCoverImage = async (files) => {
    if (files.length > 0) {
      let collectionStr;
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        // Do whatever you want with the file contents
        collectionStr = reader.result;

        const imgCover = await ipfs.files.add(Buffer.from(collectionStr));

        firestore.collection("collections").doc(id).update({ coverImage: `https://ipfs.io/ipfs/${imgCover[0].hash}` }).then(() => {
          setCoverImage(`https://ipfs.io/ipfs/${imgCover[0].hash}`);
          toast.success('Updated Cover Image')
        }).catch(err => {
          toast.error(err)
        })

      };
      reader.readAsArrayBuffer(files[0]);
    }
  }
  const changeCollectionImage = (files) => {
    if (files.length > 0) {
      let collectionStr;
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        // Do whatever you want with the file contents
        collectionStr = reader.result;

        const imgCollection = await ipfs.files.add(Buffer.from(collectionStr));

        firestore.collection("collections").doc(id).update({ image: `https://ipfs.io/ipfs/${imgCollection[0].hash}` }).then(() => {
          setImage(`https://ipfs.io/ipfs/${imgCollection[0].hash}`);
          toast.success('Updated Collection Image')
        }).catch(err => {
          toast.error(err)
        })

      };
      reader.readAsArrayBuffer(files[0]);
    }
  }
  const handleCoverImage = () => {
    $('#cover-image-' + id).click();
  }

  const handleCollectionImage = () => {
    $('#collection-image-' + id).click();
  }

  useEffect(() => {
    getAvatar()
  }, [id, creatorId])

  return (
    <div className="collection">
      <div className="collection__cover" onClick={handleCoverImage}>
        <input accept="image/jpeg, image/png, image/gif" style={{ display: "none" }} id={"cover-image-" + id} type="file" onChange={(e) => changeCoverImage(e.target.files)}/>
        <img src={coverImage ? coverImage : ''} />
      </div>
      <div className="collection__meta">
        <div className="collection__avatar" onClick={handleCollectionImage}>
          <input accept="image/jpeg, image/png, image/gif" style={{ display: "none" }} id={"collection-image-" + id} type="file" onChange={(e) => changeCollectionImage(e.target.files)}/>
          <img src={image} alt="" />
        </div>
        <Link to={`/collection/${id}`}>
        <h3 className="collection__name">{name}</h3>
        <span className="collection__number">{nickName}</span>
        </Link>
      </div>
    </div>
  );
}

export default HotCard;
