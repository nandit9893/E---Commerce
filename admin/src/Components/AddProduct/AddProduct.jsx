import React, { useState } from "react";
import "./AddProduct.css";
import axios from "axios";
import upload_area from "../../assets/upload_area.svg";
import { toast } from "react-toastify";
const AddProduct = () => {
  const url = "https://stylo-clothes-back-end.onrender.com";
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "women",
    image: "",
  });
  const imageHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    const newURL = `${url}/shopper/products/add/product`
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("old_price", data.old_price);
      formData.append("new_price", data.new_price);
      formData.append("category", data.category);
      if (image) {
        formData.append("image", image);
      }
      const response = await axios.post(newURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success("Product Added Successfully");
        setImage(false);
      } else {
        toast.error("Errow while saving the product");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input type="text" name="name" placeholder="Type here" onChange={handleInputChange} value={data.name} />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="text" name="old_price" placeholder="Type here" onChange={handleInputChange} value={data.old_price} />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input type="text" name="new_price" placeholder="Type here" onChange={handleInputChange} value={data.new_price} />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select name="category" className="add-product-selector" onChange={handleInputChange} value={data.category}>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-item-field">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className="addproduct-thumbnail-img" />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
      </div>
      <button onClick={saveProduct} className="addproduct-btn">ADD</button>
    </div>
  );
};

export default AddProduct;
