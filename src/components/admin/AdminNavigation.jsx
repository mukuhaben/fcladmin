"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
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
  AccountCircle,
  Settings,
  ExitToApp,
  Add as AddIcon,
  List as ListIcon,
  KeyboardArrowDown,
  Visibility as ViewIcon,
  Store as StoreIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import FirstCraftLogo from "../../assets/images/FirstCraft-logo.png"

// Enhanced search bar styling with improved visibility
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "25px",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
  },
  "&:focus-within": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
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
  color: "rgba(255, 255, 255, 0.8)",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
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
      color: "rgba(255, 255, 255, 0.7)",
      opacity: 1,
      fontWeight: 400,
    },
  },
}))

// Enhanced admin navigation button with proper white styling
const AdminNavButton = styled(Button)(({ theme, active }) => ({
  color: active ? "#1976d2" : "rgba(255, 255, 255, 0.95)",
  textTransform: "none",
  fontSize: "0.9rem",
  fontWeight: active ? 700 : 500,
  fontFamily: "'Poppins', sans-serif",
  minHeight: 48,
  padding: "12px 24px",
  margin: "0 4px",
  borderRadius: "25px",
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: active ? "white" : "transparent",
  boxShadow: active ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
  border: active ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
  "&:hover": {
    color: "#1976d2",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
  },
  "&.has-dropdown": {
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    },
  },
  "& .MuiButton-startIcon": {
    marginRight: "8px",
  },
  "& .MuiButton-endIcon": {
    marginLeft: "8px",
  },
}))

