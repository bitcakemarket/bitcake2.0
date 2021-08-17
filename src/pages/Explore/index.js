import React, {useState, useEffect} from "react";
import BreadCrumb from "../../components/BreadCrumb";
import Card from "../../components/Card";
import { BsSearch } from "react-icons/bs";
import { FaTimesCircle } from "react-icons/fa";
import Paginator from "../../components/Paginator";
import Axios from "axios";
import { firestore } from "../../firebase";
import "styles/explore.css";

const breadCrumb = [
	{title:"Home",page:'/'},
	{title:"Explorer",page:"/explorer"},
];
const tabs=[
  {href:"#tab-1",control:"tab-1", title:"Info"},
  {href:"#tab-2",control:"tab-2", title:"Owners"},
  {href:"#tab-3",control:"tab-3", title:"Bids"},
  {href:"#tab-4",control:"tab-4", title:"Comments(12)"},
  {href:"#tab-5",control:"tab-5", title:"History"},
];
function Explore() {
  const [price, setPrice] = useState(1);
  const [tab, setTab] = useState('tab-1');
  const [cards, setCards] = useState([]);
  const [filterData, setFilter] = useState(cards);
  const [age, setAge] = useState('Newest');
  const [like, setLike] = useState('MostLiked');
  const [creator, setCreator] = useState('VerifiedOnly');

  const getNFTList = async () => {
    const res = await firestore.collection("nfts").get()
    let lists = []
    for (let i = 0; i < res.docs.length; i++)
    {
      let doc = res.docs[i].data()
      const nftInfo = await Axios.get(doc.tokenURI);
      const user = await firestore.collection("users").doc(doc.creatorId).get();
      lists.push({ id: res.docs[i].id, ...user.data(), ...doc, ...nftInfo.data })
    }
    setCards(lists)
    setFilter(lists);
  }

  useEffect(() => {
    getNFTList()
  }, [])
  
  const sliderChange = (e) => {
    setPrice(e.target.value);
  }

  const handleSearch = (e) => {
    let input = e.target.value.toLowerCase();
    let filter = [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].name.toLowerCase().includes(input) || cards[i].nickName.toLowerCase().includes(input) || cards[i].price.toString().includes(input)) {
        filter.push(cards[i]);
      }
    }
    setFilter(filter);
  }
  const handleSelect = (e) => {
    switch(parseInt(e.target.value)) {
      case 1:
        setAge('Newest');
        break;
      case 2:
        setAge('Oldest');
        break;
      case 3:
        setLike('MostLiked');
        break;
      case 4:
        console.log('LeastLiked');
        setLike('LeastLiked');
        break;
      case 5:
        setCreator('VerifiedOnly');
        break;
      case 6:
        setCreator('All');
        break;
      default: break;
    }
  }
  const handleReset = () => {
    console.log("reset");
    console.log('age', age);
    console.log('price', price);
    console.log('like', like);
    console.log('creator', creator);
    var tempCards = cards;
    let filterCards = [];
    // tempCards.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
    let maxLikeValue = Math.max.apply(Math, cards.map(function(card) { return card.likes.length; }))
    let minLikeValue = Math.min.apply(Math, cards.map(function(card) { return card.likes.length; }))
    for (let i = 0; i < cards.length; i++) {
      if (parseFloat(cards[i].price) >= 0 && parseFloat(cards[i].price) <= price) {
        if (like === "MostLiked") {
          if (cards[i].likes.length === maxLikeValue) {
            console.log('cards', cards[i]);
            filterCards.push(cards[i]);
          }
        } else if (like === "LeastLiked") {
          if (cards[i].likes.length === minLikeValue) {
            filterCards.push(cards[i]);
          }
        }
      }
    }
    if (age === "Newest") {
      filterCards.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1)
    } else if (age === "Oldest") {
      filterCards.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
    }
    console.log('filterCards', filterCards);
    setFilter(filterCards);
  }
  return (
		<main className="main">
				<div className="container">
					<div className="row row--grid">
						<BreadCrumb data={breadCrumb}/>
						<div className="col-12">
							<div className="main__title main__title--page nft-border-bottom pb-3">
								<h2>Type your keywords</h2>
                <div className="search-outline d-flex justify-content-center align-items-center">
                  <input type="text" placeholder="Search..." className="search-input" onChange={(e)=>handleSearch(e)}/>
                  <button className="email-btn">
                    <BsSearch />
                  </button>
                </div>
							</div>
						</div>
            
					</div>
          <div className="row row--grid"> 
            <div className="col-12 col-xl-3">
              <div className="sign__group">
                <select
                  name="subcategory"
                  className="sign__select"
                  onChange={(e)=>handleSelect(e)}
                >
                  <option value="1">Oldest</option>
                  <option value="2">Newest</option>
                </select>
              </div>
              <div className="slidecontainer mt-3">
                <label className="sign__label" htmlFor="subcategory">
                  PRICE RANGE  <span style={{fontSize:'20px', color:'white'}}>{price} </span> BNB
                </label>
                <input type="range" min="1" max="10000" className="slider" id="myRange" onChange={(e)=>sliderChange(e)}/>
                <div className="d-flex justify-content-between">
                  <p className="nft-color-white">1 BNB</p>
                  <p className="nft-color-white">10000BNB</p>
                </div>
              </div>
              <div className="sign__group">
                <label className="sign__label" htmlFor="subcategory">
                Likes
                </label>
                <select
                  name="subcategory"
                  className="explore__select"
                  onChange={(e)=>handleSelect(e)}
                >
                  <option value="3">Most liked</option>
                  <option value="4">Least liked</option>
                </select>
              </div>

              <div className="sign__group">
               <label className="sign__label" htmlFor="subcategory">
                CREATOR
               </label>
                <select
                  name="subcategory"
                  className="explore__select"
                  onChange={(e)=>handleSelect(e)}
                >
                  <option value="5">Verified only</option>
                  <option value="6">All</option>
                </select>
              </div>
              <a onClick={()=>handleReset()} className="nft-pointer">
                <p className="reset m-0">
                  <FaTimesCircle className="mr-2" />
                  Reset filter
                </p>
              </a>
            </div>

            <div className="col-12 col-xl-9">
              <div className="row row--grid">
                {filterData.map((card,index)=>(
                  <div className="col-12 col-sm-6 col-lg-4"  key={`card-${index}`}>
                    <Card data={card} />
                  </div>
                ))}
              </div>
            </div>
          </div>

					{/* <!-- paginator --> */}
						<Paginator />
					{/* <!-- end paginator --> */}
				</div>
			</main>
  );
}

export default Explore;
