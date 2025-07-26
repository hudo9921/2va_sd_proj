import { Box, darken } from "@mui/material";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../constants";
import { Product } from "../../types";

const styles = {
  root: {
    borderRadius: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#2c2c2c",
    position: "relative",
    "& *": {
      transition: "background-color 0.2s ease-in-out",
    },
    "&:hover *": {
      backgroundColor: "#b65dff",
      cursor: "pointer",
    },
    "&:hover": {
      backgroundColor: darken("#b65dff", 0.4),
    },
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
  prodImage: {
    position: "static",
    width: "78%",
    height: "100%",
  },
  prodDsc: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    position: "absolute",
    bottom: 0,
    left: 0,
    opacity: 0.9,
    bgcolor: "#413a41",
    width: "100%",
    maxWidth: "100%",
    height: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
  },
  rate: {
    position: "absolute",
    top: 10,
    right: 10,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    width: "3rem",
    height: "3rem",
    borderRadius: 6,
    bgcolor: "#b65dff",
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    opacity: 0.3,
    width: "78%",
    height: "77%",
  },
};

type ProductCardProps = {
  textFormatNumber?: number;
  product: Product;
  handleMouseEnter?: () => void;
  handleMouseLeave?: () => void;
};

const ProductCard = ({
  product,
  handleMouseEnter,
  handleMouseLeave,
  textFormatNumber,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const titleFormater = useCallback(
    (value: string) => {
      let aux = textFormatNumber ? textFormatNumber : 0;
      return value.length > aux ? value.slice(0, aux) + "…" : value;
    },
    [textFormatNumber]
  );

  const handleClicked = (id: number) => {
    navigate(Routes.PRODUCT + `${id}`);
  };

  return (
    <Box
      sx={styles.root}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleClicked(product.id)}
    >
      <Box fontSize={25} sx={styles.rate}>
        <strong>{product.rating_rate}</strong>
      </Box>
      <Box sx={styles.overlay} />

      <Box
        sx={{
          backgroundImage: `url(${product.image})`,
          backgroundSize: "cover",
          ...styles.prodImage,
        }}
      />
      <Box sx={styles.prodDsc}>
        <Box fontSize={20} sx={{ pl: 2, pr: 2 }}>
          {textFormatNumber ? titleFormater(product.title) : product.title}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
