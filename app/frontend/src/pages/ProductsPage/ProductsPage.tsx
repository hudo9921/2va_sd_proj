import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Pagination,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Header, ProductsShowCase } from "../../components";
import useProducts from "../../hooks/use-products";
import useProductsCategories from "../../hooks/use-products-categories";

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
    top: 865,
    width: "57%",
    height: "6%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationComponent: {
    pb: 2,
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
  },
  radio: {
    color: "#413a41",
  },
};

type ProductsPageProps = {};

const ProductsPage = (props: ProductsPageProps) => {
  const [page, setPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { products, refetch } = useProducts(
    (page - 1) * 10,
    searchQuery,
    selectedCategory
  );
  const { categories } = useProductsCategories();

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
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Categories
            </FormLabel>
            {categories && (
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={category}
                      control={<Radio sx={styles.radio} />}
                      label={
                        category.charAt(0).toUpperCase() + category.slice(1)
                      }
                    />
                  );
                })}
                <FormControlLabel
                  value=""
                  control={<Radio sx={styles.radio} />}
                  label="None"
                />
              </RadioGroup>
            )}
          </FormControl>
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
            title={"All Products"}
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
              count={products.count / 10}
              variant="outlined"
              size="large"
              onChange={(event, page: number) => setPage(page)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductsPage;
