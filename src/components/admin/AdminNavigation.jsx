"use client"

import { useState, useRef } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  InputBase,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  MenuList,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  Dashboard,
  ShoppingCart,
  Category as CategoryIcon,
  AttachMoney as SalesIcon,
  Inventory,
  LocalShipping as SuppliersIcon,
  People,
  Search as SearchIcon,
  Wallet as WalletIcon,
  AccountCircle,
  Settings,
  ExitToApp,
  Add as AddIcon,
  List as ListIcon,
  KeyboardArrowDown,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Store as StoreIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import FirstCraftLogo from "../../assets/images/FirstCraft-logo.png"

// Styled components for e-commerce admin theme
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "25px",
  backgroundColor: "#f8f9fa",
  border: "2px solid #e3f2fd",
  "&:hover": {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  "&:focus-within": {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.1)",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  maxWidth: "500px",
  transition: "all 0.3s ease-in-out",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#2196f3",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#333",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 500,
    "&::placeholder": {
      color: "#666",
      opacity: 1,
      fontWeight: 400,
    },
  },
}))

// E-commerce admin navigation button with enhanced styling
const AdminNavButton = styled(Button)(({ theme, active }) => ({
  color: active ? "#1976d2" : "#555",
  textTransform: "none",
  fontSize: "0.9rem",
  fontWeight: active ? 600 : 500,
  fontFamily: "'Poppins', sans-serif",
  minHeight: 50,
  padding: "10px 20px",
  margin: "0 6px",
  borderRadius: "12px",
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: active ? "#e3f2fd" : "transparent",
  border: active ? "2px solid #2196f3" : "2px solid transparent",
  "&:hover": {
    color: "#1976d2",
    backgroundColor: "#f5f5f5",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "2px solid #2196f3",
  },
  "&.has-dropdown": {
    "&:hover": {
      backgroundColor: "#e3f2fd",
    },
  },
  "& .MuiButton-startIcon": {
    marginRight: "8px",
  },
  "& .MuiButton-endIcon": {
    marginLeft: "8px",
  },
}))

// Enhanced dropdown styling for e-commerce theme
const StyledDropdownPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  color: "#333",
  minWidth: 220,
  maxWidth: 280,
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  fontFamily: "'Poppins', sans-serif",
  marginTop: "12px",
  overflow: "hidden",
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: "0.875rem",
  fontWeight: 500,
  padding: "14px 20px",
  transition: "all 0.2s ease-in-out",
  borderBottom: "1px solid #f5f5f5",
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: "#f8f9fa",
    transform: "translateX(6px)",
    paddingLeft: "26px",
  },
  "& .MuiListItemIcon-root": {
    minWidth: "36px",
  },
}))

