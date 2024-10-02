import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }
  if (!password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }
  try {
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const user = await User.create({
      email,
      name,
      password,
      cartData: cart,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return res.status(404).json({
        success: false,
        message:
          "Some thing went wrong while registering please try again later",
      });
    }
    return res.status(201).json({
      success: true,
      data: createdUser,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while registering user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging in",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: "",
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while logging out"));
  }
};

const addingCartData = async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(401).json({
      success: false,
      message: "Item id is required",
    });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const cart = user.cartData;
    if (cart[itemId] !== undefined) {
      cart[itemId] += 1;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid item id",
      });
    }
    user.markModified("cartData");
    await user.save();

    res.status(200).json({
      success: true,
      message: `Cart updated successfully for item ${itemId}`,
      cartData: user.cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the cart",
      error: error.message,
    });
  }
};

const removeCartData = async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(401).json({
      success: false,
      message: "Item id is required",
    });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const cart = user.cartData;
    if (cart[itemId] !== undefined) {
      if (cart[itemId] > 0) {
        cart[itemId] -= 1;
      } else {
        cart[itemId] = 0;
      }
    }
    user.markModified("cartData");
    await user.save();
    res.status(200).json({
      success: true,
      message: `Cart updated successfully, removed one unit of item ${itemId}`,
      cartData: user.cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the cart",
      error: error.message,
    });
  }
};

const gettingUserCartData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const userCartData = user.cartData;

    res.status(200).json({
      success: true,
      message: "Cart data fetched successfully",
      data: userCartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the cart data",
      error: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  addingCartData,
  removeCartData,
  gettingUserCartData,
};
