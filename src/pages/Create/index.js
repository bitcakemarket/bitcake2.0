import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import AuthorMeta from "../../components/AuthorMeta";
import NFTDropzone from "../../components/Dropzone";
import Switch from "react-switch";
import { firestore } from "../../firebase";
import { toast } from "react-toastify";
import { NFTStorage } from "nft.storage";
import { NFTStorageKey, FactoryAddress } from "../../constants/index";
import { auth } from "../../firebase";
import ipfs from "utils/ipfsApi.js";
import "styles/create.css";
import {Web3Provider} from "@ethersproject/providers";
import {Modal} from "@material-ui/core";
import Card from "../../components/Card";

const client = new NFTStorage({ token: NFTStorageKey });

const author = {
  avatar: "/assets/img/avatars/avatar.jpg",
  authorName: "Adam Zapel",
  nickName: "@aaarthur",
  code: "XAVUW3sw3ZunitokcLtemEfX3tGuX2plateWdh",
  text: "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary",
  followers: 3829,
};

function Create() {
  const [user, setUser] = useState({});
  const [type, setType] = useState("audio");
  const [file, setFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [collectionImage, setCollectionImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [category, setCategory] = useState("art");
  const [isAttach, setIsAttach] = useState(false);
  const [attachFile, setAttachFile] = useState(null);
  const [name, setName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [royalties, setRoyalties] = useState("0");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [saleType, setSaleType] = useState("fix");
  const [collection, setCollection] = useState("");
  const [auctionLength, setAuctionLength] = useState("12");
  const [buffer, setBuffer] = useState(null);
  const [bgBuffer, setBgBuffer] = useState(null);
  const [collectionImgBuffer, setCollectionImgBuffer] = useState(null);
  const [coverImgBuffer, setCoverImgBuffer] = useState(null);
  const [attachBuffer, setAttachBuffer] = useState(null);
  const [isCreateProcess, setCreateProcess] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [isCopyright, setIsCopyright] = useState(false);
  const [originalCreator, setOriginalCreator] = useState(false);
  const [collections, setCollections] = useState([]);
  const [authorVerify, setAuthorVerify] = useState(false);

  const { library, active, account } = useWeb3React();
  const history = useHistory();

  const [currency, setCurrency] = useState(0);
  const [showCollectionModal, setCollectionModal] = useState(false);

  const hideCollectionModal = () => {
    setCollectionModal(false);
  }

  const query = `{
    ethereum(network: bsc) {
      dexTrades(
        baseCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
        quoteCurrency: {is: "0x55d398326f99059ff775485246999027b3197955"}
        options: {desc: ["block.height", "transaction.index"], limit: 1}
      ) {
        block {
          height
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
        }
        transaction {
          index
        }
        baseCurrency {
          symbol
        }
        quoteCurrency {
          symbol
        }
        quotePrice
      }
    }
  }`;
  function sendRequest(query) {
    return new Promise((resolve, reject) => {
      fetch("https://graphql.bitquery.io/", {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          query: query,
          variables: "{}"
        }),
      })
        .then(response => response.json())
        .then(json => {
          resolve(json.data)
        })
        .catch(() => {
          reject()
        })
    })
  }

  useEffect(() => {
    getCollections();
    sendRequest(query).then(function(resp) {
      console.log('sendRequest', resp.ethereum.dexTrades);
      if (resp.ethereum.dexTrades) {
        if (resp.ethereum.dexTrades.length > 0) {
          setCurrency(resp.ethereum.dexTrades[0]['quotePrice'].toFixed(2));
          localStorage.setItem('currency', currency);
        } else {
          setCurrency(340);
          localStorage.setItem('currency', 340);
        }
      } else {
        setCurrency(340);
        localStorage.setItem('currency', 340);
      }
    });
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (!active) {
          history.push("/connect-wallet");
        }
        getProfile(user);
      } else {
        history.push("/signin");
      }
    });
  }, []);

  const getProfile = async (user) => {
    let userProfile = (
      await firestore.collection("users").doc(user.uid).get()
    ).data();
    const temp = { id: user.uid, email: user.email, ...userProfile };
    console.log('setUser', temp);
    setUser(temp);
  };

  const getCollections = async () => {
    const currentCollections = await firestore.collection('collections').get()
    var temp = [];
    for (var i = 0; i < currentCollections.docs.length; i++) {
      var dataTemp = currentCollections.docs[i].data();
      dataTemp.id = currentCollections.docs[i].id;
      temp.push(dataTemp);
    }
    setCollections(temp);
  }

  const getFile = (file, isAttach = false) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      if (!isAttach) setBuffer(binaryStr);
      else setAttachBuffer(binaryStr);
    };
    reader.readAsArrayBuffer(file);
  };
  const getBgFile = (file) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      setBgBuffer(binaryStr);
    };
    reader.readAsArrayBuffer(file);
  };

  const getCollectionImage = (file) => {
    console.log('file', file);
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      setCollectionImgBuffer(binaryStr);
      console.log('binaryStr', binaryStr);
    };
    reader.readAsArrayBuffer(file);
  };

  const getCoverImage = (file) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      setCoverImgBuffer(binaryStr);
    };
    reader.readAsArrayBuffer(file);
  };

  const changeCollection = (value) => {
    console.log('value', value);
    if (value === "" || value === "newCollection") {
      setCollectionModal(true);
    } else {
      setCollection(value);
    }
  };

  const createCollection = async () => {
    try {
      setCreateProcess(true);
      const imgCollection = collectionImage ? await ipfs.files.add(Buffer.from(collectionImgBuffer)) : null;
      const imgCover = coverImage ? await ipfs.files.add(Buffer.from(coverImgBuffer)) : null;

      firestore
        .collection("collections")
        .doc()
        .set({
          creatorId: user.id,
          image: `https://ipfs.io/ipfs/${imgCollection[0].hash}`,
          coverImage: `https://ipfs.io/ipfs/${imgCover[0].hash}`,
          name: collectionName,
        })
        .then(async () => {
          toast.success("Create Collection Success");
          const currentCollections = await firestore.collection("collections").get();
          var temp = [];
          for (var i = 0; i < currentCollections.docs.length; i++) {
            var dataTemp = currentCollections.docs[i].data();
            dataTemp.id = currentCollections.docs[i].id;
            if (dataTemp.name === collectionName) {
              setCollection(dataTemp.id);
            }
            temp.push(dataTemp);
          }
          setCollections(temp);
          setCollectionModal(false);
          setCreateProcess(false);
        })
        .catch((err) => {
          toast.error("Create Collection failed.");
          setCollectionModal(false);
          console.log(err);
        });
      setCreateProcess(false);

    } catch (err) {
      setCreateProcess(false);
      console.log(err);
    }
  };

  const createNFT = async () => {
    if (!authorVerify) {
      toast.error("Please ensure you are the author of the copyrighted work and/or you are authorized to sell this item");
      return
    }
    try {
      if (account) {
        await library
          .getSigner(account)
          .signMessage("Please check this account is yours");
        if (account) {
          setCreateProcess(true);
          const result = await ipfs.files.add(Buffer.from(buffer));
          const imgBg = bgFile ? await ipfs.files.add(Buffer.from(bgBuffer)) : null;
          const imgAttach = attachFile
            ? await ipfs.files.add(Buffer.from(attachBuffer))
            : null;
          const cid = await client.storeDirectory([
            new File(
              [
                JSON.stringify({
                  name: name,
                  description: description,
                  creator: account,
                  type,
                  category,
                  collection: collection,
                  createdAt: new Date(),
                  royalties: parseInt(royalties) * 5,
                  image: `https://ipfs.io/ipfs/${result[0].hash}`,
                  imageAttach: imgAttach
                    ? `https://ipfs.io/ipfs/${imgAttach[0].hash}`
                    : null,
                  imageBg: imgBg ? `https://ipfs.io/ipfs/${imgBg[0].hash}` : null,
                }),
              ],
              "metadata.json"
            ),
          ]);
          if (cid) {
            const tokenURI = `https://ipfs.io/ipfs/${cid}/metadata.json`;
            firestore
              .collection("nfts")
              .doc()
              .set({
                tokenId: 0,
                tokenURI,
                ownerId: user.id,
                creatorId: user.id,
                owner: account,
                creator: account,
                price,
                saleType,
                collection: collection,
                auctionLength: saleType !== "fix" ? parseInt(auctionLength) : 0,
                time: saleType !== "fix" ? Date.now() + 3600 * 1000 * parseInt(auctionLength) : 0,
                likes: [],
              })
              .then(() => {
                toast.success("Create NFT");
                setCreateProcess(false);
                firestore.collection("activities").doc().set({
                  owner: auth.currentUser.uid,
                  title: "List",
                  method: "list",
                  nickName: user.nickName,
                  cover: `https://ipfs.io/ipfs/${result[0].hash}`,
                  bnbPrice: price,
                  createdAt: new Date()
                }).then(() => {
                  history.push(`/creator/${user.id}`);
                });
              })
              .catch((err) => {
                toast.error("Create failed.");
                console.log(err);
                setCreateProcess(false);
              });
          } else {
            toast.error("Uploading failed");
            setCreateProcess(false);
          }
        }
      } else {
        toast.error("Connect Wallet before creating item");

      }

    } catch (err) {
      console.log(err);
    }
  };
  return (
    <main className="main">
      <div className="main__author" data-bg="assets/img/home/background.jpg">
        <img src={user.imageCover} width="100%" height="100%" alt="" />
      </div>
      <div className="container">
        <div className="row row--grid">
          <div className="col-12 col-xl-3">
            <div className="author author--page">
              <AuthorMeta data={user} code={account} />
            </div>
          </div>
          <div className="col-12 col-xl-9">
            {/* title */}
            <div className="main__title main__title--create">
              <h2>Create and List an item for sale</h2>
            </div>
            {/* end title */}

            {/* create form */}
            <form action="#" className="sign__form sign__form--create">
              <div className="row">
                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="type">
                      NFT Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="sign__select"
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="audio">Audio</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <label className="sign__label" htmlFor="files">
                    Upload file
                  </label>
                </div>

                {type === "audio" ? (
                  <div className="nftdropzone">
                    <NFTDropzone
                      nftType="Audio"
                      onChange={(newfile) => {
                        setFile(newfile);
                        getFile(newfile);
                      }}
                    />
                    <NFTDropzone
                      nftType="Image"
                      onChange={(newfile) => {
                        setBgFile(newfile);
                        getBgFile(newfile);
                      }}
                    />
                  </div>
                ) : type === "video" ? (
                  <div className="nftdropzone">
                    <NFTDropzone
                      nftType="Video"
                      onChange={(newfile) => {
                        setFile(newfile);
                        getFile(newfile);
                      }}
                    />
                  </div>
                ) : type === "image" ? (
                  <div className="nftdropzone">
                    <NFTDropzone
                      nftType="Image"
                      onChange={(newfile) => {
                        setFile(newfile);
                        getFile(newfile);
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className="col-12 pt-3">
                  <div className="sign__group filter__checkboxes">
                    <input
                      id="private"
                      type="checkbox"
                      name="private"
                      checked={isAttach}
                      onChange={() => {
                        setIsAttach(!isAttach);
                      }}
                    />
                    <label className="sign__label" htmlFor="private">
                      Attach a private file/unlockable content?
                    </label>
                  </div>
                </div>

                {isAttach && (
                  <div className="nftdropzone">
                    <NFTDropzone
                      nftType={"all"}
                      onChange={(newfile) => {
                        getFile(newfile, true);
                        setAttachFile(newfile);
                      }}
                    />
                  </div>
                )}

                <div className="col-12 pt-3">
                  <div className="sign__group filter__checkboxes">
                    <input
                      id="copyright"
                      type="checkbox"
                      name="copyright"
                      checked={isCopyright}
                      onChange={() => {
                        setIsCopyright(!isCopyright);
                      }}
                    />
                    <label className="sign__label" htmlFor="copyright">
                      Transfer Copyright when purchased?
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
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
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="sign__input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="originalCreator">
                      Are you the original creator of this item?
                    </label>
                    <select
                      id="originalCreator"
                      name="originalCreator"
                      className="sign__select"
                      value={originalCreator}
                      onChange={(e) => setOriginalCreator(e.target.value)}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                {
                  (originalCreator === true || originalCreator === "true") && (
                    <div>
                      <label className="sign__label">
                        As the original owner, you are eligible to collect royalties on this item's resell.
                      </label>
                      <div className="col-12 col-md-4">
                        <div className="sign__group">
                          <label className="sign__label" htmlFor="royalties">
                            Royalties
                          </label>
                          <label className="sign__label" style={{ fontStyle: "italic", fontSize: 11 }}>Set your royalty rate each time this item is resold.</label>
                          <select
                            id="royalties"
                            name="royalties"
                            className="sign__select"
                            value={royalties}
                            onChange={(e) => setRoyalties(e.target.value)}
                          >
                            <option value="0">No Royalty</option>
                            <option value="1">5%</option>
                            <option value="2">10%</option>
                            <option value="4">20%</option>
                          </select>
                        </div>
                      </div>
                    </div>

                  )}


                <div className="col-12">
                  <div className="sign__group">
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
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="collection">
                      Create or Select Collection
                    </label>
                    <select
                      id="collection"
                      name="collection"
                      className="sign__select"
                      value={collection}
                      onChange={(e) => changeCollection(e.target.value)}
                    >

                      <option value="" disabled> -- Select an Option -- </option>
                      <option value="newCollection">Create New Collection</option>
                      {collections.length && (collections
                        .map(
                          (collection, index) =>
                            <option value={collection.id} key={`option-${index}`}>{collection.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="saleType">
                      <b>Disclaimer</b><br/>
                      There will be a one time 2.5% admin fee if your item sales.
                    </label>
                  </div>
                </div>

                <div className="col-12 pt-3">
                  <div className="sign__group filter__checkboxes">
                    <input
                      id="authorVerify"
                      type="checkbox"
                      name="authorVerify"
                      checked={authorVerify}
                      onChange={() => {
                        setAuthorVerify(!authorVerify);
                      }}
                    />
                    <label className="sign__label" htmlFor="authorVerify">
                      I am the author of the copyrighted work and/or I am authorized to sell this item.
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
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
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="sign__group">
                    <div className="col-9">
                      <label className="sign__title" htmlFor="price">
                        {saleType !== "fix" ? "Starting Bid " : ""}Price - in
                        "BNB"
                      </label>
                    </div>
                    <div className="col-3">
                      <label className="sign__title" htmlFor="sale">
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
                    {/*<div className="col-3">*/}
                    {/*  <Switch*/}
                    {/*    onChange={() => {*/}
                    {/*      setIsSale(!isSale);*/}
                    {/*    }}*/}
                    {/*    checked={isSale}*/}
                    {/*    height={26}*/}
                    {/*  />*/}
                    {/*</div>*/}

                    <label className="sign__label" htmlFor="price">
                      Price in USD: ${(price * currency).toFixed(2)}
                    </label>

                    <label className="sign__label" htmlFor="price">
                      current BNB price: 1 BNB = ${currency}
                    </label>
                  </div>
                </div>
                {saleType !== "fix" && (
                  <div className="col-12">
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="length">
                        Auction Length
                      </label>
                      <select
                        id="length"
                        name="length"
                        className="sign__select"
                        value={auctionLength}
                        onChange={(e) => setAuctionLength(e.target.value)}
                      >
                        <option value="12">12 hours</option>
                        <option value="24">24 hours</option>
                        <option value="48">2 days</option>
                        <option value="72">3 days</option>
                        <option value="168">7 days</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <button
                    type="button"
                    className="col-12 col-xl-3 sign__btn"
                    onClick={createNFT}
                    disabled={isCreateProcess}
                  >
                    Create item
                  </button>
                </div>
              </div>
            </form>
            {/* end create form */}
          </div>
        </div>
      </div>
      <Modal open={showCollectionModal} onClose={hideCollectionModal}>
        <div id="modal-bid" className="zoom-anim-dialog modal modal--form">
          <button className="modal__close" type="button" onClick={hideCollectionModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/>
            </svg>
          </button>

          <h4 className="sign__title">Create a Collection</h4>

          <div className="sign__group sign__group--row">
            <label className="sign__label" htmlFor="collectionName">Name</label>
            <input id="collectionName" type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="sign__input"/>
            <label className="sign__label">Collection Image</label>
            <NFTDropzone
              nftType="Image"
              onChange={(newfile) => {
                setCollectionImage(newfile);
                getCollectionImage(newfile);
              }}
            />
            <label className="sign__label">Cover Image</label>
            <NFTDropzone
              nftType="Image"
              onChange={(newfile) => {
                setCoverImage(newfile);
                getCoverImage(newfile);
              }}
            />
          </div>

          <button className="sign__btn" onClick={createCollection} disabled={isCreateProcess} type="button">Create Collection</button>
        </div>
      </Modal>
    </main>
  );
}
export default Create;
