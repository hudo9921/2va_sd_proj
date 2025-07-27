import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useProductsCategories from "../../hooks/use-products-categories";
import useProductsFestivities from "../../hooks/use-products-festivities";
import useGeneratePortfolio from "../../hooks/use-generate-portifolio";
import useGetPortfolio from "../../hooks/use-get-portifolio";

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
};

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function PortilofioDialog({ open, setOpen }: Props) {
  const { categories } = useProductsCategories();
  const { festivities } = useProductsFestivities();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFestivity, setSelectedFestivity] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  const mutateGetPorfolio = useGetPortfolio();
  const mutateGeneratePortifolio = useGeneratePortfolio((fileUrl: string) => {
    setFileName(fileUrl);
    mutateGetPorfolio.mutate(fileUrl);
  });

  useEffect(() => {
    if (mutateGetPorfolio.data) {
      const blobUrl = URL.createObjectURL(mutateGetPorfolio.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName ?? "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setFileName(null);
    }
  }, [mutateGetPorfolio.data]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth={"md"}
    >
      <Box
        sx={{
          width: "600px",
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
          <Typography sx={styles.title}>Generate portifolio</Typography>
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
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            gap: 2,
          }}
        >
          <FormControl fullWidth>
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
          <Button
            variant="contained"
            sx={{
              bgcolor: "#b65dff",
              "&:hover": { bgcolor: "#7b3ead" },
              color: "white",
            }}
            onClick={() => {
              mutateGeneratePortifolio.mutate({
                category: selectedCategory,
                festivity: selectedFestivity,
              });
            }}
          >
            <strong>Generate</strong>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default PortilofioDialog;
