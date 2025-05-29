"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  Container,
  Alert,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import {
  Dashboard,
  People,
  ShoppingCart,
  Add,
  Menu as MenuIcon,
  Edit,
  LocationOn,
  Inventory,
  Category as CategoryIcon,
  AttachMoney,
  Business,
  AccountBalance,
  TrendingUp,
  Receipt,
  Warning,
  Search,
  FilterList,
  Download,
  Refresh,
  AccountCircle,
  Settings,
  ExitToApp,
  Delete,
  Visibility,
} from "@mui/icons-material"

import CategoryManagement from "../../../components/admin/CategoryManagement"
import NewItemForm from "../../../components/admin/NewItemForm"
import ManageItems from "../../../components/admin/ManageItems"

// Mock data for sales agents with territory restrictions
const initialAgents = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@firstcraft.com",
    phone: "+254 722 123 456",
    territory: "Westlands",
    salesTarget: 5000000,
    salesAchieved: 3750000,
    customersOnboarded: 25,
    status: "active",
    joinDate: "2023-01-15",
    commission: 8,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@firstcraft.com",
    phone: "+254 733 987 654",
    territory: "Parklands",
    salesTarget: 4000000,
    salesAchieved: 4200000,
    customersOnboarded: 20,
    status: "active",
    joinDate: "2023-03-20",
    commission: 10,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@firstcraft.com",
    phone: "+254 711 555 777",
    territory: "Westlands",
    salesTarget: 3500000,
    salesAchieved: 2100000,
    customersOnboarded: 18,
    status: "inactive",
    joinDate: "2022-11-10",
    commission: 7,
  },
]

// Available territories (initially limited to Westlands and Parklands)
const initialTerritories = ["Westlands", "Parklands"]

// Mock customers data by agent
const customersByAgent = {
  1: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      company: "Tech Corp",
      dateOnboarded: "2023-05-15",
      totalOrders: 12,
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@example.com",
      company: "Design Ltd",
      dateOnboarded: "2023-06-01",
      totalOrders: 8,
    },
    {
      id: 3,
      name: "Carol Brown",
      email: "carol@example.com",
      company: "Marketing Pro",
      dateOnboarded: "2023-06-10",
      totalOrders: 15,
    },
  ],
  2: [
    {
      id: 4,
      name: "David Lee",
      email: "david@example.com",
      company: "Finance Inc",
      dateOnboarded: "2023-05-20",
      totalOrders: 10,
    },
    {
      id: 5,
      name: "Emma Davis",
      email: "emma@example.com",
      company: "Retail Solutions",
      dateOnboarded: "2023-06-05",
      totalOrders: 6,
    },
  ],
  3: [
    {
      id: 6,
      name: "Frank Miller",
      email: "frank@example.com",
      company: "Construction Co",
      dateOnboarded: "2023-04-15",
      totalOrders: 20,
    },
    {
      id: 7,
      name: "Grace Taylor",
      email: "grace@example.com",
      company: "Healthcare Ltd",
      dateOnboarded: "2023-05-01",
      totalOrders: 14,
    },
  ],
}

