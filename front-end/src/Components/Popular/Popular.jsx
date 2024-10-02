import React, { useContext, useEffect, useState } from "react";
import "./Popular.css";
import Item from "../../Components/Item/Item";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
const Popular = () => {
  const { url } = useContext(AppContext);
  const [ data_product, set_data_product ] = useState([])

  const popularInWomen = async (req, res) => {
    const newURL = `${url}/shopper/products/get/popular/women`;
    try {
      const response = await axios.get(newURL);
      if(response.data.success) {
        set_data_product(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    popularInWomen();
  }, []);

  return (
    <div className="popular">
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className="popular-item">
            {
                data_product.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })
            }
        </div>
    </div>
  )
}

export default Popular