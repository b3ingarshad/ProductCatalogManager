import React from "react";
import { Routes, Route } from "react-router-dom";
import Product from "./component/Product";
import ProductList from "./features/products/ProductList";
import Navbar from "./component/Navbar";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Product />} />
        <Route path="edit/:id" element={<Product />} />
        <Route path="list" element={<ProductList />} />
      </Route>
    </Routes>
  );
};

export default App;