// Dashboard data
const recentBuyers = [
  { id: 1, name: "John Doe", email: "john@example.com", amount: 150000, status: "completed" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", amount: 89000, status: "pending" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", amount: 234000, status: "completed" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", amount: 67000, status: "processing" },
]

const recentInvoices = [
  { id: "INV001", customer: "John Doe", amount: 150000, date: "2024-01-15", status: "paid" },
  { id: "INV002", customer: "Jane Smith", amount: 89000, date: "2024-01-14", status: "pending" },
  { id: "INV003", customer: "Bob Johnson", amount: 234000, date: "2024-01-13", status: "paid" },
  { id: "INV004", customer: "Alice Brown", amount: 67000, date: "2024-01-12", status: "overdue" },
]

const stockAlerts = [
  { product: "Chair", stock: 5, minStock: 10, status: "low" },
  { product: "T-shirts", stock: 2, minStock: 15, status: "critical" },
  { product: "Kitchen Dishes", stock: 8, minStock: 20, status: "low" },
  { product: "Office Desk", stock: 1, minStock: 5, status: "critical" },
]

// Initial categories
const initialCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    subCategories: [
      { id: 101, name: "Laptops", description: "Portable computers" },
      { id: 102, name: "Smartphones", description: "Mobile phones with advanced features" },
      { id: 103, name: "Accessories", description: "Electronic accessories" },
    ],
  },
  {
    id: 2,
    name: "Office Supplies",
    description: "Supplies for office use",
    subCategories: [
      { id: 201, name: "Paper Products", description: "Paper, notebooks, etc." },
      { id: 202, name: "Writing Instruments", description: "Pens, pencils, markers" },
    ],
  },
  {
    id: 3,
    name: "Furniture",
    description: "Office and home furniture",
    subCategories: [
      { id: 301, name: "Office Chairs", description: "Chairs for office use" },
      { id: 302, name: "Desks", description: "Work desks and tables" },
      { id: 303, name: "Storage", description: "Storage solutions" },
    ],
  },
]

const DRAWER_WIDTH = 240

const AdminPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
  const navigate = useNavigate()

  // State management
  const [activeView, setActiveView] = useState("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [agentDialog, setAgentDialog] = useState(false)
  const [territoryDialog, setTerritoryDialog] = useState(false)
  const [customerDialog, setCustomerDialog] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [editAgent, setEditAgent] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  // Data state
  const [agents, setAgents] = useState(initialAgents)
  const [territories, setTerritories] = useState(initialTerritories)
  const [newTerritory, setNewTerritory] = useState("")
  const [categories, setCategories] = useState(initialCategories)

  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)

      // Check if user is admin
      if (!user.isAdmin && !user.email?.includes("admin")) {
        navigate("/")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  // Agent form state
  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    phone: "",
    territory: "",
    salesTarget: "",
    commission: "",
    status: "active",
  })

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Handle agent form
  const handleAgentFormChange = (e) => {
    const { name, value } = e.target
    setAgentForm({
      ...agentForm,
      [name]: value,
    })
  }

  // Handle agent form submit
  const handleAgentSubmit = () => {
    const newAgent = {
      id: editAgent ? editAgent.id : Date.now(),
      name: agentForm.name,
      email: agentForm.email,
      phone: agentForm.phone,
      territory: agentForm.territory,
      salesTarget: Number.parseInt(agentForm.salesTarget),
      commission: Number.parseInt(agentForm.commission),
      status: agentForm.status,
      salesAchieved: editAgent ? editAgent.salesAchieved : 0,
      customersOnboarded: editAgent ? editAgent.customersOnboarded : 0,
      joinDate: editAgent ? editAgent.joinDate : new Date().toISOString().split("T")[0],
    }

    if (editAgent) {
      setAgents(agents.map((agent) => (agent.id === editAgent.id ? newAgent : agent)))
    } else {
      setAgents([...agents, newAgent])
    }

    setAgentForm({ name: "", email: "", phone: "", territory: "", salesTarget: "", commission: "", status: "active" })
    setAgentDialog(false)
    setEditAgent(null)
    setSuccessMessage(editAgent ? "Agent updated successfully!" : "Agent added successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle edit agent
  const handleEditAgent = (agent) => {
    setEditAgent(agent)
    setAgentForm({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      territory: agent.territory,
      salesTarget: agent.salesTarget.toString(),
      commission: agent.commission.toString(),
      status: agent.status,
    })
    setAgentDialog(true)
  }

  // Handle delete agent
  const handleDeleteAgent = (agentId) => {
    setAgents(agents.filter((agent) => agent.id !== agentId))
    setSuccessMessage("Agent removed successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle add territory
  const handleAddTerritory = () => {
    if (newTerritory && !territories.includes(newTerritory)) {
      setTerritories([...territories, newTerritory])
      setNewTerritory("")
      setTerritoryDialog(false)
      setSuccessMessage("Location added successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  // Handle view customers
  const handleViewCustomers = (agent) => {
    setSelectedAgent(agent)
    setCustomerDialog(true)
  }

  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    navigate("/")
  }

  // Handle categories change
  const handleCategoriesChange = (updatedCategories) => {
    setCategories(updatedCategories)
  }

  // Handle new item submission
  const handleNewItemSubmit = (itemData) => {
    console.log("Item submitted:", itemData)
    setSuccessMessage(editingItem ? "Item updated successfully!" : "Item added successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
    setEditingItem(null)
    setActiveView("manage-items")
  }

  // Calculate metrics
  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.status === "active").length
  const totalSalesTarget = agents.reduce((sum, agent) => sum + agent.salesTarget, 0)
  const totalSalesAchieved = agents.reduce((sum, agent) => sum + agent.salesAchieved, 0)
  const totalCustomers = agents.reduce((sum, agent) => sum + agent.customersOnboarded, 0)

  // Filter agents based on search
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.territory.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Helper functions
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return "success"
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "overdue":
        return "error"
      default:
        return "default"
    }
  }

  const getStockStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "error"
      case "low":
        return "warning"
      default:
        return "success"
    }
  }

  // Update the sidebarItems to include hierarchical structure
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
    {
      id: "products",
      label: "Item Master",
      icon: <ShoppingCart />,
      subItems: [
        { id: "new-item", label: "New Item", icon: <Add /> },
        { id: "manage-items", label: "Manage Items", icon: <Edit /> },
      ],
    },
    { id: "categories", label: "Categories", icon: <CategoryIcon /> },
    { id: "sales", label: "Sales", icon: <AttachMoney /> },
    { id: "inventory", label: "Inventory", icon: <Inventory /> },
    { id: "suppliers", label: "Suppliers", icon: <Business /> },
    { id: "accounts", label: "Accounts", icon: <AccountBalance /> },
    { id: "agents", label: "Sales Agents", icon: <People /> },
    { id: "locations", label: "Locations", icon: <LocationOn /> },
  ]

  // Add state for submenu hover
  const [hoveredItem, setHoveredItem] = useState(null)
  const [showItemMaster, setShowItemMaster] = useState(false)

  // Update the drawer content to include hover functionality
  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "#f8f9fa" }}>
      <Box sx={{ p: 3, borderBottom: "1px solid #e9ecef" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2", fontSize: "1.1rem" }}>
          Admin Portal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem", mt: 0.5 }}>
          {currentUser?.username || "Administrator"}
        </Typography>
      </Box>
      <List sx={{ px: 2, py: 2 }}>
        {sidebarItems.map((item) => (
          <Box key={item.id}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={
                  activeView === item.id ||
                  (item.subItems && (activeView === "new-item" || activeView === "manage-items"))
                }
                onClick={() => {
                  if (item.subItems) {
                    setShowItemMaster(!showItemMaster)
                  } else {
                    setActiveView(item.id)
                  }
                }}
                onMouseEnter={() => {
                  if (item.subItems) {
                    setHoveredItem(item.id)
                  }
                }}
                onMouseLeave={() => {
                  if (item.subItems) {
                    setHoveredItem(null)
                  }
                }}
                sx={{
                  borderRadius: 1,
                  py: 1.5,
                  px: 2,
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight:
                      activeView === item.id ||
                      (item.subItems && (activeView === "new-item" || activeView === "manage-items"))
                        ? 600
                        : 400,
                  }}
                />
                {item.subItems && <Box sx={{ ml: 1 }}>{showItemMaster || hoveredItem === item.id ? "▼" : "▶"}</Box>}
              </ListItemButton>
            </ListItem>

            {/* Submenu for Item Master */}
            {item.subItems && (showItemMaster || hoveredItem === item.id) && (
              <Box
                sx={{
                  ml: 2,
                  borderLeft: "2px solid #e3f2fd",
                  pl: 1,
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={activeView === subItem.id}
                      onClick={() => setActiveView(subItem.id)}
                      sx={{
                        borderRadius: 1,
                        py: 1,
                        px: 2,
                        "&.Mui-selected": {
                          backgroundColor: "#1976d2",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#1565c0",
                          },
                          "& .MuiListItemIcon-root": {
                            color: "white",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>{subItem.icon}</ListItemIcon>
                      <ListItemText
                        primary={subItem.label}
                        primaryTypographyProps={{
                          fontSize: "0.8rem",
                          fontWeight: activeView === subItem.id ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </List>
    </Box>
  )

  if (!currentUser) {
    return null
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { lg: DRAWER_WIDTH },
            flexShrink: { lg: 0 },
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                border: "none",
                top: 0,
                height: "100vh",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                border: "none",
                borderRight: "1px solid #e9ecef",
                position: "relative",
                height: "100vh",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
            bgcolor: "#ffffff",
            minHeight: "100vh",
          }}
        >
          {/* Top Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              borderBottom: "1px solid #e9ecef",
              bgcolor: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { lg: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              {/* Update the top bar title logic */}
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
                {activeView === "dashboard" && "Dashboard"}
                {activeView === "agents" && "Sales Agents Management"}
                {activeView === "locations" && "Locations Management"}
                {activeView === "categories" && "Categories Management"}
                {activeView === "sales" && "Sales Management"}
                {activeView === "suppliers" && "Suppliers Management"}
                {activeView === "accounts" && "Accounts Management"}
                {activeView === "products" && "Item Master"}
                {activeView === "new-item" && "Add New Product"}
                {activeView === "manage-items" && "Manage Items"}
                {activeView === "inventory" && "Inventory Management"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {activeView === "agents" && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAgentDialog(true)}
                  sx={{
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                  }}
                >
                  Add Agent
                </Button>
              )}
              {activeView === "locations" && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setTerritoryDialog(true)}
                  sx={{
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                  }}
                >
                  Add Location
                </Button>
              )}
              <IconButton onClick={handleUserMenuOpen}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#1976d2" }}>
                  {currentUser?.username?.charAt(0) || "A"}
                </Avatar>
              </IconButton>
            </Box>
          </Box>

          {/* Content Area */}
          <Box sx={{ p: 3 }}>
            {/* Success Message */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            {/* Dashboard View */}
            {activeView === "dashboard" && (
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                  Admin Dashboard
                </Typography>

                {/* Metrics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Today Invoices",
                      value: "12",
                      change: "+5",
                      icon: <Receipt />,
                      color: "#4CAF50",
                      bgColor: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                    },
                    {
                      title: "Today's Purchase Order",
                      value: "8",
                      change: "+3",
                      icon: <Business />,
                      color: "#2196F3",
                      bgColor: "linear-gradient(135deg, #2196F3 0%, #1976d2 100%)",
                    },
                  ].map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        sx={{
                          background: metric.bgColor,
                          color: "white",
                          height: "140px",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "100px",
                            height: "100px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "50%",
                            transform: "translate(30px, -30px)",
                          },
                        }}
                      >
                        <CardContent sx={{ position: "relative", zIndex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor: "rgba(255,255,255,0.2)",
                              }}
                            >
                              {metric.icon}
                            </Box>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                              {metric.change}
                            </Typography>
                          </Box>
                          <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                            {metric.value}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                            {metric.title}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={3}>
                  {/* Stock Alerts - Full Width */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, height: "400px" }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Warning sx={{ mr: 1 }} />
                        Stock Alerts
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                        {stockAlerts.map((item, index) => (
                          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2, p: 1 }}>
                            <Avatar
                              sx={{
                                bgcolor: getStockStatusColor(item.status) === "error" ? "#f44336" : "#ff9800",
                                mr: 2,
                              }}
                            >
                              <Inventory />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body1" fontWeight="medium">
                                {item.product}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Stock Level: {item.status === "critical" ? "Critical" : "Low"}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${item.stock}/${item.minStock}`}
                              size="small"
                              color={getStockStatusColor(item.status)}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Sales Agents View */}
            {activeView === "agents" && (
              <Box>
                {/* Metrics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                              Total Agents
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                              {totalAgents}
                            </Typography>
                          </Box>
                          <People sx={{ fontSize: 40, color: "#1976d2" }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                              Active Agents
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                              {activeAgents}
                            </Typography>
                          </Box>
                          <TrendingUp sx={{ fontSize: 40, color: "#4caf50" }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                              Sales Target
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                              {(totalSalesTarget / 1000000).toFixed(1)}M
                            </Typography>
                          </Box>
                          <AttachMoney sx={{ fontSize: 40, color: "#ff9800" }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                              Total Customers
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                              {totalCustomers}
                            </Typography>
                          </Box>
                          <People sx={{ fontSize: 40, color: "#9c27b0" }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Search and Actions Bar */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <TextField
                      placeholder="Search agents..."
                      variant="outlined"
                      size="small"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "#666" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        minWidth: { xs: "100%", sm: 300 },
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "white",
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      sx={{
                        textTransform: "none",
                        borderColor: "#ddd",
                        color: "#666",
                        "&:hover": { borderColor: "#1976d2", color: "#1976d2" },
                      }}
                    >
                      Filter
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      sx={{
                        textTransform: "none",
                        borderColor: "#ddd",
                        color: "#666",
                        "&:hover": { borderColor: "#1976d2", color: "#1976d2" },
                      }}
                    >
                      Export
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      sx={{
                        textTransform: "none",
                        borderColor: "#ddd",
                        color: "#666",
                        "&:hover": { borderColor: "#1976d2", color: "#1976d2" },
                      }}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Box>

                {/* Agents Table */}
                <Paper sx={{ overflow: "hidden", border: "1px solid #e9ecef" }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>
                            Agent Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>Territory</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>
                            Sales Target
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>
                            Sales Achieved
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>Customers</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAgents.map((agent) => (
                          <TableRow
                            key={agent.id}
                            hover
                            sx={{
                              "&:hover": { bgcolor: "#f8f9fa" },
                              borderBottom: "1px solid #e9ecef",
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                  sx={{
                                    mr: 2,
                                    bgcolor: "#1976d2",
                                    width: 32,
                                    height: 32,
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {agent.name.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
                                  {agent.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {agent.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {agent.territory}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                KSh {(agent.salesTarget / 1000).toFixed(0)}K
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                KSh {(agent.salesAchieved / 1000).toFixed(0)}K
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleViewCustomers(agent)}
                                sx={{ textTransform: "none" }}
                              >
                                {agent.customersOnboarded}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={agent.status}
                                size="small"
                                color={agent.status === "active" ? "success" : "default"}
                                sx={{ textTransform: "capitalize" }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewCustomers(agent)}
                                  sx={{ color: "#4caf50" }}
                                >
                                  <Visibility />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditAgent(agent)}
                                  sx={{ color: "#ff9800" }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteAgent(agent.id)}
                                  sx={{ color: "#f44336" }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            )}

            {/* Locations View */}
            {activeView === "locations" && (
              <Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Available Locations
                        </Typography>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                          {territories.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total locations configured
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Active Agents
                        </Typography>
                        <Typography variant="h3" color="success.main" fontWeight="bold">
                          {activeAgents}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Agents working in these locations
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Location Management
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    {territories.map((territory, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 2, border: "1px solid #e0e0e0" }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LocationOn sx={{ mr: 1, color: "#1976d2" }} />
                              <Typography variant="body1" fontWeight="medium">
                                {territory}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {agents.filter((agent) => agent.territory === territory).length} agents
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            )}

            {/* Categories View */}
            {activeView === "categories" && (
              <Box>
                <CategoryManagement onCategoriesChange={handleCategoriesChange} />
              </Box>
            )}

            {/* New Item View */}
            {activeView === "new-item" && (
              <Box>
                <NewItemForm categories={categories} onSubmit={handleNewItemSubmit} editItem={editingItem} />
              </Box>
            )}

            {/* Manage Items View */}
            {(activeView === "manage-items" || activeView === "products") && (
              <Box>
                <ManageItems
                  onEditItem={(item) => {
                    setEditingItem(item)
                    setActiveView("new-item")
                  }}
                  onAddNewItem={() => {
                    setEditingItem(null)
                    setActiveView("new-item")
                  }}
                />
              </Box>
            )}

            {/* Placeholder views for other sections */}
            {activeView === "sales" && (
              <Box>
                <Typography variant="h6">Sales Management</Typography>
                <Typography variant="body1" color="text.secondary">
                  Sales management functionality will be implemented here.
                </Typography>
              </Box>
            )}

            {activeView === "suppliers" && (
              <Box>
                <Typography variant="h6">Suppliers Management</Typography>
                <Typography variant="body1" color="text.secondary">
                  Suppliers management functionality will be implemented here.
                </Typography>
              </Box>
            )}

            {activeView === "accounts" && (
              <Box>
                <Typography variant="h6">Accounts Management</Typography>
                <Typography variant="body1" color="text.secondary">
                  Accounts management functionality will be implemented here.
                </Typography>
              </Box>
            )}

            {activeView === "inventory" && (
              <Box>
                <Typography variant="h6">Inventory Management</Typography>
                <Typography variant="body1" color="text.secondary">
                  Inventory management functionality will be implemented here.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add Agent Dialog */}
      <Dialog open={agentDialog} onClose={() => setAgentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editAgent ? "Edit Agent" : "Add New Sales Agent"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Agent Name"
            fullWidth
            variant="outlined"
            value={agentForm.name}
            onChange={handleAgentFormChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={agentForm.email}
            onChange={handleAgentFormChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={agentForm.phone}
            onChange={handleAgentFormChange}
          />
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Territory</InputLabel>
            <Select name="territory" value={agentForm.territory} onChange={handleAgentFormChange} label="Territory">
              {territories.map((territory) => (
                <MenuItem key={territory} value={territory}>
                  {territory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="salesTarget"
            label="Sales Target (KSh)"
            type="number"
            fullWidth
            variant="outlined"
            value={agentForm.salesTarget}
            onChange={handleAgentFormChange}
          />
          <TextField
            margin="dense"
            name="commission"
            label="Commission Rate (%)"
            type="number"
            fullWidth
            variant="outlined"
            value={agentForm.commission}
            onChange={handleAgentFormChange}
          />
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={agentForm.status} onChange={handleAgentFormChange} label="Status">
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAgentDialog(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleAgentSubmit} variant="contained" sx={{ textTransform: "none", fontWeight: 500 }}>
            {editAgent ? "Update Agent" : "Add Agent"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Territory Dialog */}
      <Dialog open={territoryDialog} onClose={() => setTerritoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Location Name"
            fullWidth
            variant="outlined"
            value={newTerritory}
            onChange={(e) => setNewTerritory(e.target.value)}
            placeholder="Enter location name (e.g., Nairobi CBD, Karen, etc.)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTerritoryDialog(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleAddTerritory} variant="contained" sx={{ textTransform: "none", fontWeight: 500 }}>
            Add Location
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Customers Dialog */}
      <Dialog open={customerDialog} onClose={() => setCustomerDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Customers Onboarded by {selectedAgent?.name}</DialogTitle>
        <DialogContent>
          {selectedAgent && customersByAgent[selectedAgent.id] && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date Onboarded</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total Orders</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customersByAgent[selectedAgent.id].map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.company}</TableCell>
                      <TableCell>{customer.dateOnboarded}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCustomerDialog(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Container>
  )
}

export default AdminPage
