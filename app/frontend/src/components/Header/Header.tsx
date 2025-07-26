import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Routes } from "../../constants";
import {
  Alert,
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import useLogIn from "../../hooks/use-login-in";
import useUserInfo from "../../hooks/use-user-info";
import { User } from "../../types";
import useGetUserCart from "../../hooks/use-get-user-cart";
import useGetUserCartQuery from "../../hooks/use-get-user-cart-query";
import useGetUserOrders from "../../hooks/use-get-user-orders";
import { useQueryClient } from "react-query";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#1e1e1e",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { userCart, refetch } = useGetUserCartQuery();
  const { useOrders, refetch: refetchOrders } = useGetUserOrders();
  const [cartQuantity, setCartQuantity] = React.useState<number>(0);
  const [orderQuantity, setOrderQuantity] = React.useState<number>(0);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem
        onClick={() => {
          setTokens(null, null);
          setUser(null);
          setCartQuantity(0);
          setOrderQuantity(0);
        }}
      >
        Log out
      </MenuItem>
    </Menu>
  );

  const styles = {
    alert: {
      position: "absolute",
      top: 300,
      left: 670,
      width: "24%",
      color: "white",
      bgcolor: "#1e1e1e",
      border: "2px solid #413a41",
      zIndex: 10000,
    },
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const navigate = useNavigate();
  const { accessToken, refreshToken, setTokens } = useAuth();
  const { mutateAsync } = useLogIn();
  const { mutateAsync: getUserInfo } = useUserInfo();
  const { mutateAsync: getUserCart } = useGetUserCart();

  const [open, setOpen] = React.useState(false);
  const [cpf, setCpf] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [severity, setSeverity] = React.useState<AlertColor | undefined>(
    "success"
  );
  const [alertMessage, setAlertMessage] = React.useState<string>("");
  const [user, setUser] = React.useState<User | null>(null);

  const queryClient = useQueryClient();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLinkClick = React.useCallback(() => {
    navigate(Routes.HOME);
  }, [navigate]);

  const handleLogIn = () => {
    mutateAsync({ cpf, password })
      .then(({ access, refresh }) => {
        setOpenAlert(true);
        setSeverity("success");
        setAlertMessage("Successfully logged in.");
        setOpen(false);
        setTokens(access, refresh);
        queryClient.invalidateQueries({ queryKey: ["get-user-cart-query"] });
        queryClient.invalidateQueries({ queryKey: ["get-user-orders"] });
      })
      .catch((reason) => {
        setOpenAlert(true);
        setSeverity("error");
        setAlertMessage("Unable to log in.");
      });
  };

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

    let aux: number = 0;
    userCart?.items.forEach((item) => (aux = aux + item.quantity));
    setCartQuantity(aux);

    setOrderQuantity(useOrders!?.length);
    
  }, [accessToken, getUserCart, getUserInfo, queryClient, refetch, refetchOrders, useOrders, userCart?.items]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {openAlert && (
        <Alert
          sx={styles.alert}
          onClose={() => setOpenAlert(false)}
          severity={severity}
        >
          <strong>{alertMessage}</strong>
        </Alert>
      )}
      <AppBar position="static" sx={{ bgcolor: "#2c2c2c" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box onClick={handleLinkClick}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: "1.5rem",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              shop
              <span style={{ color: "#b65dff" }}>cart</span>
            </Typography>
          </Box>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => {
                navigate(Routes.USERCART);
              }}
            >
              <Badge
                badgeContent={cartQuantity}
                color="error"
                sx={{
                  "& .MuiBadge-colorError": {
                    bgcolor: "#b65dff",
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={() => {
                navigate(Routes.USERORDERS)
              }}
            >
              <Badge
                badgeContent={orderQuantity}
                color="error"
                sx={{
                  "& .MuiBadge-colorError": {
                    bgcolor: "#b65dff",
                  },
                }}
              >
                <ReceiptLongIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            {!accessToken && !user ? (
              <>
                <Box
                  sx={{
                    pl: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={handleClickOpen}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      display: { xs: "none", sm: "block", bgcolor: "red" },
                      fontSize: "1.3rem",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    Log In
                  </Typography>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Log In</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Enter a valid user cpf and password to log in at this
                      site.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="cpf"
                      label="Cpf"
                      value={cpf}
                      onChange={(event) => setCpf(event.currentTarget.value)}
                      fullWidth
                      variant="standard"
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="password"
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.currentTarget.value)
                      }
                      fullWidth
                      variant="standard"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleLogIn}>Log In</Button>
                    <Button onClick={handleClose}>Create an account</Button>
                  </DialogActions>
                </Dialog>{" "}
              </>
            ) : (
              <Box
                sx={{
                  pl: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={handleClickOpen}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block", bgcolor: "red" },
                    fontSize: "1.3rem",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  {user?.full_name}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
