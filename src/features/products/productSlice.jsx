import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("products")) || [],
  status: "idle", 
  error: null,
  search: "",
  category: "",
  sort: { field: "", order: "asc" },
  page: 1,
  pageSize: 10,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
      localStorage.setItem("products", JSON.stringify(state.items));
    },
    addProduct(state, action) {
      state.items.push(action.payload);
      localStorage.setItem("products", JSON.stringify(state.items));
    },
    updateProduct(state, action) {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      localStorage.setItem("products", JSON.stringify(state.items));
    },
    deleteProduct(state, action) {
      state.items = state.items.filter(p => p.id !== action.payload);
      localStorage.setItem("products", JSON.stringify(state.items));
    },
    bulkDelete(state, action) {
      const ids = action.payload;
      state.items = state.items.filter(p => !ids.includes(p.id));
      localStorage.setItem("products", JSON.stringify(state.items));
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.status = "error";
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  bulkDelete,
  setSearch,
  setCategory,
  setSort,
  setPage,
  setError,
  setStatus,
} = productSlice.actions;

export default productSlice.reducer;
