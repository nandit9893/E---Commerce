import Product from "../models/product.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const validCategories = ["men", "women", "kid"];

const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const { name, category, new_price, old_price, available } = req.body;
    const imageLocalPath = req.file?.path;
    if (!name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    if (!pricePattern.test(new_price)) {
      return res.status(400).json({
        success: false,
        message: "New Price should only contain digits",
      });
    }
    if (!pricePattern.test(old_price)) {
      return res.status(400).json({
        success: false,
        message: "Old Price should only contain digits",
      });
    }

    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "A product with this ID already exists",
      });
    }

    let imageLocalPathURL = "";
    if (imageLocalPath) {
      imageLocalPathURL = await uploadOnCloudinary(imageLocalPath);
      if (!imageLocalPathURL) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    const newProduct = new Product({
      id: id,
      name,
      category,
      new_price: Number(new_price),
      old_price: Number(old_price),
      available,
      image: imageLocalPathURL.url,
    });

    await newProduct.save();
    return res.status(200).json({
      success: true,
      message: "Product uploaded successfully",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findOneAndDelete({ id: id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (product.image) {
      const deletionResult = await deleteFromCloudinary(product.image);
      if (!deletionResult) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete image from Cloudinary",
        });
      }
    }
    await Product.findOneAndDelete({ id });
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    if (allProducts.length === 0) {
      return res.status(204).json({
        success: false,
        message: "Product collection is empty",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All products",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching all products",
      error: error.message,
    });
  }
};

const getNewCollections = async (req, res) => {
  const products = await Product.find({});
  const getNewCollections = products.slice(1).slice(-8);
  return res.status(200).json({
    success: true,
    data: getNewCollections,
    message: "New collections fetched successfully",
  });
}

const popularInWomen = async (req, res) => {
  const products = await Product.find({category: "women"});
  const popular_in_women = await products.slice(0, 4);
  return res.status(200).json({
    success: true,
    data: popular_in_women,
    message: "Fetched successfully",
  });
}

export { addProduct, deleteProduct, getAllProducts, getNewCollections, popularInWomen };