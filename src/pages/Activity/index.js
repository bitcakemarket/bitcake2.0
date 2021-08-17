import React, {useEffect, useState} from "react";
import BreadCrumb from "../../components/BreadCrumb";
import Filter from "../../components/Filter";
import Activity from "../../components/Activity";
import {auth, firestore} from "../../firebase";
import {useHistory} from "react-router-dom";
const breadcrumb = [
	{title:"Home", page:'/'},
	{title:"Activity", page:"/activity"},
];
// const activityData=[
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"list", nickName:"@Nickname", bnbPrice:0.049, timeAgo:4},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"purchase", nickName:"@johndoe",bnbPrice:0.011, timeAgo:21},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"transfer", fromName:"@johndoe", toName:"@Nickname", timeAgo:21},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"offer",nickName:"@johndoe", bnbPrice:0.011, timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"like",nickName:"@johndoe", timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"start",nickName:"@johndoe", timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"list", nickName:"@Nickname", bnbPrice:0.049, timeAgo:4},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"purchase", nickName:"@johndoe",bnbPrice:0.011, timeAgo:21},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"transfer", fromName:"@johndoe", toName:"@Nickname", timeAgo:21},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"offer",nickName:"@johndoe", bnbPrice:0.011, timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"like",nickName:"@johndoe", timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"start",nickName:"@johndoe", timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"transfer", fromName:"@johndoe", toName:"@Nickname", timeAgo:21},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"offer",nickName:"@johndoe", bnbPrice:0.011, timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"like",nickName:"@johndoe", timeAgo:23},
//   {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"start",nickName:"@johndoe", timeAgo:23}
// ];
function ActivityPage() {
  const [activityData, setActivityData] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  const getActivities = async () => {
    let allActivities = await firestore.collection('activities').get();

    let activities = [];
    for (let i = 0; i < allActivities.docs.length; i++) {
      let doc = allActivities.docs[i].data();
      doc.id = allActivities.docs[i].id;
      let currentDate = new Date();
      let docDate = doc.createdAt.toDate();
      let timeDifference = currentDate.getTime() - docDate.getTime();
      let daysAgo = Math.floor(timeDifference / (24 * 3600 * 1000));
      let hoursAgo = Math.floor((timeDifference % (24 * 3600 * 1000)) / (3600 * 1000));
      let minutesAgo = Math.floor(((timeDifference % (24 * 3600 * 1000)) % (3600 * 1000)) / (60 * 1000));

      let timeAgo = daysAgo > 0 ? daysAgo + " Days " : "";
      timeAgo += hoursAgo > 0 ? hoursAgo + " Hours " : "";
      timeAgo += minutesAgo > 0 ? minutesAgo + " Minutes " : "";
      timeAgo = timeAgo ? timeAgo + "Ago" : timeAgo;
      doc.timeAgo = timeAgo;
      activities.push(doc);
    }
    setActivityData(activities);
    setFilteredActivities(activities);
  }

  const changeFilter = (filters) => {
    let tempFilters = [];

    for (let i = 0; i < activityData.length; i++) {
      if (activityData[i].method === 'start' && filters.followings === true) {
        tempFilters.push(activityData[i]);
      }
      if (activityData[i].method === 'list' && filters.listings === true) {
        tempFilters.push(activityData[i]);
      }
      if (activityData[i].method === 'transfer' && filters.transfers === true) {
        tempFilters.push(activityData[i]);
      }
      if (activityData[i].method === 'offer' && filters.bids === true) {
        tempFilters.push(activityData[i]);
      }
      if (activityData[i].method === 'purchase' && filters.purchases === true) {
        tempFilters.push(activityData[i]);
      }
      if (activityData[i].method === 'like' && filters.likes === true) {
        tempFilters.push(activityData[i]);
      }
    }

    setFilteredActivities(tempFilters);
  }
  useEffect(() => {
    getActivities();
  }, [])
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          <BreadCrumb data={breadcrumb}/>

          {/* <!-- title --> */}
          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>Activity</h1>
            </div>
          </div>
          {/* <!-- end title --> */}
        </div>

        <div className="row">
          <div className="col-12 col-xl-3 order-xl-2">
            <div className="filter-wrap">
              <button className="filter-wrap__btn" type="button" data-toggle="collapse" data-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">Open filter</button>
              <div className="collapse filter-wrap__content" id="collapseFilter">
                <Filter onChangeFilter={changeFilter}/>
              </div>
            </div>
          </div>

          {/* <!-- content --> */}
          <div className="col-12 col-xl-9 order-xl-1">
            <div className="row row--grid">
              {filteredActivities.map((activity,index)=>(
                index < 8 &&
                <div className="col-12 col-lg-6" key={`activity-${index}`}>
                  <Activity data={activity}/>
                </div>           
              ))}           
            </div>
            <div className="row row--grid collapse" id="collapsemore">
              {filteredActivities.map((activity,index)=>(
              index >= 8 &&
                <div className="col-12 col-lg-6"  key={`activity${index}`}>
                  <Activity data={activity}/>
                </div>
              ))}  
            </div>      

            <div className="row row--grid">
              <div className="col-12">
                <button className="main__load" type="button" data-toggle="collapse" data-target="#collapsemore" aria-expanded="false" aria-controls="collapsemore">Load more</button>
              </div>
            </div>
          </div>
        </div>	
      </div>
    </main>
  );
}

export default ActivityPage;
