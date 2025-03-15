import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "logout" or "signup"
  const isAuthenticated = localStorage.getItem("accessToken");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleAction = (type) => {
    setConfirmType(type);
    setOpenConfirmDialog(true);
  };

  const handleConfirm = () => {
    setOpenConfirmDialog(false);
    if (confirmType === "logout") {
      localStorage.clear();
      setTimeout(() => navigate("/log-in"), 1000);
    } else if (confirmType === "signup") {
      navigate("/sign-up");
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dash-board" },
    { label: "Favorites", href: "/favourites" },
    { label: "Shelter Messaging", href: "/messages" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#2C3E50", boxShadow: 3 }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              edge="start"
              color="inherit"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                fontWeight: 600,
                color: "white",
                textDecoration: "none",
                flexGrow: 1,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
             SANTO PET PLATFORM
            </Typography>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  href={link.href}
                  sx={{
                    color: "white",
                    fontSize: "0.85rem",
                    borderBottom:
                      location.pathname === link.href
                        ? "2px solid white"
                        : "none",
                    fontWeight:
                      location.pathname === link.href ? "bold" : "normal",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {isAuthenticated ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => handleAction("logout")}
                    sx={{ color: "white", fontSize: "0.75rem", px: 2 }}
                  >
                    Log Out
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleAction("signup")}
                    sx={{ fontSize: "0.75rem", px: 2 }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    href="/log-in"
                    sx={{ color: "white", fontSize: "0.75rem", px: 2 }}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleAction("signup")}
                    sx={{ fontSize: "0.75rem", px: 2 }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250, bgcolor: "#2C3E50", height: "100%" }}>
          <Typography variant="h6" color="white" sx={{ p: 2 }}>
            PET PLATFORM
          </Typography>
          <Divider sx={{ bgcolor: "white" }} />
          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.label}
                component="a"
                href={link.href}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={link.label} sx={{ color: "white" }} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleAction("logout")}
                  sx={{ color: "white", fontSize: "0.8rem" }}
                >
                  Log Out
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleAction("signup")}
                  sx={{ fontSize: "0.8rem" }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  href="/log-in"
                  sx={{ color: "white", fontSize: "0.8rem" }}
                >
                  Log in
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleAction("signup")}
                  sx={{ fontSize: "0.8rem" }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Professional Confirmation Modal */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        TransitionComponent={Fade}
        PaperComponent={(props) => (
          <Paper
            {...props}
            elevation={5}
            sx={{ borderRadius: 3, p: 2, minWidth: 320 }}
          />
        )}
      >
        <DialogTitle
          sx={{ fontSize: "1rem", fontWeight: 600, textAlign: "center" }}
        >
          {confirmType === "logout" ? "Confirm Logout" : "Proceed with Sign Up"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "0.9rem",
              textAlign: "center",
              color: "#444",
              px: 2,
            }}
          >
            {confirmType === "logout"
              ? "You are about to log out from your account. Any unsaved progress may be lost. Do you wish to continue?"
              : "Signing up grants you full access to our platform’s features. Would you like to proceed?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 1 }}>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            sx={{ color: "#666", fontSize: "0.85rem" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            sx={{ fontSize: "0.85rem", fontWeight: "bold" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;
