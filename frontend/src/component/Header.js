import React, { useState } from "react";
import { BsCartFill } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logoutRedux());
  };

  const cartItemNumber = useSelector((state) => state.product.cartItem);

  return (
    <header className="fixed w-full h-16 px-2 md:px-4 z-50 bg-white shadow-md">
      {/* desktop */}

      <div className="h-full flex justify-between items-center">
        <Link to="/">
          <div className="h-10">
            <p className="h-full text-2xl text-red-600 font-bold  ">
              {" "}
              eTables{" "}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-7 ">
          <nav className=" items-center gap-4 md:gap-6  text-base md:text-lg hidden md:flex">
            <Link to="">Home</Link>
            <Link to="menu">Menu</Link>
          </nav>
          <div className="text-2xl cursor-pointer text-slate-600  relative">
            <Link to={"cart"}>
              <BsCartFill />
              <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center ">
                {cartItemNumber.length}
              </div>
            </Link>
          </div>
          <div
            onClick={handleShowMenu}
            className="text-xl cursor-pointer relative "
          >
            <div className="w-6 h-6 rounded-full overflow-hidden drop-shadow-md">
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" />
              ) : (
                <FaRegUserCircle className="h-full w-full" />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 mt-2 p-2 shadow drop-shadow-md bg-white flex flex-col text-black text-sm md:text-lg">
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link
                    to="newproduct"
                    className="whitespace-nowrap cursor-pointer"
                  >
                    New Product
                  </Link>
                )}

                {userData.firstName ? (
                  <p
                    className="cursor-pointer text-white px-2 bg-red-500 whitespace-nowrap"
                    onClick={handleLogout}
                  >
                    Logout {`(${userData.firstName})`}
                  </p>
                ) : (
                  <Link to="login" className="whitespace-nowrap cursor-pointer">
                    Login
                  </Link>
                )}

                <nav className="flex flex-col  text-base md:text-lg md:hidden">
                  <Link to="">Home</Link>
                  <Link to="menu">Menu</Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
