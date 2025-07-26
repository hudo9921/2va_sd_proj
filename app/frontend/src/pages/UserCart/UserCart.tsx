import {
  Alert,
  AlertColor,
  alpha,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Header } from "../../components";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import useGetUserCart from "../../hooks/use-get-user-cart";
import useLogIn from "../../hooks/use-login-in";
import { useAuth } from "../../context";
import { Link, useNavigate } from "react-router-dom";
import { Routes } from "../../constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import useProductMutation from "../../hooks/use-product-mutation";
import { CartItem, Product } from "../../types";
import useCreateOrder from "../../hooks/use-create-order";
import useClearCart from "../../hooks/use-clear-cart";
import useRemoveCartItem from "../../hooks/use-remove-cart-item";
import { useQueryClient } from "react-query";
import useEditCartItem from "../../hooks/use-edit-cart-item";

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
  cartBox: {
    borderRadius: 2,
    width: "80%",
    height: "100%",
    border: `2px solid #413a41`,
    display: "flex",
    alignItems: "end",
    justifyContent: "center",
    flexDirection: "column",
    mt: 4,
    mb: 4,
    color: "white",
  },
  title: {
    fontSize: "1.5rem",
    pl: 3,
  },
  productsBox: {
    width: "100%",
    height: "70%",
    // bgcolor: "red",
    borderBottom: "2px solid #413a41",
    borderTop: "2px solid #413a41",
  },
  table: {
    height: "100%",
    bgcolor: "#1e1e1e",
    "& .MuiTableCell-root": {
      fontSize: "1.2rem",
      color: "white",
    },
    "& .MuiTableBody-root": {
      "& .MuiTableRow-root": {
        borderTop: "2px solid #413a41",
        "&:hover": {
          bgcolor: alpha("#413a41", 0.25),
        },
      },
    },
  },
  tableCell: {
    height: "1rem",
  },
  actionsBox: {
    width: "50%",
    height: "30%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "2rem",
    "& .MuiButton-root": {
      mt: 3,
    },
  },
  alert: {
    position: "absolute",
    top: 70,
    left: 345,
    width: "60%",
    color: "white",
    bgcolor: "#1e1e1e",
    border: "2px solid #413a41",
  },
  searchInput: {
    width: "19rem",
  },
};

type Props = {};

interface Row {
  product: Product;
  price: string;
  quantity: number;
  total: number;
  cartItemId: number;
}

