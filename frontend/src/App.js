import React, { useEffect } from "react";
import Header from "./component/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setDataProduct } from "./redux/productSlice";

const App = () => {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_DOMAIN}/products`
        );
        const resData = await res.json();
        dispatch(setDataProduct(resData));
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllProducts();
  }, []);
  return (
    <>
      <Toaster />
      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;
