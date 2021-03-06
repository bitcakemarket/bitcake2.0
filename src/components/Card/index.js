import React, { useEffect, useState } from "react";
import AudioImage from "./AudioImage";
import VideoImage from "./VideoImage";
import Countdown from "react-countdown";
import "./style.css";
import { Link } from "react-router-dom";
import { firestore, auth } from '../../firebase';
import { toast } from "react-toastify";
function Card(props) {
  const {
    ownerId,
    type,
    image,
    imageBg,
    time,
    auctionLength,
    creatorId,
    title,
    price,
    id,
    saleType,
    verified,
    name
  } = props.data;

  const [ownerAvatar, setOwnerAvatar] = useState("/assets/img/avatars/avatar.jpg")
  const [nickName, setNickName] = useState("@unkown")
  const [likes, setLikes] = useState(props.data.likes)
  const getAvatar = async () => {
    const url = (await firestore.collection("users").doc(ownerId).get()).data()
    if (url) {
      setOwnerAvatar(url?.avatar)
      setNickName(url?.nickName)
    }
  }

  const increaseLikes = () => {
    if (auth.currentUser == null) {
      toast.error('You need to logged in before make likes')
      return
    }

    if (likes.includes(auth.currentUser.uid)) {
      toast.error('You already liked this NFT')
      return
    }
    if (creatorId === auth.currentUser.uid) {
      toast.error('You are a creator')
      return
    }
    const temp = [...likes, auth.currentUser.uid]
    firestore.collection("nfts").doc(id).update({ likes: temp }).then(() => {
      setLikes(temp)
      toast.success('You likes NFT');

      firestore.collection("activities").doc().set({
        owner: auth.currentUser.uid,
        title: "Like",
        method: "like",
        nickName: nickName,
        cover: image,
        createdAt: new Date()
      }).then(() => {

      });

    }).catch(err => {
      toast.error(err)
    })
  }
  
  useEffect(() => {
    getAvatar()
  }, [ownerId])
  return (
    <div className="card">
      {type === 'image' ?
        (typeof (image) === 'string' ?
        <Link to={`/item/${id ? id : type}`} className="card__cover card__cover--video video">
        <img src={image? image: 'assets/img/cover/cover2.jpg'} alt="" className="video-content"/>
        {!(time === undefined || time === 0 || time === null) &&
            <div className="card__time card__time--clock">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z" />
              </svg>
              <div className="card__clock">
                <Countdown date={time} />
              </div>
            </div>
          }        
      </Link>:
      <div className="card__cover card__cover--carousel owl-carousel">
        {image.map((path,index)=>(
          <img src={path} alt="" key={`image-${index}`}/>
        ))}
      </div>)
      : type==='audio' ? 
      
      <div className="w-full overflow-hidden relative">
          <Link to={`/item/${id?id:type}`} className="card__cover card__cover--video video">
            <AudioImage
              src={imageBg? imageBg: 'assets/img/cover/cover2.jpg'}
              audioPath={image}
              onClick={(e) => {
                e.preventDefault();
            }}/>
            {!(time === undefined || time === 0 || time === null) &&
              <div className="card__time card__time--clock">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z" />
                </svg>
                <div className="card__clock">
                  <Countdown date={time} />
                </div>
              </div>
            }        
          </Link>
      </div>:
      <Link to={`/item/${id?id:type}`} className="card__cover card__cover--video video">
        <VideoImage src={image} />
        {!(time === undefined || time === 0 || time === null) &&
            <div className="card__time card__time--clock">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z" />
              </svg>
              <div className="card__clock">
                <Countdown date={time} />
              </div>
            </div>
          }        
      </Link>
    }
    <h3 className="card__title">
      <Link to={`/item/${id?id:type}`}>{name}</Link>
    </h3>
    <div className={`card__author ${verified?'card__author--verified':''}`}>
        <img src={ownerAvatar} alt="" />
        <Link to={ownerId? `/creator/${ownerId}` : '/'}>{nickName}</Link>
      </div>
      <div className="card__info">
        <div className="card__price">
          <span>Current price</span>
          <span>{price} BNB</span>
        </div>

        <button className="card__likes" type="button" onClick={increaseLikes}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20.16,5A6.29,6.29,0,0,0,12,4.36a6.27,6.27,0,0,0-8.16,9.48l6.21,6.22a2.78,2.78,0,0,0,3.9,0l6.21-6.22A6.27,6.27,0,0,0,20.16,5Zm-1.41,7.46-6.21,6.21a.76.76,0,0,1-1.08,0L5.25,12.43a4.29,4.29,0,0,1,0-6,4.27,4.27,0,0,1,6,0,1,1,0,0,0,1.42,0,4.27,4.27,0,0,1,6,0A4.29,4.29,0,0,1,18.75,12.43Z" />
          </svg>
          <span>{likes.length}</span>
        </button>
      </div>
    </div>
  );
}

export default Card;
