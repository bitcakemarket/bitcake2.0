import React, {useEffect, useState} from "react";
import AuthorMeta from "../../components/AuthorMeta";
import Card from "../../components/Card";
import Paginator from "../../components/Paginator";
import Collection from "../../components/Collection";
import "styles/collection.css";
import {auth, firestore} from "../../firebase";
import {useHistory, useParams} from "react-router-dom";
import {useWeb3React} from "@web3-react/core";
import Axios from "axios";

function CollectionPage() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const history = useHistory();
  const { account } = useWeb3React();
  const [cards, setCards] = useState([]);
  const [collection, setCollection] = useState({});
  const getProfile = async () => {
    let currentCollection = (
      await firestore.collection("collections").doc(id).get()
    ).data();
    setCollection(currentCollection);
    let user = await firestore.collection("users").doc(currentCollection.creatorId).get();
    let userProfile = user.data();
    const temp = { id: user.id, ...userProfile };
    setUser(temp);
  };

  const getCards = async () => {
    const res = await firestore.collection("nfts").get()
    let lists = []
    for (let i = 0; i < res.docs.length; i++)
    {
      let doc = res.docs[i].data();
      const nftInfo = await Axios.get(doc.tokenURI);
      if (doc.collection === id) {
        lists.push({ id: res.docs[i].id, ...user, ...doc, ...nftInfo.data })
      }
    }
    setCards(lists);
  }

  useEffect(async () => {
    await getCards();
    auth.onAuthStateChanged((user) => {
      if (user) {
        getProfile();
      } else {
        history.push("/signin");
      }
    });

  }, [account])
  return (
    <main className="main">
      <div className="main__author" data-bg="assets/img/home/bg.gif">
        <img src={user.imageCover} width="100%" height="100%" alt="" />
      </div>
      <div className="container">
        <div className="row row--grid">
          {/*<div className="col-12 col-xl-3">*/}
          {/*  <div className="author author--page">*/}
          {/*    <AuthorMeta data={user} code={account}  />*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="col-12 col-xl-12">
            <div className="main__title">
              <h2>{collection.name}</h2>
            </div>
            <div className="row row--grid">
              {cards.map((card, index) => (
                index < 4 && (
                <div className="col-12 col-sm-6 col-lg-3" key={`card-${index}`}>
                  <Card data={card} />
                </div>
                )
              ))}
            </div>
            <div className="row row--grid collapse" id="collapsemore">
              {cards.map(
                (card, index) =>
                  index >= 6 && (
                    <div
                      className="col-12 col-sm-6 col-lg-4"
                      key={`card-${index}`}
                    >
                      <Card data={card} />
                    </div>
                  )
              )}
            </div>
            <div className="row row--grid">
              <div className="col-12">
                <button
                  className="main__load"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapsemore"
                  aria-expanded="false"
                  aria-controls="collapsemore"
                >
                  Load more
                </button>
              </div>
            </div>
          </div>
          {/* collapse */}


        </div>

      </div>
    </main>
  );
}
export default CollectionPage;