// Enhanced dropdown with maximum visibility and proper z-index
const StyledDropdownPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  color: "#333",
  minWidth: 260,
  maxWidth: 320,
  boxShadow: "0 12px 48px rgba(0, 0, 0, 0.3)",
  border: "2px solid #e0e0e0",
  borderRadius: "16px",
  fontFamily: "'Poppins', sans-serif",
  marginTop: "12px",
  overflow: "hidden",
  zIndex: 9999,
  position: "relative",
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: "0.9rem",
  fontWeight: 500,
  padding: "16px 24px",
  transition: "all 0.2s ease-in-out",
  borderBottom: "1px solid #f0f0f0",
  minHeight: "60px",
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: "#f8f9fa",
    transform: "translateX(8px)",
    paddingLeft: "32px",
    boxShadow: "inset 4px 0 0 #2196f3",
  },
  "& .MuiListItemIcon-root": {
    minWidth: "48px",
  },
  "& .MuiListItemText-primary": {
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  "& .MuiListItemText-secondary": {
    fontSize: "0.8rem",
    color: "#666",
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

  // State management for dropdowns and menus
  const [anchorEl, setAnchorEl] = useState(null)
  const [dropdownStates, setDropdownStates] = useState({
    itemMaster: false,
    categories: false,
    sales: false,
    inventory: false,
    suppliers: false,
    agents: false,
  })

  // Refs for dropdown positioning
  const dropdownRefs = {
    itemMaster: useRef(null),
    categories: useRef(null),
    sales: useRef(null),
    inventory: useRef(null),
    suppliers: useRef(null),
    agents: useRef(null),
  }

  const isMenuOpen = Boolean(anchorEl)

  // Enhanced dropdown handlers with proper state management
  const handleDropdownToggle = useCallback((section, isOpen) => {
    setDropdownStates((prev) => ({
      ...prev,
      [section]: isOpen,
    }))
  }, [])

  const handleDropdownClose = useCallback((section) => {
    setDropdownStates((prev) => ({
      ...prev,
      [section]: false,
    }))
  }, [])

  const handleAllDropdownsClose = useCallback(() => {
    setDropdownStates({
      itemMaster: false,
      categories: false,
      sales: false,
      inventory: false,
      suppliers: false,
      agents: false,
    })
  }, [])

  // Enhanced CRUD operation handlers with detailed logging
  const handleCRUDAction = useCallback(
    (action, section, data = null) => {
      console.log(`🔄 CRUD Action: ${action} on ${section}`, data)

      // Close all dropdowns immediately
      handleAllDropdownsClose()

      try {
        // Handle navigation based on action and section
        switch (section) {
          case "itemMaster":
            console.log(`📍 Navigating to Item Master - Action: ${action}`)
            onTabChange(null, 1) // Switch to Item Master tab

            // Use setTimeout to ensure tab change completes first
            setTimeout(() => {
              if (action === "create" && onItemMasterSubTabChange) {
                console.log("🆕 Switching to New Item sub-tab")
                onItemMasterSubTabChange(null, 0) // Switch to New Item sub-tab
              } else if (action === "read" && onItemMasterSubTabChange) {
                console.log("📋 Switching to Manage Items sub-tab")
                onItemMasterSubTabChange(null, 1) // Switch to Manage Items sub-tab
              }
            }, 150)
            break

          case "categories":
            console.log(`📍 Navigating to Categories - Action: ${action}`)
            onTabChange(null, 2)
            break

          case "sales":
            console.log(`📍 Navigating to Sales - Action: ${action}`)
            onTabChange(null, 3)
            break

          case "inventory":
            console.log(`📍 Navigating to Inventory - Action: ${action}`)
            onTabChange(null, 4)
            break

          case "suppliers":
            console.log(`📍 Navigating to Suppliers - Action: ${action}`)
            onTabChange(null, 5)
            break

          case "agents":
            console.log(`📍 Navigating to Sales Agents - Action: ${action}`)
            onTabChange(null, 6)
            break

          default:
            console.warn(`⚠️ Unknown section: ${section}`)
        }

        // Call CRUD operation handler if provided
        if (onCRUDOperation) {
          onCRUDOperation(action, section, data)
        }

        console.log(`✅ Navigation completed for ${section}`)
      } catch (error) {
        console.error(`❌ Error in CRUD action:`, error)
      }
    },
    [onTabChange, onItemMasterSubTabChange, onCRUDOperation, handleAllDropdownsClose],
  )

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    if (onLogout) onLogout()
  }

  const handleNavigateHome = () => {
    navigate("/")
  }

  const handleTabClick = (tabIndex) => {
    console.log(`🎯 Direct tab click: ${tabIndex}`)
    handleAllDropdownsClose()
    onTabChange(null, tabIndex)
  }

  // Enhanced dropdown renderer with improved functionality
  const renderCRUDDropdown = (section, isOpen, anchorRef, items) => (
    <Popper
      open={isOpen}
      anchorEl={anchorRef.current}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
      sx={{
        zIndex: 9999,
        position: "fixed",
      }}
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 12],
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
            padding: 8,
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["bottom-end", "top-start", "top-end"],
          },
        },
      ]}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
          }}
          timeout={300}
        >
          <StyledDropdownPaper elevation={24}>
            <ClickAwayListener onClickAway={() => handleDropdownClose(section)}>
              <MenuList autoFocusItem={isOpen} id={`${section}-menu`} sx={{ py: 1 }}>
                {items.map((item, index) => (
                  <StyledMenuItem
                    key={`${section}-${index}`}
                    onClick={() => {
                      console.log(`🖱️ Dropdown item clicked: ${item.label} in ${section}`)
                      handleCRUDAction(item.action, section, item.data)
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} secondary={item.description} />
                  </StyledMenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </StyledDropdownPaper>
        </Grow>
      )}
    </Popper>
  )

  // Profile menu renderer
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

  // Debug logging for active tab changes
  useEffect(() => {
    console.log(`🎯 Active tab changed to: ${activeTab}`)
  }, [activeTab])

  return (
    <>
      {/* Enhanced Admin Header with improved styling */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#1976d2",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Logo */}
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
                height: 40,
                mr: 2,
              }}
            />
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

          {/* Navigation Icons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNavigateHome}
              title="Go to Customer Store"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                  color: "white",
                },
              }}
            >
              <StoreIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
              <Box sx={{ textAlign: "right", mr: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {currentUser?.username || "admin"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
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
                    width: 36,
                    height: 36,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {currentUser?.username?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>
              </IconButton>
            </Box>
          </Box>
        </Toolbar>

        {/* Enhanced Admin Navigation Tabs */}
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.08)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            px: { xs: 1, sm: 2, md: 4 },
            py: 1.5,
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
            {/* Dashboard - White when active */}
            <AdminNavButton
              startIcon={<Dashboard sx={{ fontSize: 20 }} />}
              active={activeTab === 0}
              onClick={() => handleTabClick(0)}
            >
              Dashboard
            </AdminNavButton>

            {/* Item Master with Enhanced Functional Dropdown */}
            <Box
              ref={dropdownRefs.itemMaster}
              onMouseEnter={() => handleDropdownToggle("itemMaster", true)}
              onMouseLeave={() => handleDropdownToggle("itemMaster", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<ShoppingCart sx={{ fontSize: 20 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.3s ease-in-out",
                      transform: dropdownStates.itemMaster ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 1}
                className="has-dropdown"
              >
                Item Master
              </AdminNavButton>

              {renderCRUDDropdown("itemMaster", dropdownStates.itemMaster, dropdownRefs.itemMaster, [
                {
                  label: "New Item",
                  description: "Create new product",
                  icon: <AddIcon sx={{ color: "#2196f3", fontSize: 22 }} />,
                  action: "create",
                  data: { type: "item" },
                },
                {
                  label: "Manage Items",
                  description: "View and edit products",
                  icon: <ListIcon sx={{ color: "#4caf50", fontSize: 22 }} />,
                  action: "read",
                  data: { type: "item" },
                },
              ])}
            </Box>

            {/* Categories with Enhanced Dropdown */}
            <Box
              ref={dropdownRefs.categories}
              onMouseEnter={() => handleDropdownToggle("categories", true)}
              onMouseLeave={() => handleDropdownToggle("categories", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<CategoryIcon sx={{ fontSize: 20 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.3s ease-in-out",
                      transform: dropdownStates.categories ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 2}
                className="has-dropdown"
              >
                Categories
              </AdminNavButton>

              {renderCRUDDropdown("categories", dropdownStates.categories, dropdownRefs.categories, [
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
              ])}
            </Box>

            {/* Sales with Enhanced Dropdown */}
            <Box
              ref={dropdownRefs.sales}
              onMouseEnter={() => handleDropdownToggle("sales", true)}
              onMouseLeave={() => handleDropdownToggle("sales", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<SalesIcon sx={{ fontSize: 20 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.3s ease-in-out",
                      transform: dropdownStates.sales ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 3}
                className="has-dropdown"
              >
                Sales
              </AdminNavButton>

              {renderCRUDDropdown("sales", dropdownStates.sales, dropdownRefs.sales, [
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
              ])}
            </Box>

            {/* Inventory with Enhanced Dropdown */}
            <Box
              ref={dropdownRefs.inventory}
              onMouseEnter={() => handleDropdownToggle("inventory", true)}
              onMouseLeave={() => handleDropdownToggle("inventory", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<Inventory sx={{ fontSize: 20 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.3s ease-in-out",
                      transform: dropdownStates.inventory ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 4}
                className="has-dropdown"
              >
                Inventory
              </AdminNavButton>

              {renderCRUDDropdown("inventory", dropdownStates.inventory, dropdownRefs.inventory, [
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
              ])}
            </Box>

            {/* Suppliers with Enhanced Dropdown */}
            <Box
              ref={dropdownRefs.suppliers}
              onMouseEnter={() => handleDropdownToggle("suppliers", true)}
              onMouseLeave={() => handleDropdownToggle("suppliers", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<SuppliersIcon sx={{ fontSize: 20 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.3s ease-in-out",
                      transform: dropdownStates.suppliers ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 5}
                className="has-dropdown"
              >
                Suppliers
              </AdminNavButton>

              {renderCRUDDropdown("suppliers", dropdownStates.suppliers, dropdownRefs.suppliers, [
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
              ])}
            </Box>

            {/* Sales Agents with Enhanced Dropdown */}
            <Box
              ref={dropdownRefs.agents}
              onMouseEnter={() => handleDropdownToggle("agents", true)}
              onMouseLeave={() => handleDropdownToggle("agents", false)}
              sx={{ position: "relative" }}
            >
              <AdminNavButton
                startIcon={<People sx={{ fontSize: 20 }} />}
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.3s ease-in-out",
                      transform: dropdownStates.agents ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                }
                active={activeTab === 6}
                className="has-dropdown"
              >
                Sales Agents
              </AdminNavButton>

              {renderCRUDDropdown("agents", dropdownStates.agents, dropdownRefs.agents, [
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
