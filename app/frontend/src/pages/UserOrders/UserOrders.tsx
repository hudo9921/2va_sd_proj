import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  alpha,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import { Routes } from "../../constants";
import { useAuth } from "../../context";
import useGetUserOrders from "../../hooks/use-get-user-orders";
import { OrderWithOrderItems } from "../../types";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useGetOrderItems from "../../hooks/use-get-order-items";

const styles = {
  backgroundColor: "#1e1e1e",
  height: "100vh",
  width: "75%",
  color: "white",
  cartBox: {
    borderRadius: 2,
    width: "80%",
    height: "100%",
    border: `2px solid #413a41`,
    display: "flex",
    alignItems: "end",
    justifyContent: "top",
    flexDirection: "column",
    mt: 4,
    mb: 4,
    color: "white",
  },
  table: {
    bgcolor: "#1e1e1e",
    maxHeight: "55rem",
    "& .MuiTableCell-root": {
      fontSize: "1.2rem",
      color: "white",
      maxHeight: "10rem",
    },
    "& .MuiTableBody-root": {
      "& .MuiTableRow-root": {
        borderBottom: "2px solid #413a41",
        "&:hover": {
          bgcolor: alpha("#413a41", 0.25),
        },
      },
    },
  },
  tableCell: {
    height: "5rem",
    maxHeight: "5rem",
  },
};

type Props = {};

function Row(props: { data: OrderWithOrderItems }) {
  const { data } = props;
  const [open, setOpen] = React.useState(false);

  const dateFormatter = (value: string): string => {
    const date = new Date(value);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getColor = (str: string) => {
    switch (str) {
      case "Pending":
        return "yellow";
      case "Delivered":
        return "green";
      case "Sent":
        return "#b65dff";
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, height: "8rem" }}>
        <TableCell component="th" scope="row">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              color: "white",
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {data.order.id}
        </TableCell>
        <TableCell align="center">{data.order.total_price} US$</TableCell>
        <TableCell align="center">
          {dateFormatter(data.order.date_ordered)}
        </TableCell>
        <TableCell align="center">
          <Typography
            sx={{
              fontSize: "1.2rem",
              color: getColor(data.order.status),
            }}
          >
            {data.order.status}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total price (US$)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.items.map((v, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          <Link to={`${Routes.PRODUCT}${v.product.id}`}>
                            {v.product.title}
                          </Link>
                        </TableCell>
                        <TableCell>{v.quantity}</TableCell>
                        <TableCell align="right">{v.price}</TableCell>
                        <TableCell align="right">
                          {parseFloat(
                            (v.quantity * parseFloat(v.price)).toFixed(2)
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const UserOrders = (props: Props) => {
  const [rows, setRows] = useState<OrderWithOrderItems[]>([]);
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { useOrders } = useGetUserOrders();
  //   const {} = useGetOrderItems()

  const renderOrdersTable = useCallback(() => {
    const data: OrderWithOrderItems[] = [];

    useOrders?.forEach((order) => {
      data.push(order);
    });

    setRows(data);
  }, [useOrders]);

  useEffect(() => {
    if (!accessToken) {
      navigate(Routes.HOME);
    } else {
      renderOrdersTable();
    }
  }, [accessToken, navigate, renderOrdersTable]);

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
        <Box sx={styles.cartBox}>
          <TableContainer sx={styles.table} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  bgcolor: "#1e1e1e",
                  borderBottom: "2px solid #413a41",
                }}
              >
                <TableRow>
                  <TableCell sx={styles.tableCell}>Order</TableCell>
                  <TableCell sx={styles.tableCell} align="center">
                    Total Price
                  </TableCell>
                  <TableCell sx={styles.tableCell} align="center">
                    Date Ordered
                  </TableCell>
                  <TableCell sx={styles.tableCell} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflowY: "scroll" }}>
                {rows.map((v) => {
                  return <Row data={v} />;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default UserOrders;
