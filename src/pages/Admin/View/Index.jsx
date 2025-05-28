"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  InputAdornment,
  Container,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
} from "@mui/material"
import {
  Dashboard,
  People,
  TrendingUp,
  ShoppingCart,
  Add,
  Search,
  FilterList,
  Download,
  AccountCircle,
  Settings,
  ExitToApp,
  Menu as MenuIcon,
  Edit,
  Delete,
  LocationOn,
  Assignment,
  Visibility,
  Inventory,
} from "@mui/icons-material"

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

// Detailed invoice data
const todayInvoicesDetails = [
  {
    id: "INV001",
    customer: "John Doe",
    customerEmail: "john@example.com",
    date: "2024-01-15",
    time: "10:30 AM",
    amount: 150000,
    status: "paid",
    paymentMethod: "Bank Transfer",
    items: [
      { name: "Office Chair", quantity: 2, unitPrice: 45000, total: 90000 },
      { name: "Desk Lamp", quantity: 3, unitPrice: 15000, total: 45000 },
      { name: "Notebook Set", quantity: 5, unitPrice: 3000, total: 15000 },
    ],
    subtotal: 150000,
    tax: 24000,
    total: 174000,
    paymentDetails: {
      method: "Bank Transfer",
      reference: "TXN123456789",
      bank: "KCB Bank",
      accountNumber: "****1234",
    },
  },
  {
    id: "INV002",
    customer: "Jane Smith",
    customerEmail: "jane@example.com",
    date: "2024-01-15",
    time: "02:15 PM",
    amount: 89000,
    status: "pending",
    paymentMethod: "M-Pesa",
    items: [
      { name: "Printer Paper", quantity: 10, unitPrice: 1200, total: 12000 },
      { name: "Stapler", quantity: 2, unitPrice: 2500, total: 5000 },
      { name: "Filing Cabinet", quantity: 1, unitPrice: 72000, total: 72000 },
    ],
    subtotal: 89000,
    tax: 14240,
    total: 103240,
    paymentDetails: {
      method: "M-Pesa",
      reference: "Pending",
      phone: "+254722123456",
    },
  },
]

