import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  productList: [],
  cartItem: [],
};
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setDataProduct: (state, action) => {
      state.productList = [...action.payload.products];
    },
    addToReduxProduct: (state, action) => {
      state.productList = [...state.productList, action.payload];
    },
    addCartItem: (state, action) => {
      const check = state.cartItem.some((el) => el._id === action.payload._id);
      if (check) {
        toast("item already exist in the cart");
      } else {
        const total = action.payload.price;
        state.cartItem = [
          ...state.cartItem,
          { ...action.payload, qty: 1, total: total },
        ];
        toast("item added successfully");
      }
    },
    deleteCartItem: (state, action) => {
      toast("one item deleted");
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      state.cartItem.splice(index, 1);
    },
    increaseQty: (state, action) => {
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      let qty = state.cartItem[index].qty;
      let newQty = ++qty;
      state.cartItem[index].qty = newQty;

      const price = state.cartItem[index].price;
      let total = price * newQty;
      state.cartItem[index].total = total;
    },
    decreaseQty: (state, action) => {
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      let qty = state.cartItem[index].qty;
      if (qty > 1) {
        let newQty = --qty;
        state.cartItem[index].qty = newQty;

        const price = state.cartItem[index].price;
        let total = price * newQty;
        state.cartItem[index].total = total;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setDataProduct,
  addToReduxProduct,
  addCartItem,
  deleteCartItem,
  increaseQty,
  decreaseQty,
} = productSlice.actions;

export default productSlice.reducer;
