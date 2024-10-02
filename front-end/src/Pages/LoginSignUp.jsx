import React, { useContext, useState } from "react";
import './CSS/LoginSignUp.css'; 
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginSignUp = () => {
  const { url } = useContext(AppContext);
  const [state, setState] = useState("Login");
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate()

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeTerms = () => {
    setTermsAccepted((prev) => !prev);
  };

  const handleRegister = async (newURL) => {
    if(!data.name) {
      toast.error("Name is required", {autoClose: 2000});
      return;
    }
    if(!data.email) {
      toast.error("Email is required", {autoClose: 2000});
      return;
    }
    if(!data.password) {
      toast.error("Password is required", {autoClose: 2000});
      return;
    }
    if(!termsAccepted) {
      toast.error("Accept terms and conditions", {autoClose: 2000});
      return;
    }
    try {
      const response = await axios.post(newURL, {
        email: data.email,
        name: data.name,
        password: data.password,
      });
      if(response.data.success) {
        toast.success("Account created successfully");
        setState("Login");
        setData({
          email: "",
          name: "",
          password: "",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred. Please try again.", {autoClose: 1000});
      } else if (error.request) {
        toast.error("No response from server. Please try again.", {autoClose: 1000});
      } else {
        toast.error("Error in setting up the request. Please try again.", {autoClose: 1000});
      }
    }
  };

  const handleLogin = async (newURL) => {
    if(!data.email) {
      toast.error("Email is required", {autoClose: 2000});
      return;
    }
    if(!data.password) {
      toast.error("Password is required", {autoClose: 2000});
      return;
    }
    try {
      const response = await axios.post(newURL, {
        email: data.email,
        password: data.password,
      });
      if(response.data.success) {
        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        toast.success("Login Successfull", {autoClose: 1000});
        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred. Please try again.", {autoClose: 2000});
      } else if (error.request) {
        toast.error("No response from server. Please try again.", {autoClose: 2000});
      } else {
        toast.error("Error in setting up the request. Please try again.", {autoClose: 2000});
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newURL = `${url}/shopper/users/${state === "Sign Up" ? "register" : "login"}`;
    try {
      state === "Sign Up" ? await handleRegister(newURL) 
        : await handleLogin(newURL);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="loginsignup">
      <div className={`loginsignup-container ${state === "Login" ? "newclass" : "oldclass"}`}>
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {
            state === "Sign Up" ? 
            ( <input type="text" placeholder="Your Name" name="name" onChange={onChangeHandler} value={data.name} /> ) 
            : 
            <></>
          }
          <input type="email" placeholder="Email Address" name="email" onChange={onChangeHandler} value={data.email} />
          <input type="password" placeholder="Password" name="password" onChange={onChangeHandler} value={data.password} />
        </div>
        <button onClick={handleSubmit}>Continue</button>
        {
          state === "Sign Up" ? 
          ( <p className="loginsignup-login"> Already have an account?{" "}<span onClick={() => setState("Login")}>Login here</span></p> ) 
          : 
          ( <p className="loginsignup-login"> Create an account?{" "}<span onClick={() => setState("Sign Up")}>Click here</span></p> )
        }
        {
          state === "Sign Up" ?
          ( <div className="loginsignup-agree">
              <input type="checkbox" id="checkbox" checked={termsAccepted} onChange={onChangeTerms} />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div> 
          )
          :
          <></>
        }
      </div>
    </div>
  );
};

export default LoginSignUp;
