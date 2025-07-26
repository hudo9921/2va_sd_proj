import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import { Header, ProductsShowCase } from "../../components";
import useTopRatedProducts from "../../hooks/use-top-rated-products";
import useProducts from "../../hooks/use-products";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../constants";


const styles = {
  backgroundColor: "#1e1e1e",
  height: "100vh",
  width: "75%",
  color: "white",
  topRatedProducts: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: "10px",
    gap: 2,
  },
};

type Props = {};
// #ffae5d
const Home = (props: Props) => {
  const { products: topRatedProducts } = useTopRatedProducts();
  const { products } = useProducts();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(Routes.PRODUCTS);
  }, [navigate]);

  return (
    <Box sx={styles}>
      <Header />
      <Box
        sx={{
          fontSize: "5rem",
          width: "100%",
          height: "93%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {topRatedProducts && (
          <ProductsShowCase
            sx={{ width: "80%", height: "50%", ...styles.topRatedProducts }}
            products={topRatedProducts.results.slice(0, 3)}
            title={"Top Rated Products"}
          />
        )}
        <Box sx={{ width: "80%", height: "40%" }}>
          {products && (
            <ProductsShowCase
              sx={{ width: "100%", height: "100%", ...styles.topRatedProducts }}
              title="Recommended"
              products={products.results.slice(0, 5)}
              textFormatNumber={22}
              buttonText={"See more"}
              handleClick={handleClick}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
