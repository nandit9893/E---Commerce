import React, { useContext, useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../../Components/Item/Item";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
const NewCollections = () => {
  const { url } = useContext(AppContext);
  const [ new_collections, set_new_collections ] = useState([]);

  const getNewCollectionsData = async () => {
    const newURL = `${url}/shopper/products/get/new/collection`;
    try {
      const response = await axios.get(newURL);
      if(response.data.success) {
        set_new_collections(response.data.data);
      } 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNewCollectionsData();
  }, []);

  return (
    <div className="new-collections">
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
            {
                new_collections.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })
            }
        </div>
    </div>
  )
}

export default NewCollections