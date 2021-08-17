import React, { useEffect, useState } from "react";
import BreadCrumb from "components/BreadCrumb";
import AssetItem from "components/AssetItem";
import AssetAuthor from "components/AssetAuthor";
import { useWeb3React } from "@web3-react/core";
import Tabs from "./Tabs";
import Card from "components/Card";
import Countdown from "react-countdown";
import "styles/activity.css";
import "./style.css";
import { firestore } from "../../firebase";
import Axios from "axios";
import axios from "axios";

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import {useHistory} from "react-router-dom";

const breadcrumb = [
  { title: "Home", page: "/" },
  { title: "Creator", page: "/creator" },
  { title: "Item", page: "/item" },
];
const author = {
  creatorAvatar: "/assets/img/avatars/avatar5.jpg",
  authorName: "@midinh",
  collectionAvatar: "/assets/img/avatars/avatar9.jpg",
  collectionTitle: "The Meta Key",
};
const historyData = [
  {
    avatar: "/assets/img/avatars/avatar.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
];
const bidsData = [
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
  {
    avatar: "/assets/img/avatars/avatar10.jpg",
    bnbPrice: 11.0,
    timeAgo: 4,
    nickName: "@erikkk",
    verified: true,
  },
];

const assetCards = [
  {
    type: "image",
    image: "assets/img/cover/cover1.jpg",
    time: "2021-08-07T01:02:03",
    title: "Walking on Air",
    avatar: "/assets/img/avatars/avatar5.jpg",
    nickName: "@nickname",
    currentPrice: 4.89,
    verified: true,
    likes: 189,
  },
  {
    type: "image",
    image: "assets/img/cover/cover2.jpg",
    time: "2021-08-07T01:02:03",
    title: "Les Immortels, the Treachery of Artificial Shadows",
    avatar: "/assets/img/avatars/avatar3.jpg",
    nickName: "@neo",
    currentPrice: 2.61,
    verified: false,
    likes: 702,
  },
  {
    type: "audio",
    image: "assets/img/cover/cover3.jpg",
    audio: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3",
    time: "2021-08-07T01:02:03",
    title: "Flowers in Concrete (Modal)",
    avatar: "/assets/img/avatars/avatar15.jpg",
    nickName: "@min1max",
    currentPrice: 3.19,
    verified: true,
    likes: 37,
  },
  {
    type: "video",
    image: "assets/img/cover/cover3.jpg",
    video:
      "https://storage.opensea.io/files/b160bf7e9e9c391b974b634808a65382.mp4",
    time: "2021-08-07T01:02:03",
    title: "Flowers in Concrete (Modal)",
    avatar: "/assets/img/avatars/avatar15.jpg",
    nickName: "@min1max",
    currentPrice: 3.19,
    verified: true,
    likes: 37,
  },
  {
    type: "audio",
    image: "assets/img/cover/cover3.jpg",
    audio: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3",
    time: "2021-08-07T01:02:03",
    title: "Flowers in Concrete (Modal)",
    avatar: "/assets/img/avatars/avatar15.jpg",
    nickName: "@min1max",
    currentPrice: 3.19,
    verified: true,
    likes: 37,
  },
  {
    type: "video",
    image: "assets/img/cover/cover3.jpg",
    video:
      "https://storage.opensea.io/files/b160bf7e9e9c391b974b634808a65382.mp4",
    time: "2021-08-07T01:02:03",
    title: "Flowers in Concrete (Modal)",
    avatar: "/assets/img/avatars/avatar15.jpg",
    nickName: "@min1max",
    currentPrice: 3.19,
    verified: false,
    likes: 37,
  },
];
function Item(props) {
  const { id } = props.match.params;
  const [price, setPrice] = useState(0);
  const [item, setItem] = useState({});
  const startingBid = 2;
  const bnbRate = localStorage.getItem('currency');
  const [isProcessing, setIsProcessing] = useState(false)
  const [collection, setCollection] = useState({});
  const [detail, setDetail] = useState(
    [{
      avatar: "/assets/img/avatars/avatar5.jpg",
      authorName: "@midinh",
      createdYear: 2021,
    }]
  );
  const { library, active, account } = useWeb3React();

  const [assetCards, setAssetCards] = useState([]);
  const history = useHistory();

  const getData = async () => {
    let nft_item = (
      await firestore.collection("nfts").doc(id).get()
    ).data();
    const nft_info = (await axios.get(nft_item.tokenURI)).data;
    const owner_info = (await firestore.collection("users").doc(nft_item.ownerId).get()).data()
    console.log(nft_item, nft_info, owner_info)
    setItem({...nft_item, ...nft_info, ...owner_info})

    setDetail([{
      avatar: owner_info.avatar,
      authorName: owner_info.nickName,
      createdYear: owner_info.createdAt.toDate().getFullYear()
    }]);
    // const collectionData = (await firestore.collection("collections").doc(item.collection).get()).data();
    // console.log('collectionData', collectionData);
    // setCollection(collectionData);
  }

  const getNTFLists = async () => {
    const nfts = await firestore.collection("nfts").get();
    let user_nfts = [];
    let nfts_list = [];
    for (let i = 0; i < nfts.docs.length; i++) {
      const x = nfts.docs[i];
      const temp = x.data();
      const tt = (await axios.get(temp.tokenURI)).data;
      if (!user_nfts[temp.creatorId]) user_nfts[temp.creatorId] = [];
      const ite = { id: x.id, ...temp, ...tt };
      user_nfts[temp.creatorId].push(ite);
      nfts_list.push(ite);
    }
    setAssetCards(nfts_list);
  }

  const buyItem = () => {
    console.log('active', active);
    if (!active) {
      history.push("/connect-wallet");
      return;
    }
  }

  const bidItem = () => {
    console.log('active', active);
    if (!active) {
      history.push("/connect-wallet");
      return;
    }
  }

  useEffect(() => {
    getNTFLists();
    if (id === 'image') {
      setItem({
        auctionLength: 0,
        creator: account,
        creatorId: "snyMGafOsISG5s86ZJBQZfCq6xq1",
        isSale: true,
        likes: 0,
        owner: account,
        ownerId: "snyMGafOsISG5s86ZJBQZfCq6xq1",
        price: "0.03",
        saleType: "fix",
        tokenId: 0,
        tokenURI: null,
        category: "art",
        image: "/assets/img/cover/cover3.jpg",
        imageAttach: null,
        imageBg: "/assets/img/cover/cover3.jpg",
        name: 'Sample Image',
        description: 'Sample Image Description',
        royalties: 5,
        type: "image",
        avatar: "/assets/img/avatars/avatar.jpg",
        bio: "This is the Bio",
        email: "email.sample@gmail.com",
        firstName: "User",
        lastName: "",
        nickName: "@nickname"
      })
    } else if (id === 'audio') {
      setItem({
        auctionLength: 0,
        creator: account,
        creatorId: "snyMGafOsISG5s86ZJBQZfCq6xq1",
        isSale: true,
        likes: 0,
        owner: account,
        ownerId: "snyMGafOsISG5s86ZJBQZfCq6xq1",
        price: "0.03",
        saleType: "fix",
        tokenId: 0,
        tokenURI: null,
        category: "art",
        image: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3",
        imageAttach: null,
        imageBg: "/assets/img/cover/cover3.jpg",
        name: 'Sample Audio',
        description: 'Sample Audio Description',
        royalties: 5,
        type: "audio",
        avatar: "/assets/img/avatars/avatar.jpg",
        bio: "This is the Bio",
        email: "email.sample@gmail.com",
        firstName: "User",
        lastName: "",
        nickName: "@nickname"
      })
      
    } else if (id === 'video') {
      
    } else {
      getData()
    }
  }, [id])
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    return (
      <div style={{textAlign: 'center', color:'white', marginTop:10, fontSize:18}}>
        {days < 1 ? "" : days + " Days"} {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
    );
  }
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* <!-- breadcrumb --> */}
          <BreadCrumb data={breadcrumb} />
          {/* <!-- end breadcrumb --> */}

          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>{item.name}</h1>
            </div>
          </div>
        </div>

        <div className="row">
          {/* <!-- content --> */}
          <div className="col-12 col-xl-8">
            <AssetItem data={item} isCss={true} />
          </div>
          {/* <!-- end content --> */}

          {/* <!-- sidebar --> */}
          <div className="col-12 col-xl-4">
            <div className="asset__info">
              <div className="asset__desc">
                <h2>Description</h2>
                <p>
                  {item.description}
                </p>
              </div>

              <AssetAuthor data={item.id} />

              {/* <!-- tabs --> */}
              <Tabs
                historyData={historyData}
                bidsData={bidsData}
                detail={detail}
              />
              {/* <!-- end tabs --> */}

              <div className="asset__wrap">
                <div className="asset__timer">
                  {(item.saleType === 'auction' || item.saleType === 'auctionBuy') &&
                    <div>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M18.3,8.59l.91-.9a1,1,0,0,0-1.42-1.42l-.9.91a8,8,0,0,0-9.79,0l-.91-.92A1,1,0,0,0,4.77,7.69l.92.91A7.92,7.92,0,0,0,4,13.5,8,8,0,1,0,18.3,8.59ZM12,19.5a6,6,0,1,1,6-6A6,6,0,0,1,12,19.5Zm-2-15h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2Zm3,6a1,1,0,0,0-2,0v1.89a1.5,1.5,0,1,0,2,0Z" />
                        </svg>{" "}
                        Auction ends in
                      </span>
                      <div className="card__clock">
                        <Countdown date={item.time} renderer={renderer}/>
                      </div>
                    </div>
                  }
                </div>

                <div className="asset__price">
                  <span>Minimum bid</span>
                  <span>
                    {item.price} BNB <br />
                    (${parseFloat(item.price) * bnbRate} USD)
                  </span>
                </div>
              </div>

              {/* <!-- actions --> */}
              {item.isSale &&
                <div className="asset__btns">
                  {item.saleType === "fix" ?
                    <button
                      disabled={isProcessing || item.owner === account}
                      className="asset__btn asset__btn--full asset__btn--clr"
                      onClick={buyItem}
                    >
                      {isProcessing ? 'Waiting...' : 'Buy'}
                    </button> :
                    <button
                      disabled={isProcessing}
                      className="asset__btn asset__btn--full asset__btn--clr"
                      onClick={bidItem}
                    >
                      {isProcessing ? 'Waiting...' : 'Place a bid'}
                    </button>
                  }
                </div>
              }
              {/* <!-- end actions --> */}
            </div>
          </div>
          {/* <!-- end sidebar --> */}
        </div>

        {/* <!-- explore --> */}
        <section className="row row--grid">
          {/* <!-- title --> */}
          <div className="col-12">
            <div className="main__title main__title--border-top">
              <h2>
                <a href="/explore">You May Also Like</a>
              </h2>
            </div>
          </div>
          {/* <!-- end title --> */}

          {/* <!-- carousel --> */}
          <div className="col-12">
            {
              assetCards.length > 0 && (
                <OwlCarousel className='owl-theme' loop margin={10} nav dots={false} items={4} navText={['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>']}>

                  {assetCards.map((card, index) => (
                    <Card data={card} key={`explore-${index}`} />
                  ))}

                </OwlCarousel>
              )
            }


          </div>
          {/* <!-- end carousel --> */}
        </section>
        {/* <!-- end explore --> */}
      </div>
      <div
        id="modal-bid"
        className="zoom-anim-dialog mfp-hide modal modal--form"
      >
        <button className="modal__close" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
          </svg>
        </button>
        <h4 className="sign__title">Place a bid</h4>
        <div className="sign__group sign__group--row">
          <label className="sign__label" htmlFor="placebid">
            Your Highest bid
          </label>
          <input
            id="placebid"
            type="number"
            value={price}
            placeholder="Place your highest bid in BNB."
            className="sign__input"
            onChange={(e) => setPrice(e.target.value)}
          />
          <span className="sign__text sign__text--small">
            Price in USD : {price * bnbRate}
          </span>
          <span className="sign__text sign__text--small">
            Starting Bid : {startingBid}
          </span>
        </div>
        <button className="sign__btn" type="button">
          Take a bid
        </button>
      </div>
    </main>
  );
}

export default Item;
