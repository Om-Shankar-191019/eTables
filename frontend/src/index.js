import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Newproduct from "./page/Newproduct";
import Login from "./page/Login";
import Menu from "./page/Menu";
import Home from "./page/Home";
import Signup from "./page/Signup";
import { store } from "./redux";
import { Provider } from "react-redux";
import AllProduct from "./component/AllProduct";
import Cart from "./page/Cart";
import Success from "./page/Success";
import Cancel from "./page/Cancel";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/menu" element={<AllProduct />} />
      <Route path="/menu/:filterby" element={<Menu />} />
      <Route path="/newproduct" element={<Newproduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
