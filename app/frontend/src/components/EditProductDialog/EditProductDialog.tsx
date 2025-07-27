import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useCreateProduct from "../../hooks/use-create-product";
import { useAuth } from "../../context";
import { User } from "../../types";
import useProduct from "../../hooks/use-product";
import useEditProduct from "../../hooks/use-edit-product";
import { useQueryClient } from "react-query";

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
    pl: 2,
    // pt: 1,
    color: "white",
  },
  products: {
    width: "95%",
    height: "75%",
    // border: "1px solid red",
    display: "flex",
    gap: 5,
  },
  searchInput: {
    width: "100%",
    color: "white",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#413a41",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: "#b65dff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#b65dff",
      },
      color: "white",
    },
    "& .MuiSelect-select": {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#413a41",
          borderWidth: "2px",
        },
        "&:hover fieldset": {
          borderColor: "#b65dff",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#b65dff",
        },
      },
      color: "white",
    },
  },
};

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productId?: string;
}

const EditProductDialog = ({ open, setOpen, productId }: Props) => {
  const queryClient = useQueryClient();
  const { product, refetch, isFetching, isLoading } = useProduct(productId);

  const [price, setPrice] = useState<number>(0);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState<null | string>(null);
  const [festivity, setFestivity] = useState<null | string>(null);
  const [description, setDescription] = useState<null | string>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [fileImg, setFileImg] = useState<File | null>(null);

  const mutate = useEditProduct(() => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: [`product`, productId] });
  });

  useEffect(() => {
    if (product) {
      setProductName(product.title);
      setPrice(product.price);
      setCategory(product.category);
      setFestivity(product.festivity);
      setQuantity(product.stock_quant);
    }
  }, [product]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box
        sx={{
          width: "500px",
          //   height: "500px",
          bgcolor: "#1e1e1e",
          p: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={styles.title}>Edit Product</Typography>
          <IconButton
            size="large"
            color="inherit"
            onClick={() => {
              setOpen(false);
            }}
            sx={{
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 3,
            p: 3,
          }}
        >
          <TextField
            sx={styles.searchInput}
            label="Product Name"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            type="text"
          />
          <TextField
            sx={styles.searchInput}
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            type="text"
          />
          <TextField
            sx={styles.searchInput}
            label="Festivity"
            value={festivity}
            onChange={(event) => setFestivity(event.target.value)}
            type="text"
          />
          <TextField
            sx={styles.searchInput}
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            type="text"
            multiline
            rows={3}
          />
          <TextField
            sx={styles.searchInput}
            id="outlined-search"
            label="Quantity"
            value={quantity}
            onChange={(event) => setQuantity(parseInt(event.target.value))}
            type="number"
          />
          <TextField
            sx={styles.searchInput}
            id="outlined-price"
            label="Price"
            value={price}
            onChange={(event) => {
              const value = event.target.value;
              // Permite apenas até 2 casas decimais
              const floatValue = parseFloat(value);
              if (!isNaN(floatValue)) {
                const rounded = Math.round(floatValue * 100) / 100;
                setPrice(rounded);
              } else {
                setPrice(0);
              }
            }}
            type="number"
            inputProps={{
              step: "0.01",
              min: "0",
            }}
          />
          <Button variant="outlined" component="label">
            Selecionar Arquivo
            <input
              hidden
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileImg(file || null);
              }}
            />
          </Button>
          {fileImg && (
            <Typography variant="body2" sx={{ color: "white" }}>
              Arquivo selecionado: {fileImg.name}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{
              bgcolor: "#b65dff",
              "&:hover": { bgcolor: "#7b3ead" },
              // width: "10rem",
              // height: "3.5rem",
              color: "white",
            }}
            onClick={() => {
              if (!product) return;
              mutate.mutate({
                productId: product.id,
                category: category,
                festivity: festivity,
                price: price,
                stock_quant: quantity,
                title: productName,
                description: description,
                file_img: fileImg
              });
            }}
          >
            <strong>Edit product</strong>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditProductDialog;