const AdminNavigation = ({
  currentUser,
  onLogout,
  activeTab,
  onTabChange,
  onItemMasterSubTabChange,
  onCRUDOperation,
}) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null)
  const [itemMasterDropdownOpen, setItemMasterDropdownOpen] = useState(false)
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false)
  const [salesDropdownOpen, setSalesDropdownOpen] = useState(false)
  const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false)
  const [suppliersDropdownOpen, setSuppliersDropdownOpen] = useState(false)
  const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(false)

  const itemMasterRef = useRef(null)
  const categoriesRef = useRef(null)
  const salesRef = useRef(null)
  const inventoryRef = useRef(null)
  const suppliersRef = useRef(null)
  const agentsRef = useRef(null)

  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMobileMenuAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    if (onLogout) onLogout()
  }

  const handleNavigateHome = () => {
    navigate("/")
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  // Enhanced CRUD operation handlers with proper navigation
  const handleCRUDAction = (action, section, data = null) => {
    console.log(`CRUD Action: ${action} on ${section}`, data)

    // Handle navigation based on action and section
    switch (section) {
      case "itemMaster":
        if (action === "create") {
          onTabChange(null, 1) // Switch to Item Master tab
          if (onItemMasterSubTabChange) {
            onItemMasterSubTabChange(null, 0) // Switch to New Item sub-tab
          }
        } else if (action === "read") {
          onTabChange(null, 1) // Switch to Item Master tab
          if (onItemMasterSubTabChange) {
            onItemMasterSubTabChange(null, 1) // Switch to Manage Items sub-tab
          }
        }
        break
      case "categories":
        onTabChange(null, 2) // Switch to Categories tab
        break
      case "sales":
        onTabChange(null, 3) // Switch to Sales tab
        break
      case "inventory":
        onTabChange(null, 4) // Switch to Inventory tab
        break
      case "suppliers":
        onTabChange(null, 5) // Switch to Suppliers tab
        break
      case "agents":
        onTabChange(null, 6) // Switch to Sales Agents tab
        break
    }

    if (onCRUDOperation) {
      onCRUDOperation(action, section, data)
    }
  }

  // Dropdown handlers for all sections
  const handleDropdownHover = (section, open) => {
    switch (section) {
      case "itemMaster":
        setItemMasterDropdownOpen(open)
        break
      case "categories":
        setCategoriesDropdownOpen(open)
        break
      case "sales":
        setSalesDropdownOpen(open)
        break
      case "inventory":
        setInventoryDropdownOpen(open)
        break
      case "suppliers":
        setSuppliersDropdownOpen(open)
        break
      case "agents":
        setAgentsDropdownOpen(open)
        break
    }
  }

  const handleDropdownClose = (section) => {
    handleDropdownHover(section, false)
  }

  const handleTabClick = (tabIndex) => {
    onTabChange(null, tabIndex)
  }

  // Enhanced CRUD menu items for different sections
  const renderCRUDDropdown = (section, isOpen, anchorRef, items) => (
    <Popper
      open={isOpen}
      anchorEl={anchorRef.current}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
      sx={{ zIndex: 1300 }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
          }}
        >
          <StyledDropdownPaper>
            <ClickAwayListener onClickAway={() => handleDropdownClose(section)}>
              <MenuList autoFocusItem={isOpen} id={`${section}-menu`}>
                {items.map((item, index) => (
                  <StyledMenuItem
                    key={index}
                    onClick={() => {
                      handleCRUDAction(item.action, section, item.data)
                      handleDropdownClose(section)
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                        color: "#666",
                      }}
                    />
                  </StyledMenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </StyledDropdownPaper>
        </Grow>
      )}
    </Popper>
  )

  const menuId = "primary-search-account-menu"
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
      sx={{
        "& .MuiPaper-root": {
          fontFamily: "'Poppins', sans-serif",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        },
      }}
    >
      <MenuItem onClick={handleMenuClose} sx={{ fontFamily: "'Poppins', sans-serif", py: 1.5 }}>
        <AccountCircle sx={{ mr: 2, color: "#2196f3" }} />
        Profile Settings
      </MenuItem>
      <MenuItem onClick={handleMenuClose} sx={{ fontFamily: "'Poppins', sans-serif", py: 1.5 }}>
        <Settings sx={{ mr: 2, color: "#ff9800" }} />
        Admin Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ fontFamily: "'Poppins', sans-serif", py: 1.5, color: "#f44336" }}>
        <ExitToApp sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  )

  return (
    <>
      {/* Single E-commerce Admin Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important", px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Enhanced Logo with E-commerce Branding */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={handleNavigateHome}
          >
            <Box
              component="img"
              src={FirstCraftLogo}
              alt="FirstCraft Logo"
              sx={{
                height: 45,
                mr: 2,
              }}
            />
            <Box>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1.4rem",
                  lineHeight: 1,
                }}
              >
                FirstCraft
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#666",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              >
                E-COMMERCE ADMIN
              </Typography>
            </Box>
          </Box>

          {/* Enhanced Search Bar */}
          <Search sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products, orders, customers, inventory..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Enhanced Desktop Navigation Icons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNavigateHome}
              title="Go to Customer Store"
              sx={{
                color: "#666",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  transform: "translateY(-2px)",
                  color: "#1976d2",
                },
              }}
            >
              <StoreIcon />
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={() => handleNavigate("/cart")}
              sx={{
                color: "#666",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  transform: "translateY(-2px)",
                  color: "#1976d2",
                },
              }}
            >
              <Badge badgeContent={4} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <Button
              color="inherit"
              startIcon={<WalletIcon />}
              onClick={() => handleNavigate("/wallet")}
              sx={{
                ml: 1,
                color: "#666",
                textTransform: "none",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                borderRadius: "10px",
                px: 2,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  transform: "translateY(-2px)",
                  color: "#1976d2",
                },
              }}
            >
              E-Wallet
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
              <Box sx={{ textAlign: "right", mr: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {currentUser?.username || "Administrator"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#666",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.7rem",
                  }}
                >
                  Admin Access
                </Typography>
              </Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#1976d2",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  {currentUser?.username?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>
              </IconButton>
            </Box>
          </Box>
        </Toolbar>

        {/* Enhanced Admin Navigation Tabs with Working CRUD Dropdowns */}
        <Box
          sx={{
            bgcolor: "#f8f9fa",
            borderTop: "1px solid #e0e0e0",
            px: { xs: 1, sm: 2, md: 4 },
            py: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {/* Dashboard */}
            <AdminNavButton
              startIcon={<Dashboard sx={{ fontSize: 22 }} />}
              active={activeTab === 0}
              onClick={() => handleTabClick(0)}
            >
              Dashboard
            </AdminNavButton>

            {/* Item Master with Working CRUD Dropdown */}
            <Box
              ref={itemMasterRef}
              onMouseEnter={() => handleDropdownHover("itemMaster", true)}
              onMouseLeave={() => handleDropdownHover("itemMaster", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<ShoppingCart sx={{ fontSize: 22 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.3s ease-in-out",
                      transform: itemMasterDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 1}
                className="has-dropdown"
              >
                Item Master
              </AdminNavButton>

              {renderCRUDDropdown("itemMaster", itemMasterDropdownOpen, itemMasterRef, [
                {
                  label: "Add New Item",
                  description: "Create new product",
                  icon: <AddIcon sx={{ color: "#2196f3", fontSize: 22 }} />,
                  action: "create",
                  data: { type: "item" },
                },
                {
                  label: "Manage Items",
                  description: "View all products",
                  icon: <ListIcon sx={{ color: "#4caf50", fontSize: 22 }} />,
                  action: "read",
                  data: { type: "item" },
                },
                {
                  label: "Edit Items",
                  description: "Update products",
                  icon: <EditIcon sx={{ color: "#ff9800", fontSize: 22 }} />,
                  action: "update",
                  data: { type: "item" },
                },
                {
                  label: "Delete Items",
                  description: "Remove products",
                  icon: <DeleteIcon sx={{ color: "#f44336", fontSize: 22 }} />,
                  action: "delete",
                  data: { type: "item" },
                },
              ])}
            </Box>

            {/* Categories with Working CRUD Dropdown */}
            <Box
              ref={categoriesRef}
              onMouseEnter={() => handleDropdownHover("categories", true)}
              onMouseLeave={() => handleDropdownHover("categories", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<CategoryIcon sx={{ fontSize: 22 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.3s ease-in-out",
                      transform: categoriesDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 2}
                className="has-dropdown"
              >
                Categories
              </AdminNavButton>

              {renderCRUDDropdown("categories", categoriesDropdownOpen, categoriesRef, [
                {
                  label: "Add Category",
                  description: "Create new category",
                  icon: <AddIcon sx={{ color: "#2196f3", fontSize: 22 }} />,
                  action: "create",
                  data: { type: "category" },
                },
                {
                  label: "View Categories",
                  description: "Browse all categories",
                  icon: <ViewIcon sx={{ color: "#4caf50", fontSize: 22 }} />,
                  action: "read",
                  data: { type: "category" },
                },
                {
                  label: "Edit Categories",
                  description: "Update categories",
                  icon: <EditIcon sx={{ color: "#ff9800", fontSize: 22 }} />,
                  action: "update",
                  data: { type: "category" },
                },
                {
                  label: "Delete Categories",
                  description: "Remove categories",
                  icon: <DeleteIcon sx={{ color: "#f44336", fontSize: 22 }} />,
                  action: "delete",
                  data: { type: "category" },
                },
              ])}
            </Box>

            {/* Sales with Working CRUD Dropdown */}
            <Box
              ref={salesRef}
              onMouseEnter={() => handleDropdownHover("sales", true)}
              onMouseLeave={() => handleDropdownHover("sales", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<SalesIcon sx={{ fontSize: 22 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.3s ease-in-out",
                      transform: salesDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 3}
                className="has-dropdown"
              >
                Sales
              </AdminNavButton>

              {renderCRUDDropdown("sales", salesDropdownOpen, salesRef, [
                {
                  label: "New Sale",
                  description: "Create sales order",
                  icon: <AddIcon sx={{ color: "#2196f3", fontSize: 22 }} />,
                  action: "create",
                  data: { type: "sale" },
                },
                {
                  label: "View Sales",
                  description: "Browse all sales",
                  icon: <ViewIcon sx={{ color: "#4caf50", fontSize: 22 }} />,
                  action: "read",
                  data: { type: "sale" },
                },
                {
                  label: "Edit Orders",
                  description: "Modify orders",
                  icon: <EditIcon sx={{ color: "#ff9800", fontSize: 22 }} />,
                  action: "update",
                  data: { type: "sale" },
                },
                {
                  label: "Cancel Orders",
                  description: "Remove orders",
                  icon: <DeleteIcon sx={{ color: "#f44336", fontSize: 22 }} />,
                  action: "delete",
                  data: { type: "sale" },
                },
              ])}
            </Box>

            {/* Inventory with Working CRUD Dropdown */}
            <Box
              ref={inventoryRef}
              onMouseEnter={() => handleDropdownHover("inventory", true)}
              onMouseLeave={() => handleDropdownHover("inventory", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<Inventory sx={{ fontSize: 22 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.3s ease-in-out",
                      transform: inventoryDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 4}
                className="has-dropdown"
              >
                Inventory
              </AdminNavButton>

              {renderCRUDDropdown("inventory", inventoryDropdownOpen, inventoryRef, [
                {
                  label: "Add Stock",
                  description: "Increase inventory",
                  icon: <AddIcon sx={{ color: "#2196f3", fontSize: 22 }} />,
                  action: "create",
                  data: { type: "stock" },
                },
                {
                  label: "View Inventory",
                  description: "Check stock levels",
                  icon: <ViewIcon sx={{ color: "#4caf50", fontSize: 22 }} />,
                  action: "read",
                  data: { type: "stock" },
                },
                {
                  label: "Update Stock",
                  description: "Adjust quantities",
                  icon: <EditIcon sx={{ color: "#ff9800", fontSize: 22 }} />,
                  action: "update",
                  data: { type: "stock" },
                },
                {
                  label: "Remove Stock",
                  description: "Handle damaged items",
                  icon: <DeleteIcon sx={{ color: "#f44336", fontSize: 22 }} />,
                  action: "delete",
                  data: { type: "stock" },
                },
              ])}
            </Box>

            {/* Suppliers with Working CRUD Dropdown */}
            <Box
              ref={suppliersRef}
              onMouseEnter={() => handleDropdownHover("suppliers", true)}
              onMouseLeave={() => handleDropdownHover("suppliers", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<SuppliersIcon sx={{ fontSize: 22 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.3s ease-in-out",
                      transform: suppliersDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 5}
                className="has-dropdown"
              >
                Suppliers
              </AdminNavButton>

              {renderCRUDDropdown("suppliers", suppliersDropdownOpen, suppliersRef, [
                {
                  label: "Add Supplier",
                  description: "Register new vendor",
                  icon: <AddIcon sx={{ color: "#2196f3", fontSize: 22 }} />,
                  action: "create",
                  data: { type: "supplier" },
                },
                {
                  label: "View Suppliers",
                  description: "Browse vendors",
                  icon: <ViewIcon sx={{ color: "#4caf50", fontSize: 22 }} />,
                  action: "read",
                  data: { type: "supplier" },
                },
                {
                  label: "Edit Suppliers",
                  description: "Update vendor info",
                  icon: <EditIcon sx={{ color: "#ff9800", fontSize: 22 }} />,
                  action: "update",
                  data: { type: "supplier" },
                },
                {
                  label: "Remove Suppliers",
                  description: "Deactivate vendors",
                  icon: <DeleteIcon sx={{ color: "#f44336", fontSize: 22 }} />,
                  action: "delete",
                  data: { type: "supplier" },
                },
              ])}
            </Box>

            {/* Sales Agents with Working CRUD Dropdown */}
            <Box
              ref={agentsRef}
              onMouseEnter={() => handleDropdownHover("agents", true)}
              onMouseLeave={() => handleDropdownHover("agents", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<People sx={{ fontSize: 22 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.3s ease-in-out",
                      transform: agentsDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 6}
                className="has-dropdown"
              >
                Sales Agents
              </AdminNavButton>

              {renderCRUDDropdown("agents", agentsDropdownOpen, agentsRef, [
                {
                  label: "Add Agent",
                  description: "Register new agent",
                  icon: <AddIcon sx={{ color: "#2196f3", fontSize: 22 }} />,
                  action: "create",
                  data: { type: "agent" },
                },
                {
                  label: "View Agents",
                  description: "Browse team members",
                  icon: <ViewIcon sx={{ color: "#4caf50", fontSize: 22 }} />,
                  action: "read",
                  data: { type: "agent" },
                },
                {
                  label: "Edit Agents",
                  description: "Update agent info",
                  icon: <EditIcon sx={{ color: "#ff9800", fontSize: 22 }} />,
                  action: "update",
                  data: { type: "agent" },
                },
                {
                  label: "Remove Agents",
                  description: "Deactivate agents",
                  icon: <DeleteIcon sx={{ color: "#f44336", fontSize: 22 }} />,
                  action: "delete",
                  data: { type: "agent" },
                },
              ])}
            </Box>
          </Box>
        </Box>
      </AppBar>

      {/* Enhanced Profile Menu */}
      {renderMenu}
    </>
  )
}

export default AdminNavigation
