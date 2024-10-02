import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelativeProduct from "../Components/RelatedProduct/RelatedProduct";
const Product = () => {
  const { all_product } = useContext(AppContext);
  const { productId } = useParams();
  const product = all_product.find((e) => e.id === Number(productId));
  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product}/>
      <DescriptionBox />
      <RelativeProduct/>
    </div>
  )
}

export default Product