const UserCart = (props: Props) => {
  const { mutateAsync } = useGetUserCart();
  const { mutateAsync: mutateCreateOrder } = useCreateOrder();
  const { mutateAsync: mutateClearCart } = useClearCart();
  const { mutateAsync: mutateRemoveCartItem } = useRemoveCartItem();
  const { mutateAsync: mutateEditCartItem } = useEditCartItem();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Row[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [quantity, setQuantity] = useState<number>(0);
  const [productBeingEdited, setProductBeingEdited] = useState<number>(0);

  const queryClient = useQueryClient();

  const renderCartTable = useCallback(() => {
    const tableData: Row[] = [];

    mutateAsync().then((data) => {
      data.items.forEach((item) => {
        tableData.push({
          product: item.product,
          total: parseFloat((parseFloat(item.price) * item.quantity).toFixed(2)),
          quantity: item.quantity,
          price: item.price,
          cartItemId: item.id,
        });
      });
    });
    setData(tableData);
  }, [mutateAsync]);

  useEffect(() => {
    if (!accessToken) {
      navigate(Routes.HOME);
    } else {
      renderCartTable();
    }
  }, [accessToken, navigate, renderCartTable]);

  const handleBuyCart = () => {
    mutateCreateOrder()
      .then((data) => {
        setOpenAlert(true);
        setSeverity("success");
        setAlertMessage("Cart bought successfully.");
      })
      .catch((reason) => {
        setOpenAlert(true);
        setSeverity("error");
        setAlertMessage(reason);
      });

    setData([]);
  };

  const handleClearCart = () => {
    mutateClearCart()
      .then((data) => {
        setOpenAlert(true);
        setSeverity("success");
        setAlertMessage("Cart cleared successfully.");
      })
      .catch((reason) => {
        setOpenAlert(true);
        setSeverity("error");
        setAlertMessage(reason);
      });
    setData([]);
  };

  const handleRemoveItem = (cartItemId: number): void => {
    mutateRemoveCartItem(cartItemId)
      .then(() => {
        setOpenAlert(true);
        setSeverity("success");
        setAlertMessage("Item removed successfully.");
        renderCartTable();
        queryClient.invalidateQueries({ queryKey: ["get-user-cart-query"] });
      })
      .catch((reason) => {
        setOpenAlert(true);
        setSeverity("error");
        setAlertMessage(reason);
      });
  };

  const handleOpenEditDialog = (cartItemId: number): void => {
    setOpen(true);
    setProductBeingEdited(cartItemId);
  };

  const handleEditCartItemQuantity = () => {
    mutateEditCartItem({ productId: productBeingEdited, quantity: quantity })
      .then((newData) => {
        setOpenAlert(true);
        setSeverity("success");
        setAlertMessage("Cart item quantinty edited successfully.");

        setData((prevData) => {
          const data = prevData.map((row) => ({ ...row }));
          const index = data.findIndex(
            (row: Row) => row.cartItemId === productBeingEdited
          );
          const updatedRow = {
            ...data[index],
            quantity: newData.quantity,
            total: parseFloat(
              (newData.quantity * parseFloat(newData.price)).toFixed(2)
            ),
          };
          data[index] = updatedRow;
          return data;
        });
      })
      .catch((reason) => {
        setOpenAlert(true);
        setSeverity("error");
        setAlertMessage(reason);
      });
  };

  return (
    <Box sx={styles}>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit item quantity</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a valide item quantity.</DialogContentText>
          <TextField
            sx={{
              mt: 4,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#413a41",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "#b65dff",
                },
              },
              ...styles.searchInput,
            }}
            id="outlined-search"
            label="Quantity"
            value={quantity}
            onChange={(event) => setQuantity(parseInt(event.target.value))}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEditCartItemQuantity}>Edit</Button>
        </DialogActions>
      </Dialog>
      <Header />
      {openAlert && (
        <Alert
          sx={styles.alert}
          onClose={() => setOpenAlert(false)}
          severity={severity}
        >
          <strong>{alertMessage}</strong>
        </Alert>
      )}
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
        <Box sx={styles.cartBox}>
          <Box
            sx={{
              display: "flex",
              alignContent: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
              py: 2,
            }}
          >
            <Typography sx={styles.title}>My cart</Typography>
          </Box>
          <Box sx={styles.productsBox}>
            <TableContainer sx={styles.table} component={Paper}>
              <Table sx={{ minWidth: 650}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        height: "5rem",
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Link to={`${Routes.PRODUCT}${row.product.id}`}>
                          {row.product.title}
                        </Link>
                      </TableCell>
                      <TableCell align="center">{row.price}</TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="center">{row.total}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="label"
                          onClick={() => handleOpenEditDialog(row.cartItemId)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="label"
                          onClick={() => handleRemoveItem(row.cartItemId)}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={styles.actionsBox}>
            <Button
              variant="contained"
              disabled={data.length < 1}
              sx={{
                bgcolor: "#b65dff",
                "&:hover": { bgcolor: "#7b3ead" },
                width: "10rem",
                height: "3.5rem",
                color: "white",
              }}
              onClick={handleBuyCart}
            >
              <strong>Buy Cart</strong>
            </Button>
            <Button
              variant="contained"
              disabled={data.length < 1}
              sx={{
                bgcolor: "#b65dff",
                "&:hover": { bgcolor: "#7b3ead" },
                width: "10rem",
                height: "3.5rem",
                color: "white",
              }}
              onClick={handleClearCart}
            >
              <strong>Clear to cart</strong>
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#b65dff",
                "&:hover": { bgcolor: "#7b3ead" },
                width: "10rem",
                height: "3.5rem",
                color: "white",
              }}
              onClick={() => navigate(Routes.PRODUCTS)}
            >
              <strong>Go to Products</strong>
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#b65dff",
                "&:hover": { bgcolor: "#7b3ead" },
                width: "10rem",
                height: "3.5rem",
                color: "white",
              }}
            >
              <strong>My orders</strong>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserCart;
