import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import axios from "axios";
import { toast } from "react-toastify";
import cross_icon from "../../assets/cross_icon.png";
const ListProduct = () => {
  const url = "http://localhost:8000";
  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts = async () => {
    const newURL = `${url}/shopper/products/get/all`;
    try {
      const response = await axios.get(newURL);
      if (response.data.success) {
        setAllProducts(response.data.data);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const deleteProduct = async (id) => {
    const newURL = `${url}/shopper/products/delete/product`;
    try {
      const response = await axios.post(newURL, { id });
      if(response.data.success) {
        toast.success("Product removed successfully");
        setAllProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } else {
        toast.error("Error while removing product");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
        await getAllProducts();
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {
          allProducts.map((product) => {
            return (
            <div key={product._id} className="listproduct-format-main listproduct-format">
              <img className="listproduct-product-icon" src={product.image} alt="" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={() => deleteProduct(product.id)} className="listproduct-remove-icon" src={cross_icon} alt="Remove product"/>
              <hr />
            </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default ListProduct;
