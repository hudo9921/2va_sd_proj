import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
  CreateProductDialog,
  Header,
  ProductsShowCase,
} from "../../components";
import useProducts from "../../hooks/use-products";
import useProductsCategories from "../../hooks/use-products-categories";
import useProductsFestivities from "../../hooks/use-products-festivities";
import { useAuth } from "../../context";
import { User } from "../../types";
import useMyProducts from "../../hooks/use-my-products";

const styles = {
  root: {
    backgroundColor: "#1e1e1e",
    height: "100vh",
    width: "75%",
    color: "white",
  },
  prodShowCase: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: "10px",
  },
  paginationBox: {
    borderRadius: 2,
    top: 810,
    width: "57%",
    height: "6%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationComponent: {
    pb: 3,
    color: "white",
    "& .MuiPagination-outlined": {
      fontSize: "12",
    },
    "& .MuiPaginationItem-root": {
      fontSize: "20",
      color: "white",
      border: "2px solid #413a41",
      fontWeight: "bold",
      "&:hover": {
        bgcolor: "#b65dff",
      },
    },
  },
  filterBox: {
    borderRadius: 2,
    width: "80%",
    height: "15%",
    border: `2px solid #413a41`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mt: 4,
    "& .MuiFormLabel-root": {
      fontSize: "1.5rem",
      color: "white",
    },
    "& .MuiTypography-root": {
      fontSize: "1.3rem",
      color: "white",
    },
    "& input": {
      color: "white",
    },
  },
  searchInput: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#413a41",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: "#b65dff",
      },
    },
    "& .MuiSelect-select": {
      color: "white", // se você quiser aplicar cor ao texto selecionado
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#413a41",
      borderWidth: "2px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b65dff",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b65dff",
    },
  },
  radio: {
    color: "#413a41",
  },
};

const Inventory = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFestivity, setSelectedFestivity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { products, refetch } = useMyProducts(
    (page - 1) * 10,
    searchQuery,
    selectedCategory,
    selectedFestivity,
  );
  const { categories } = useProductsCategories();
  const { festivities } = useProductsFestivities();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    refetch();
  }, [page, searchQuery, selectedCategory, refetch]);

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
        <Box sx={styles.filterBox}>
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              width: "50%",
              pl: 3,
              pr: 3,
            }}
          >
            <TextField
              sx={styles.searchInput}
              id="outlined-search"
              label="Search Product"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
            />
          </Box>
          <FormControl
            fullWidth
            sx={{
              pr: 3,
            }}
          >
            <InputLabel>Categories</InputLabel>
            <Select
              value={selectedCategory}
              label="Categories"
              onChange={(event) => setSelectedCategory(event.target.value)}
              sx={styles.searchInput}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories?.map((c) => (
                <MenuItem value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Festivity</InputLabel>
            <Select
              value={selectedFestivity}
              label="Festivities"
              onChange={(event) => setSelectedFestivity(event.target.value)}
              sx={styles.searchInput}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {festivities?.map((c) => (
                <MenuItem value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              pl: 3,
              pr: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
                setOpen(true);
              }}
            >
              <strong>Add product</strong>
            </Button>
          </Box>
        </Box>
        {products && (
          <ProductsShowCase
            sx={{
              width: "80%",
              height: "80%",
              mb: 4,
              ...styles.prodShowCase,
            }}
            products={products.results}
            title={"My products"}
            textFormatNumber={20}
          />
        )}
        {products && (
          <Box
            sx={{
              border: `2px solid ${isHovered ? "#b65dff" : "#413a41"}`,
              ...styles.paginationBox,
            }}
          >
            <Pagination
              page={page}
              sx={styles.paginationComponent}
              color={"primary"}
              count={Math.ceil(products.count / 10)}
              variant="outlined"
              size="large"
              onChange={(event, page: number) => setPage(page)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </Box>
        )}
      </Box>
      <CreateProductDialog open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Inventory;
