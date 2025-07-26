import { Box, Button, Grid, SxProps, Theme, Typography } from "@mui/material";
import React, { useState } from "react";
import { Product } from "../../types";
import ProductCard from "./ProductCard";

const styles = {
  root: {
    width: "80%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: "10px",
    gap: 2,
  },
  title: {
    fontSize: "1.5rem",
    pl: 3,
    // pt: 1,
  },
  products: {
    width: "95%",
    height: "75%",
    // border: "1px solid red",
    display: "flex",
    gap: 5,
  },
};

type ProductsShowCaseProps = {
  textFormatNumber?: number;
  sx?: SxProps<Theme> | undefined;
  products: Product[];
  title: string;
  buttonText?: string;
  handleClick?: () => void;
};

const ProductsShowCase = ({
  products,
  title,
  sx,
  textFormatNumber,
  buttonText,
  handleClick,
}: ProductsShowCaseProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box
      sx={{
        border: `2px solid ${isHovered ? "#b65dff" : "#413a41"}`,
        ...sx,
      }}
    >
      {products ? (
        <>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "10%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={styles.title}>{title}</Typography>
            {buttonText && (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#b65dff",
                  "&:hover": { bgcolor: "#7b3ead" },
                  mr: 3.5,
                }}
                onClick={handleClick}
              >
                <strong>{buttonText}</strong>
              </Button>
            )}
          </Box>
          <Box sx={styles.products}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={products.length > 3 ? { xs: 5, sm: 2, md: 20 } : { xs: 1, sm: 3, md: 12 }}
            >
              {products.map((product, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <ProductCard
                    key={index}
                    product={product}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    textFormatNumber={textFormatNumber}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <Box>AA</Box>
      )}
    </Box>
  );
};

export default ProductsShowCase;
