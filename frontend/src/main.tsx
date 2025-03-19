import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "@/pages/homepage";
import LoginPage from "@/pages/loginpage";
import RegisterPage from "@/pages/registerpage";
import ProfilePage from "@/pages/profilepage";
import ItemPage from "@/pages/itempage";
import ErrorPage from "@/pages/errorPage";
import CartPage from "@/pages/cartPage";
import SearchPage from "@/pages/searchpage";
import OrderPage from "./pages/orderPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product/:productId" element={<ItemPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
