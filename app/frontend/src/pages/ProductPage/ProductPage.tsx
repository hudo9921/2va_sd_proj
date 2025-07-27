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
import {
  CreateProductDialog,
  EditProductDialog,
  Header,
} from "../../components";
import useProduct from "../../hooks/use-product";
import ProductCard from "../../components/ProductsShowCase/ProductCard";
import useProducts from "../../hooks/use-products";
import { useAuth } from "../../context";
import useAddProductToCart from "../../hooks/use-add-product-to-cart";
import { useQueryClient } from "react-query";
import { User } from "../../types";
import useUserInfo from "../../hooks/use-user-info";
import useDeleteProduct from "../../hooks/use-delete-product";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../constants";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { product, refetch, isFetching, isLoading } = useProduct(id ?? "");
  const [quantity, setQuantity] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [user, setUser] = React.useState<User | null>(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);

  const { products, refetch: refetchProducts } = useProducts(
    10,
    "",
    product!?.category
  );

  const mutateDelete = useDeleteProduct(() => {
    navigate(Routes.INVENTORY);
    queryClient.invalidateQueries({ queryKey: [`my-products`] });
  })

  useEffect(() => {
    refetch();
  }, [id, refetch, refetchProducts]);

  const IsOutOfStock = useMemo(() => product!?.stock_quant <= 0, [product]);
  const { mutateAsync } = useAddProductToCart(product!?.id, quantity);
  const { mutateAsync: getUserInfo } = useUserInfo();
  const { accessToken } = useAuth();

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
            queryClient.invalidateQueries({
              queryKey: ["get-user-cart-query"],
            });
          })
          .catch((reason) => {
            setOpen(true);
            setSeverity("error");
            setAlertMessage(reason.message);
          });
      }
    },
    [accessToken, mutateAsync, product, quantity, queryClient]
  );

  React.useEffect(() => {
    if (accessToken) {
      getUserInfo()
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          console.log("deu ruim");
        });
    }
  }, [accessToken, getUserInfo, queryClient, refetch]);

  const resolvedImage =
    product && product.image && product.image.trim() !== ""
      ? product.image
      : product && product.file_img && typeof product.file_img === "string"
      ? product.file_img.replace("minio", "localhost").split("?")[0]
      : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

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
                  backgroundImage: `url(${resolvedImage})`,
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
                    <Box sx={{
                      display: 'flex',
                      gap: 2
                    }}>
                      <Button
                        variant="contained"
                        disabled={
                          user && user.cpf === product.seller?.cpf
                            ? undefined
                            : IsOutOfStock
                        }
                        sx={{
                          bgcolor: "#b65dff",
                          "&:hover": { bgcolor: "#7b3ead" },
                          // width: "10rem",
                          height: "3.5rem",
                          color: "white",
                        }}
                        onClick={
                          user && user.cpf === product.seller?.cpf
                            ? () => {
                                setOpenProductDialog(true);
                              }
                            : handleClick
                        }
                      >
                        <strong>
                          {user && user.cpf === product.seller?.cpf
                            ? "Edit product"
                            : "Add to cart"}
                        </strong>
                      </Button>
                      {user && user.cpf === product.seller?.cpf && (
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#b65dff",
                            "&:hover": { bgcolor: "#7b3ead" },
                            // width: "10rem",
                            height: "3.5rem",
                            color: "white",
                          }}
                          onClick={() => {
                            mutateDelete.mutate(product.id)
                          }}
                        >
                          <strong>Delete</strong>
                        </Button>
                      )}
                    </Box>
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
      <EditProductDialog
        open={openProductDialog}
        setOpen={setOpenProductDialog}
        productId={product?.id.toString() ?? ""}
      />
    </Box>
  );
};

export default ProductPage;
