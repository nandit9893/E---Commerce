import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AppContext = createContext();
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};
const AppContextProvider = ({ children }) => {
  const url = "https://stylo-clothes-back-end.onrender.com";
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [all_product, set_all_product] = useState([]);


  useEffect(() => {
    getAllProductFromDatabase();
    if (localStorage.getItem("accessToken")) {
      gettingUserCartData();
    }
  }, []);


  const gettingUserCartData = async () => {
    const newURL = `${url}/shopper/users/getting/user/cart/data`;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(newURL,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if(response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("accessToken")) {
      const newURL = `${url}/shopper/users/adding/cart/data`;
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          newURL,
          { itemId: itemId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("accessToken")) {
      const newURL = `${url}/shopper/users/removing/cart/data`;
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          newURL,
          { itemId: itemId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if(response.data.success) {

        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItems += cartItems[item];
      }
    }
    return totalItems;
  };

  const getAllProductFromDatabase = async () => {
    const newURL = `${url}/shopper/products/get/all`;
    try {
      const response = await axios.get(newURL);
      if (response.data.success) {
        set_all_product(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextValues = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    url,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
export default AppContextProvider;