// Purchase orders data
const purchaseOrdersData = [
  {
    id: "PO001",
    supplier: "Office Supplies Ltd",
    supplierEmail: "orders@officesupplies.co.ke",
    date: "2024-01-15",
    time: "09:00 AM",
    amount: 250000,
    status: "approved",
    expectedDelivery: "2024-01-20",
    items: [
      { name: "Office Chairs", quantity: 20, unitPrice: 8000, total: 160000 },
      { name: "Desk Sets", quantity: 10, unitPrice: 6000, total: 60000 },
      { name: "Storage Cabinets", quantity: 5, unitPrice: 6000, total: 30000 },
    ],
    subtotal: 250000,
    tax: 40000,
    total: 290000,
    approvedBy: "Admin User",
    notes: "Urgent delivery required for new office setup",
  },
  {
    id: "PO002",
    supplier: "Tech Solutions Kenya",
    supplierEmail: "procurement@techsolutions.co.ke",
    date: "2024-01-15",
    time: "11:30 AM",
    amount: 180000,
    status: "pending",
    expectedDelivery: "2024-01-25",
    items: [
      { name: "Laptops", quantity: 3, unitPrice: 50000, total: 150000 },
      { name: "Mouse Sets", quantity: 10, unitPrice: 1500, total: 15000 },
      { name: "Keyboards", quantity: 10, unitPrice: 1500, total: 15000 },
    ],
    subtotal: 180000,
    tax: 28800,
    total: 208800,
    approvedBy: "Pending Approval",
    notes: "Waiting for budget approval",
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
  // Add these new state variables after the existing state declarations (around line 120)
  const [invoiceDetailsDialog, setInvoiceDetailsDialog] = useState(false)
  const [purchaseOrderDialog, setPurchaseOrderDialog] = useState(false)
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState(null)
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null)

  // Data state
  const [agents, setAgents] = useState(initialAgents)
  const [territories, setTerritories] = useState(initialTerritories)
  const [newTerritory, setNewTerritory] = useState("")

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
      setSuccessMessage("Territory added successfully!")
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

  // Sidebar content
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
    { id: "inventory", label: "Inventory", icon: <Inventory /> },
    { id: "products", label: "Item Master", icon: <ShoppingCart /> },
    { id: "agents", label: "Sales Agents", icon: <People /> },
    { id: "territories", label: "Territories", icon: <LocationOn /> },
    { id: "reports", label: "Reports", icon: <Assignment /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp /> },
  ]

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
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeView === item.id}
              onClick={() => setActiveView(item.id)}
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
                  fontWeight: activeView === item.id ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  // Handle invoice details view
  const handleViewInvoiceDetails = () => {
    setSelectedInvoiceDetails(todayInvoicesDetails)
    setInvoiceDetailsDialog(true)
  }

  // Handle purchase order details view
  const handleViewPurchaseOrders = () => {
    setSelectedPurchaseOrder(purchaseOrdersData)
    setPurchaseOrderDialog(true)
  }

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
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
                {activeView === "dashboard" && "Dashboard"}
                {activeView === "agents" && "Sales Agents Management"}
                {activeView === "territories" && "Territory Management"}
                {activeView === "analytics" && "Analytics & Reports"}
                {activeView === "reports" && "Reports & History"}
                {activeView === "products" && "Item Master"}
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
              {activeView === "territories" && (
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
                  Add Territory
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
                {/* Metric Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      onClick={handleViewInvoiceDetails}
                      sx={{
                        background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                        color: "white",
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                        },
                      }}
                    >
                      <CardContent sx={{ position: "relative", zIndex: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                              12
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              Today's Invoices
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              borderRadius: "50%",
                              p: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Assignment sx={{ fontSize: 32 }} />
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                          +5 from yesterday
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card
                      onClick={handleViewPurchaseOrders}
                      sx={{
                        background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                        color: "white",
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 25px rgba(33, 150, 243, 0.3)",
                        },
                      }}
                    >
                      <CardContent sx={{ position: "relative", zIndex: 2, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                              8
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              Purchase Orders
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              borderRadius: "50%",
                              p: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ShoppingCart sx={{ fontSize: 32 }} />
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                          +3 pending approval
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Two Column Layout - Stock Alerts and Recent Invoices */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box
                          sx={{
                            bgcolor: "#ff9800",
                            borderRadius: "50%",
                            p: 1,
                            mr: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: "white",
                              borderRadius: "50%",
                              width: 0,
                              height: 0,
                              border: "4px solid #ff9800",
                            }}
                          />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          Stock Alerts
                        </Typography>
                      </Box>
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ px: 0, py: 2 }}>
                          <Box
                            sx={{
                              bgcolor: "#ff9800",
                              borderRadius: 2,
                              p: 1.5,
                              mr: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Assignment sx={{ color: "white", fontSize: 24 }} />
                          </Box>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                Chair
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                Stock Level: Low
                              </Typography>
                            }
                          />
                          <Chip
                            label="5/10"
                            size="small"
                            sx={{
                              bgcolor: "#ff9800",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ px: 0, py: 2 }}>
                          <Box
                            sx={{
                              bgcolor: "#f44336",
                              borderRadius: 2,
                              p: 1.5,
                              mr: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Assignment sx={{ color: "white", fontSize: 24 }} />
                          </Box>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                T-shirts
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                Stock Level: Critical
                              </Typography>
                            }
                          />
                          <Chip
                            label="2/15"
                            size="small"
                            sx={{
                              bgcolor: "#f44336",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ px: 0, py: 2 }}>
                          <Box
                            sx={{
                              bgcolor: "#4caf50",
                              borderRadius: 2,
                              p: 1.5,
                              mr: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Assignment sx={{ color: "white", fontSize: 24 }} />
                          </Box>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                Office Supplies
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                Stock Level: Good
                              </Typography>
                            }
                          />
                          <Chip
                            label="25/30"
                            size="small"
                            sx={{
                              bgcolor: "#4caf50",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Sales Agents View */}
            {activeView === "agents" && (
              <Box>
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
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }}>Territory</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }} align="center">
                            Customers
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }} align="center">
                            Performance
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }} align="center">
                            Status
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#333", fontSize: "0.875rem" }} align="center">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAgents.map((agent) => {
                          const performance = (agent.salesAchieved / agent.salesTarget) * 100
                          return (
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
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
                                      {agent.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {agent.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={agent.territory}
                                  size="small"
                                  sx={{
                                    bgcolor: "#e3f2fd",
                                    color: "#1976d2",
                                    fontWeight: 500,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {agent.customersOnboarded}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ minWidth: 100 }}>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    {performance.toFixed(1)}%
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={Math.min(performance, 100)}
                                    color={performance >= 80 ? "success" : performance >= 60 ? "warning" : "error"}
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={agent.status}
                                  size="small"
                                  color={agent.status === "active" ? "success" : "error"}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewCustomers(agent)}
                                  sx={{ mr: 1 }}
                                  title="View Customers"
                                >
                                  <Visibility />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditAgent(agent)}
                                  sx={{ mr: 1 }}
                                  title="Edit Agent"
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteAgent(agent.id)}
                                  title="Remove Agent"
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            )}

            {/* Territories View */}
            {activeView === "territories" && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Available Territories
                      </Typography>
                      <List>
                        {territories.map((territory, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon>
                              <LocationOn color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={territory} />
                            <Typography variant="body2" color="text.secondary">
                              {agents.filter((a) => a.territory === territory).length} agents
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Territory Distribution
                      </Typography>
                      {territories.map((territory) => {
                        const agentCount = agents.filter((a) => a.territory === territory).length
                        const percentage = totalAgents > 0 ? (agentCount / totalAgents) * 100 : 0
                        return (
                          <Box key={territory} sx={{ mb: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography variant="body2">{territory}</Typography>
                              <Typography variant="body2">{agentCount} agents</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        )
                      })}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Analytics View */}
            {activeView === "analytics" && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Analytics & Reports
                </Typography>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Assignment sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Analytics Dashboard Coming Soon
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detailed analytics and reporting features will be available here.
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Reports View */}
            {activeView === "reports" && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Reports & Historical Data
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, textAlign: "center", minHeight: 200 }}>
                      <Assignment sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Invoice History
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        View and download historical invoice data
                      </Typography>
                      <Button variant="contained" sx={{ textTransform: "none" }}>
                        View All Invoices
                      </Button>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, textAlign: "center", minHeight: 200 }}>
                      <ShoppingCart sx={{ fontSize: 64, color: "#2196f3", mb: 2 }} />
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Purchase Order History
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Access past purchase orders and supplier data
                      </Typography>
                      <Button variant="contained" sx={{ textTransform: "none" }}>
                        View All Orders
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Agent Dialog */}
      <Dialog open={agentDialog} onClose={() => setAgentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editAgent ? "Edit Sales Agent" : "Add New Sales Agent"}</DialogTitle>
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
            label="Sales Target (KSH)"
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
      <Dialog open={territoryDialog} onClose={() => setTerritoryDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Territory</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Territory Name"
            fullWidth
            variant="outlined"
            value={newTerritory}
            onChange={(e) => setNewTerritory(e.target.value)}
            placeholder="e.g., Kilimani, Karen, etc."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTerritoryDialog(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleAddTerritory} variant="contained" sx={{ textTransform: "none", fontWeight: 500 }}>
            Add Territory
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Customers Dialog */}
      <Dialog open={customerDialog} onClose={() => setCustomerDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Customers - {selectedAgent?.name} ({selectedAgent?.territory})
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date Onboarded</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Total Orders
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedAgent &&
                  customersByAgent[selectedAgent.id]?.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 2, bgcolor: "#1976d2", width: 32, height: 32 }}>
                            {customer.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {customer.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {customer.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {customer.company}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {customer.dateOnboarded}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {customer.totalOrders}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCustomerDialog(false)} variant="contained" sx={{ textTransform: "none" }}>
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
          My Profile
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
      {/* Invoice Details Dialog */}
      <Dialog open={invoiceDetailsDialog} onClose={() => setInvoiceDetailsDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, borderBottom: "1px solid #e9ecef" }}>Today's Invoices Details</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedInvoiceDetails && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {selectedInvoiceDetails.map((invoice) => (
                  <Grid item xs={12} key={invoice.id}>
                    <Paper sx={{ p: 3, border: "1px solid #e9ecef" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {invoice.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {invoice.date} at {invoice.time}
                          </Typography>
                        </Box>
                        <Chip
                          label={invoice.status}
                          color={invoice.status === "paid" ? "success" : "warning"}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Customer Information
                          </Typography>
                          <Typography variant="body2">
                            <strong>Name:</strong> {invoice.customer}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Email:</strong> {invoice.customerEmail}
                          </Typography>

                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                            Payment Details
                          </Typography>
                          <Typography variant="body2">
                            <strong>Method:</strong> {invoice.paymentDetails.method}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Reference:</strong> {invoice.paymentDetails.reference}
                          </Typography>
                          {invoice.paymentDetails.bank && (
                            <Typography variant="body2">
                              <strong>Bank:</strong> {invoice.paymentDetails.bank}
                            </Typography>
                          )}
                          {invoice.paymentDetails.phone && (
                            <Typography variant="body2">
                              <strong>Phone:</strong> {invoice.paymentDetails.phone}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Order Summary
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                                    Qty
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    Price
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    Total
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {invoice.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">{item.unitPrice.toLocaleString()}/=</TableCell>
                                    <TableCell align="right">{item.total.toLocaleString()}/=</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell colSpan={3} sx={{ fontWeight: 600 }}>
                                    Subtotal
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    {invoice.subtotal.toLocaleString()}/=
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell colSpan={3} sx={{ fontWeight: 600 }}>
                                    Tax (16%)
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    {invoice.tax.toLocaleString()}/=
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell colSpan={3} sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                                    Total
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: 600, fontSize: "1.1rem", color: "primary.main" }}
                                  >
                                    {invoice.total.toLocaleString()}/=
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #e9ecef" }}>
          <Button onClick={() => setInvoiceDetailsDialog(false)} variant="contained" sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Orders Dialog */}
      <Dialog open={purchaseOrderDialog} onClose={() => setPurchaseOrderDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, borderBottom: "1px solid #e9ecef" }}>Purchase Orders Details</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedPurchaseOrder && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {selectedPurchaseOrder.map((po) => (
                  <Grid item xs={12} key={po.id}>
                    <Paper sx={{ p: 3, border: "1px solid #e9ecef" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {po.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {po.date} at {po.time}
                          </Typography>
                        </Box>
                        <Chip
                          label={po.status}
                          color={po.status === "approved" ? "success" : "warning"}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Supplier Information
                          </Typography>
                          <Typography variant="body2">
                            <strong>Name:</strong> {po.supplier}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Email:</strong> {po.supplierEmail}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Expected Delivery:</strong> {po.expectedDelivery}
                          </Typography>

                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                            Approval Details
                          </Typography>
                          <Typography variant="body2">
                            <strong>Approved By:</strong> {po.approvedBy}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Notes:</strong> {po.notes}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Order Summary
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                                    Qty
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    Price
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    Total
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {po.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">{item.unitPrice.toLocaleString()}/=</TableCell>
                                    <TableCell align="right">{item.total.toLocaleString()}/=</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell colSpan={3} sx={{ fontWeight: 600 }}>
                                    Subtotal
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    {po.subtotal.toLocaleString()}/=
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell colSpan={3} sx={{ fontWeight: 600 }}>
                                    Tax (16%)
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    {po.tax.toLocaleString()}/=
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell colSpan={3} sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                                    Total
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: 600, fontSize: "1.1rem", color: "primary.main" }}
                                  >
                                    {po.total.toLocaleString()}/=
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #e9ecef" }}>
          <Button onClick={() => setPurchaseOrderDialog(false)} variant="contained" sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminPage
