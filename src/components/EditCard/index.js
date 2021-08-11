import React, {useEffect, useState} from "react";
import AudioImage from "./AudioImage";
import VideoImage from "./VideoImage";
import Countdown from "react-countdown";
import "./style.css";
import {Link} from "react-router-dom";
import {firestore, auth} from '../../firebase';
import {toast} from "react-toastify";
import {Modal} from "@material-ui/core";
import Switch from "react-switch";

function EditCard(props) {
  const {
    ownerId,
    type,
    image,
    imageBg,
    time,
    auctionLength,
    creatorId,
    title,
    id,
    verified,
    likes,
  } = props.data;


  const [category, setCategory] = useState(props.data.category);
  const [name, setName] = useState(props.data.name);
  const [description, setDescription] = useState(props.data.description);
  const [collection, setCollection] = useState(props.data.collection);
  const [price, setPrice] = useState(props.data.price);
  const [isSale, setIsSale] = useState(props.data.isSale);
  const [saleType, setSaleType] = useState(props.data.saleType);
  const [collections, setCollections] = useState([]);
  const [isCreateProcess, setCreateProcess] = useState(false);


  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setCategory(props.data.category);
    setName(props.data.name);
    setDescription(props.data.description);
    setPrice(props.data.price);
    setCollection(props.data.collection);
    setIsSale(props.data.isSale);
    setSaleType(props.data.saleType);

    setShowModal(false);
  }
  const handleShow = () => {
    setShowModal(true);
  }
  // const time = auctionLength === 0 ? null : auctionLength * 3600
  const [ownerAvatar, setOwnerAvatar] = useState("/assets/img/avatars/avatar.jpg")
  const [nickName, setNickName] = useState("@unkown")
  const [follow, setFollow] = useState(likes)
  const getAvatar = async () => {
    const url = (await firestore.collection("users").doc(ownerId).get()).data()
    if (url) {
      setOwnerAvatar(url?.avatar)
      setNickName(url?.nickName)
    }
  }

  const increaseLikes = () => {
    if (follow.includes(auth.currentUser.uid)) {
      toast.error('You already liked this NFT')
      return
    }
    if (creatorId === auth.currentUser.uid) {
      toast.error('You are a creator')
      return
    }
    const temp = [...follow, auth.currentUser.uid]
    firestore.collection("nfts").doc(id).update({likes: temp}).then(() => {
      setFollow(temp)
      toast.success('You follow NFT')
    }).catch(err => {
      toast.error(err)
    })
  }

  const getCollections = async () => {
    const currentCollections = await firestore.collection('collections').get()
    var temp = [];
    for (var i = 0; i < currentCollections.docs.length; i++) {
      var dataTemp = currentCollections.docs[i].data();
      temp.push(dataTemp);
    }
    setCollections(temp);
  }
  const updateItem = async() => {
    try {
      setCreateProcess(true);
      firestore.collection("nfts").doc(id).update({
        category: category,
        name: name,
        description: description,
        price: price,
        collection: collection,
        saleType: saleType,
        isSale: isSale,
      }).then(() => {
        setCreateProcess(false);
        setShowModal(false);
        toast.success("Updated NFT successfully")
      }).catch(err => {
        setCreateProcess(false);
        setShowModal(false);
        toast.error(err)
      })
    } catch (err) {
      setCreateProcess(false);
      setShowModal(false);
      console.log('error', err);
    }

  }

  let currency = localStorage.getItem('currency');

  useEffect(() => {
    getAvatar()
    getCollections()
  }, [ownerId])
  return (
    <div className="card">
      {type === 'image' ?
        (typeof (image) === 'string' ?
          <div className="card__cover card__cover--video video" onClick={handleShow}>
            {/*<Link to={`/edit-item/${id ? id : type}`} className="card__cover card__cover--video video">*/}
            <img src={image ? image : 'assets/img/cover/cover2.jpg'} alt="" className="video-content"/>
            {!(time === undefined || time === 0 || time === null) &&
            <div className="card__time card__time--clock">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z"/>
              </svg>
              <div className="card__clock">
                <Countdown date={time}/>
              </div>
            </div>
            }
          </div> :
          <div className="card__cover card__cover--carousel owl-carousel">
            {image.map((path, index) => (
              <img src={path} alt="" key={`image-${index}`}/>
            ))}
          </div>)
        : type === 'audio' ?

          <div className="w-full overflow-hidden relative">
            <div className="card__cover card__cover--video video" onClick={handleShow}>
              {/*<Link to={`/edit-item/${id?id:type}`} className="card__cover card__cover--video video">*/}
              <AudioImage
                src={imageBg ? imageBg : 'assets/img/cover/cover2.jpg'}
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
                  <path
                    d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z"/>
                </svg>
                <div className="card__clock">
                  <Countdown date={time}/>
                </div>
              </div>
              }
            </div>
          </div> :
          <div className="card__cover card__cover--video video" onClick={handleShow}>
            {/*<Link to={`/edit-item/${id?id:type}`} className="card__cover card__cover--video video">*/}
            <VideoImage src={image}/>
            {!(time === undefined || time === 0 || time === null) &&
            <div className="card__time card__time--clock">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z"/>
              </svg>
              <div className="card__clock">
                <Countdown date={time}/>
              </div>
            </div>
            }
          </div>
      }
      <h3 className="card__title" onClick={handleShow}>
        {/*<Link to={`/edit-item/${id?id:type}`}>{title}</Link>*/}
        <div>{name}</div>
      </h3>
      <div className={`card__author ${verified ? 'card__author--verified' : ''}`}>
        <img src={ownerAvatar} alt=""/>
        <Link to={ownerId ? `/creator/${ownerId}` : '/'}>{nickName}</Link>
      </div>
      <div className="card__info" onClick={handleShow}>
        <div className="card__price">
          <span>Current price</span>
          <span>{price} BNB</span>
        </div>

        <button className="card__likes" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M20.16,5A6.29,6.29,0,0,0,12,4.36a6.27,6.27,0,0,0-8.16,9.48l6.21,6.22a2.78,2.78,0,0,0,3.9,0l6.21-6.22A6.27,6.27,0,0,0,20.16,5Zm-1.41,7.46-6.21,6.21a.76.76,0,0,1-1.08,0L5.25,12.43a4.29,4.29,0,0,1,0-6,4.27,4.27,0,0,1,6,0,1,1,0,0,0,1.42,0,4.27,4.27,0,0,1,6,0A4.29,4.29,0,0,1,18.75,12.43Z"/>
          </svg>
          <span>{follow.length}</span>
        </button>
      </div>
      <Modal open={showModal} onClose={handleClose}>
        <div id="modal-bid" className="zoom-anim-dialog modal modal--form">
          <button className="modal__close" type="button" onClick={handleClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/>
            </svg>
          </button>

          <h4 className="sign__title">Update Item</h4>


          <div className="sign__group sign__group--row">
            <label className="sign__label" htmlFor="category">
              Select Category
            </label>
            <select
              id="category"
              name="category"
              className="sign__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="art">Art</option>
              <option value="music">Music</option>
              <option value="film">Film</option>
              <option value="sports">Sports</option>
              <option value="education">Education</option>
              <option value="photography">Photography</option>
              <option value="games">Games</option>
              <option value="other">Other</option>
            </select>

            <label className="sign__label" htmlFor="name">Name</label>
            <input id="name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} className="sign__input"/>

            <label className="sign__label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="sign__textarea"
              placeholder="e.g. ‘After purchasing, you will receive…’"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <label className="sign__label" htmlFor="collection">
              Create or Select Collection
            </label>
            <select
              id="collection"
              name="collection"
              className="sign__select"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            >

              <option value="" disabled> -- Select an Option -- </option>
              {collections.length && (collections
                .map(
                  (collection, index) =>
                    <option value={collection.name} key={`option-${index}`}>{collection.name}</option>
                ))}
            </select>

            <label className="sign__label" htmlFor="saleType">
              Price and type
            </label>
            <select
              id="saleType"
              name="saleType"
              className="sign__select"
              value={saleType}
              onChange={(e) => setSaleType(e.target.value)}
            >
              <option value="fix">Buy Now</option>
              <option value="auction">Auction</option>
              <option value="auctionBuy">Auction or Auction w/Buy Now</option>
            </select>

            <div className="col-9">
              <label className="sign__label" htmlFor="price">
                {saleType !== "fix" ? "Starting Bid " : ""}Price - in
                "BNB"
              </label>
            </div>
            <div className="col-3">
              <label className="sign__label" htmlFor="sale">
                Sale
              </label>
            </div>
            <div className="col-9">
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                name="price"
                className="sign__input"
                placeholder=""
              />
            </div>
            <div className="col-3">
              <Switch
                onChange={() => {
                  setIsSale(!isSale);
                }}
                checked={isSale}
                height={26}
              />
            </div>

            <div>
              <label className="sign__label" htmlFor="price">
                Price in USD: ${(price * currency).toFixed(2)}<br/>
                current BNB price: 1 BNB = ${currency}
              </label>
            </div>
          </div>

          <button className="sign__btn" type="button" onClick={updateItem} disabled={isCreateProcess}>Update Item</button>
        </div>
      </Modal>
    </div>
  );
}

export default EditCard;
