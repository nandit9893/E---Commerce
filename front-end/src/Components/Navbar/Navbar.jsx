import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import cart_icon from "../../assets/cart_icon.png";
import nav_dropdown from "../../assets/nav_dropdown.png";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, url } = useContext(AppContext);
  const [scroll, setScroll] = useState(false);
  const menuRef = useRef();
  const dropdown_toggle = (event) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    event.target.classList.toggle("open");
  };

  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    const newURL = `${url}/shopper/users/logout`;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        newURL,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`navbar ${scroll ? "scrolled" : ""}`}>
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>STYLO CLOTHES</p>
      </div>
      <img className="nav-dropdown" onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => { setMenu("shop")}}><Link to="/" style={{ textDecoration: "none" }}>Shop</Link>{menu === "shop" ? <hr /> : null}</li>
        <li onClick={() => { setMenu("mens")}}><Link to="/mens" style={{ textDecoration: "none" }}>Men</Link>{menu === "mens" ? <hr /> : null}</li>
        <li onClick={() => { setMenu("womens")}}><Link to="/womens" style={{ textDecoration: "none" }}>Women</Link>{menu === "womens" ? <hr /> : null}</li>
        <li onClick={() => { setMenu("kids")}}><Link to="/kids" style={{ textDecoration: "none" }}>Kids</Link>{menu === "kids" ? <hr /> : null}</li>
      </ul>
      <div className="nav-login-cart">
        {
            localStorage.getItem("accessToken") ? 
            ( <button onClick={handleLogout}>Logout</button>) 
            : 
            ( <Link to="/login"><button>Login</button></Link>)
        }
        <Link to="/cart"><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
