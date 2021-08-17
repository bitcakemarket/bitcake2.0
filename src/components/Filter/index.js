import React, {useState} from "react";
import "./style.css";
function Filter(props) {
  const [listings, setListings] = useState(true);
  const [purchases, setPurchases] = useState(true);
  const [transfers, setTransfers] = useState(true);
  const [bids, setBids] = useState(true);
  const [likes, setLikes] = useState(true);
  const [followings, setFollowings] = useState(true);

  const changeFilters = (filter) => {
    let filters = {
      listings: listings,
      purchases: purchases,
      transfers: transfers,
      bids: bids,
      likes: likes,
      followings: followings,
    }
    switch (filter) {
      case "listings":
        filters[filter] = !listings;
        setListings(!listings);
        break;
      case "purchases":
        filters[filter] = !purchases;
        setPurchases(!purchases);
        break;
      case "transfers":
        filters[filter] = !transfers;
        setTransfers(!transfers);
        break;
      case "bids":
        filters[filter] = !bids;
        setBids(!bids);
        break;
      case "likes":
        filters[filter] = !likes;
        setLikes(!likes);
        break;
      case "followings":
        filters[filter] = !followings;
        setFollowings(!followings);
        break;
      default:
        break;
    }

    props.onChangeFilter(filters);

  }
  return(
    <div className="filter filter--sticky">
      <h4 className="filter__title">Filters <button type="button">Clear all</button></h4>

      <div className="filter__group">
        <ul className="filter__checkboxes">
          <li>
            <input id="listingFilter" type="checkbox" name="listingFilter" checked={listings}
                   onChange={(e) => changeFilters("listings")}/>
            <label htmlFor="listingFilter">Listings</label>
          </li>
          <li>
            <input id="purchasesFilter" type="checkbox" name="purchasesFilter" checked={purchases}
                   onChange={(e) => changeFilters("purchases")}/>
            <label htmlFor="purchasesFilter">Purchases</label>
          </li>
          <li>
            <input id="transfersFilter" type="checkbox" name="transfersFilter" checked={transfers}
                   onChange={(e) => changeFilters("transfers")}/>
            <label htmlFor="transfersFilter">Transfers</label>
          </li>
          <li>
            <input id="bidsFilter" type="checkbox" name="bidsFilter" checked={bids}
                   onChange={(e) => changeFilters("bids")}/>
            <label htmlFor="bidsFilter">Bids</label>
          </li>
          <li>
            <input id="likesFilter" type="checkbox" name="likesFilter" checked={likes}
                   onChange={(e) => changeFilters("likes")}/>
            <label htmlFor="likesFilter">Likes</label>
          </li>
          <li>
            <input id="followingsFilter" type="checkbox" name="followingsFilter" checked={followings}
                   onChange={(e) => changeFilters("followings")}/>
            <label htmlFor="followingsFilter">Followings</label>
          </li>
        </ul>
      </div>
    </div>
    );
  }
  export default Filter;