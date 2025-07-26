import {
  Alert,
  AlertColor,
  AlertTitle,
  Box,
  Button,
  Grid,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components";
import useProduct from "../../hooks/use-product";
import ProductCard from "../../components/ProductsShowCase/ProductCard";
import useProducts from "../../hooks/use-products";
import { useAuth } from "../../context";
import useAddProductToCart from "../../hooks/use-add-product-to-cart";
import { useQueryClient } from "react-query";

const styles = {
  root: {
    backgroundColor: "#1e1e1e",
    height: "100vh",
    width: "75%",
    color: "white",
  },
  productPageBox: {
    borderRadius: 2,
    width: "80%",
    height: "100%",
    border: `2px solid #413a41`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    mt: 4,
    mb: 4,
    color: "white",
  },
  productBox: {
    width: "100%",
    height: "73%",
    borderBottom: "2px solid #413a41",
    display: "flex",
  },
  prodImage: {
    position: "static",
    width: "40%",
    height: "100%",
    borderRight: "2px solid #413a41",
  },
  box: {
    width: "100%",
    p: 3,
    // "& *": {
    //   mb: 3,
    // },

    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "2rem",
  },
  searchInput: {
    width: "19rem",
    "& .MuiTypography-root": {
      color: "white",
    },
    "& input": {
      color: "white",
    },
    "& outlined-search": {
      color: "white",
    },
  },
  products: {
    width: "95%",
    height: "75%",
    display: "flex",
    gap: 5,
  },
  recommended: {
    width: "100%",
    height: "27%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rate: {
    position: "absolute",
    top: 110,
    left: 650,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    width: "8rem",
    height: "3rem",
    borderRadius: 6,
    bgcolor: "#b65dff",
    zIndex: 1000,
  },
  alert: {
    position: "absolute",
    top: 70,
    width: "60%",
    color: "white",
    bgcolor: "#1e1e1e",
    border: "2px solid #413a41",
  },
};

type Props = {};

const ProductPage = (props: Props) => {
  const { id } = useParams();
  const { product, refetch, isFetching, isLoading } = useProduct(id ?? "");
  const [quantity, setQuantity] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const { products, refetch: refetchProducts } = useProducts(
    10,
    "",
    product!?.category
  );

  useEffect(() => {
    refetch();
  }, [id, refetch, refetchProducts]);

  const IsOutOfStock = useMemo(() => product!?.stock_quant <= 0, [product]);
  const { mutateAsync } = useAddProductToCart(product!?.id, quantity);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!accessToken) {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Please login first.");
      } else if (quantity > product!?.stock_quant || quantity < 1) {
        setOpen(true);
        setSeverity("error");
        setAlertMessage("Invalid quantity.");
      } else {
        mutateAsync({ quantity })
        .then((data) => {
          setOpen(true);
          setSeverity("success");
          setAlertMessage("Product added to cart.");
          queryClient.invalidateQueries({ queryKey: ["get-user-cart-query"] });
        })
        .catch((reason) => {
          setOpen(true);
          setSeverity("error");
          setAlertMessage(reason.message);
        })
      }
    },
    [accessToken, mutateAsync, product, quantity, queryClient]
  );

  if (isFetching || isLoading) {
    return <Box sx={styles.root}></Box>;
  }

  return (
    <Box sx={styles.root}>
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
        {open && (
          <Alert
            sx={styles.alert}
            onClose={() => setOpen(false)}
            severity={severity}
          >
            <strong>{alertMessage}</strong>
          </Alert>
        )}
        {product && products && (
          <Box sx={styles.productPageBox}>
            <Box sx={styles.productBox}>
              {IsOutOfStock && (
                <Box fontSize={25} sx={styles.rate}>
                  <strong>Sold Out</strong>
                </Box>
              )}
              <Box
                sx={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: "cover",
                  ...styles.prodImage,
                }}
              />
              <Box sx={{ width: "60%", height: "100%" }}>
                <Box
                  sx={{
                    width: "100%",
                    height: "20%",
                    borderBottom: "2px solid #413a41",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    align="center"
                    fontWeight={"bold"}
                    sx={{
                      p: 3,
                      fontSize: "1.5rem",
                    }}
                  >
                    {product.title}
                  </Typography>
                </Box>
                <Box sx={{ width: "100%", height: "80%" }}>
                  <Typography
                    variant="h6"
                    align="left"
                    component="div"
                    sx={{
                      p: 3,
                      fontSize: "1.1rem",
                      borderBottom: "2px solid #413a41",
                      height: "10rem",
                      overflowX: "none",
                      overflowY: "scroll",
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={styles.box}>
                    <Typography>
                      Rating Count: {product.rating_count}.
                    </Typography>
                    <Typography>
                      Rate: <strong>{product.rating_rate}</strong>.
                    </Typography>
                    <Typography>Price: {product.price} US$</Typography>
                    <Typography>In Stock: {product.stock_quant}.</Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#413a41",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: IsOutOfStock ? null : "#b65dff",
                          },
                        },
                        ...styles.searchInput,
                      }}
                      id="outlined-search"
                      label="Quantity"
                      disabled={IsOutOfStock}
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(parseInt(event.target.value))
                      }
                      type="number"
                    />
                    <Button
                      variant="contained"
                      disabled={IsOutOfStock}
                      sx={{
                        bgcolor: "#b65dff",
                        "&:hover": { bgcolor: "#7b3ead" },
                        width: "10rem",
                        height: "3.5rem",
                        color: "white",
                      }}
                      onClick={handleClick}
                    >
                      <strong>Add to cart</strong>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={styles.recommended}>
              <Box sx={styles.products}>
                {products && (
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={
                      products.results.length > 3
                        ? { xs: 5, sm: 2, md: 20 }
                        : { xs: 1, sm: 3, md: 12 }
                    }
                  >
                    {products.results.slice(0, 5).map((product, index) => (
                      <Grid item xs={2} sm={4} md={4} key={index}>
                        <ProductCard
                          key={index}
                          product={product}
                          textFormatNumber={20}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductPage;
