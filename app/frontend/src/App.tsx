import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import {
  Home,
  PageNotFound,
  ProductsPage,
  ProductPage,
  UserCart,
  UserOrders,
} from "./pages";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#b65dff",
      },
    },
  });

  return (
    <div id="app">
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/cart" element={<UserCart />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
