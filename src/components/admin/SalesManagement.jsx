"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Badge,
  Tooltip,
  LinearProgress,
} from "@mui/material"
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  ShoppingCart as OrderIcon,
  Receipt as ReceiptIcon,
  Description as InvoiceIcon,
  Group as GroupIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Business as SupplierIcon,
  Category as CategoryIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sales-tabpanel-${index}`}
      aria-labelledby={`sales-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const SalesManagement = () => {
  const [tabValue, setTabValue] = useState(0)
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [receipts, setReceipts] = useState([])
  const [customerOrders, setCustomerOrders] = useState([])
  const [batchingStatus, setBatchingStatus] = useState("idle")
  const [selectedPO, setSelectedPO] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState("")
  const [batchingProgress, setBatchingProgress] = useState(0)
  const [lastBatchTime, setLastBatchTime] = useState(null)

  // Sample data initialization
  useEffect(() => {
    initializeSampleData()
    // Set up automatic batching interval (every 30 minutes in production)
    const batchInterval = setInterval(
      () => {
        processBatchOrders()
      },
      30 * 60 * 1000,
    ) // 30 minutes

    return () => clearInterval(batchInterval)
  }, [])

  const initializeSampleData = () => {
    // Sample customer orders
    const sampleOrders = [
      {
        id: "ORD001",
        customerId: "CUST001",
        customerName: "Paw Pack Ltd",
        items: [
          {
            productCode: "L0202004",
            name: "Afri Multipurpose Labels K11 19*13mm White",
            category: "General Stationery",
            supplier: "Afri Supplies Ltd",
            quantity: 1,
            unitPrice: 50.0,
            taxRate: 16,
          },
          {
            productCode: "P0601005",
            name: "Afri Packing Tape (Brown) 48mm*100Mtr",
            category: "General Stationery",
            supplier: "Afri Supplies Ltd",
            quantity: 1,
            unitPrice: 165.0,
            taxRate: 16,
          },
        ],
        orderDate: new Date(),
        status: "pending",
        location: "Westlands",
      },
      {
        id: "ORD002",
        customerId: "CUST002",
        customerName: "ABC School",
        items: [
          {
            productCode: "C0201003",
            name: "Counter Books KB A4 3 Quire REF 233",
            category: "General Stationery",
            supplier: "KB Stationery Ltd",
            quantity: 5,
            unitPrice: 320.0,
            taxRate: 16,
          },
          {
            productCode: "P0401001",
            name: "Petty Cash Voucher White A6 Ref 283",
            category: "General Stationery",
            supplier: "KB Stationery Ltd",
            quantity: 10,
            unitPrice: 39.0,
            taxRate: 16,
          },
        ],
        orderDate: new Date(),
        status: "pending",
        location: "Parklands",
      },
    ]

    // Sample invoices based on the provided invoice
    const sampleInvoices = [
      {
        id: "INV001",
        invoiceNumber: "KRACU0300001581/2",
        customerId: "CUST001",
        customerName: "Paw Pack Ltd",
        customerAddress: "Ring Road Parklands Opp Apollo Centre\nNairobi K 00100\nKenya",
        customerTaxId: "P052296194R",
        invoiceDate: new Date("2024-11-21"),
        deliveryDate: new Date("2024-11-21"),
        source: "S00004",
        items: [
          {
            productCode: "L0202004",
            description: "Afri Multipurpose Lables K11 19*13mm White",
            quantity: 1,
            unitPrice: 50.0,
            taxRate: 16,
            taxableAmount: 43.1,
            totalAmount: 50.0,
          },
          {
            productCode: "P0601005",
            description: "Afri Packing Tape (Brown) 48mm*100Mtr 701",
            quantity: 1,
            unitPrice: 165.0,
            taxRate: 16,
            taxableAmount: 142.24,
            totalAmount: 165.0,
          },
          {
            productCode: "C0201003",
            description: "Counter Books KB A4 3 Quire REF 233",
            quantity: 1,
            unitPrice: 320.0,
            taxRate: 16,
            taxableAmount: 275.86,
            totalAmount: 320.0,
          },
          {
            productCode: "P0401001",
            description: "Petty Cash Voucher White A6 Ref 283",
            quantity: 6,
            unitPrice: 39.0,
            taxRate: 16,
            taxableAmount: 201.72,
            totalAmount: 234.0,
          },
          {
            productCode: "DELIVERY",
            description: "Westlands Delivery Charges",
            quantity: 1,
            unitPrice: 1.0,
            taxRate: 16,
            taxableAmount: 0.86,
            totalAmount: 1.0,
          },
        ],
        subtotal: 663.78,
        taxAmount: 106.22,
        totalAmount: 770.0,
        paidAmount: 770.0,
        amountDue: 0,
        paymentMethod: "MOBILE MONEY",
        paymentTerms: "Immediate Payment",
        status: "paid",
        scuInfo: {
          date: "2024-11-21",
          time: "15:16:55",
          scuId: "KRACU0300001581",
          receiptNumber: 2,
          itemCount: 5,
          internalData: "UTJK-F4R3-33AP-MHRP-WXYK-5J7Y-KY",
          receiptSignature: "GY52-7NDT-JA7R-5Z7J",
        },
      },
    ]

    setCustomerOrders(sampleOrders)
    setInvoices(sampleInvoices)
  }

  // Purchase Order Batching Logic
  const processBatchOrders = useCallback(async () => {
    if (batchingStatus === "processing") return

    setBatchingStatus("processing")
    setBatchingProgress(0)
    setLastBatchTime(new Date())

    try {
      // Step 1: Get all pending customer orders
      const pendingOrders = customerOrders.filter((order) => order.status === "pending")

      if (pendingOrders.length === 0) {
        setBatchingStatus("idle")
        return
      }

      setBatchingProgress(20)

      // Step 2: Group items by supplier and category
      const supplierGroups = {}

      pendingOrders.forEach((order) => {
        order.items.forEach((item) => {
          const key = `${item.supplier}_${item.category}`
          if (!supplierGroups[key]) {
            supplierGroups[key] = {
              supplier: item.supplier,
              category: item.category,
              items: [],
              totalQuantity: 0,
              totalValue: 0,
            }
          }

          // Check if item already exists in group
          const existingItem = supplierGroups[key].items.find((groupItem) => groupItem.productCode === item.productCode)

          if (existingItem) {
            existingItem.quantity += item.quantity
            existingItem.totalValue += item.quantity * item.unitPrice
          } else {
            supplierGroups[key].items.push({
              ...item,
              totalValue: item.quantity * item.unitPrice,
            })
          }

          supplierGroups[key].totalQuantity += item.quantity
          supplierGroups[key].totalValue += item.quantity * item.unitPrice
        })
      })

      setBatchingProgress(50)

      // Step 3: Generate Purchase Orders for each supplier group
      const newPurchaseOrders = []

      Object.values(supplierGroups).forEach((group, index) => {
        const poNumber = `PO${Date.now()}${index.toString().padStart(3, "0")}`
        const purchaseOrder = {
          id: poNumber,
          poNumber,
          supplier: group.supplier,
          category: group.category,
          items: group.items,
          totalQuantity: group.totalQuantity,
          totalValue: group.totalValue,
          status: "pending",
          createdDate: new Date(),
          expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          emailSent: false,
        }
        newPurchaseOrders.push(purchaseOrder)
      })

      setBatchingProgress(75)

      // Step 4: Send emails to suppliers (simulated)
      for (const po of newPurchaseOrders) {
        await simulateEmailSend(po)
        po.emailSent = true
      }

      setBatchingProgress(90)

      // Step 5: Update states
      setPurchaseOrders((prev) => [...prev, ...newPurchaseOrders])

      // Mark customer orders as processed
      setCustomerOrders((prev) =>
        prev.map((order) =>
          pendingOrders.some((po) => po.id === order.id) ? { ...order, status: "processed" } : order,
        ),
      )

      setBatchingProgress(100)
      setBatchingStatus("completed")

      // Reset status after 3 seconds
      setTimeout(() => {
        setBatchingStatus("idle")
        setBatchingProgress(0)
      }, 3000)
    } catch (error) {
      console.error("Error processing batch orders:", error)
      setBatchingStatus("error")
      setTimeout(() => {
        setBatchingStatus("idle")
        setBatchingProgress(0)
      }, 3000)
    }
  }, [customerOrders, batchingStatus])

  const simulateEmailSend = async (purchaseOrder) => {
    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Email sent to ${purchaseOrder.supplier} for PO ${purchaseOrder.poNumber}`)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleViewPO = (po) => {
    setSelectedPO(po)
    setDialogType("viewPO")
    setDialogOpen(true)
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setDialogType("viewInvoice")
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedPO(null)
    setSelectedInvoice(null)
    setDialogType("")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "sent":
        return "info"
      case "delivered":
        return "success"
      case "cancelled":
        return "error"
      case "paid":
        return "success"
      case "overdue":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: 3, bgcolor: "#1976d2", color: "white" }}>
          <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Sales Management
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Manage Purchase Orders, Invoices, and Receipts
          </Typography>
        </Box>

        {/* Batching Status */}
        {batchingStatus !== "idle" && (
          <Box sx={{ p: 2, bgcolor: "#e3f2fd" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <TimerIcon color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {batchingStatus === "processing" && "Processing batch orders..."}
                {batchingStatus === "completed" && "Batch processing completed successfully!"}
                {batchingStatus === "error" && "Error in batch processing"}
              </Typography>
              {lastBatchTime && (
                <Typography variant="caption" color="text.secondary">
                  Last batch: {lastBatchTime.toLocaleTimeString("en-US", { hour12: false })}
                </Typography>
              )}
            </Box>
            {batchingProgress > 0 && (
              <LinearProgress variant="determinate" value={batchingProgress} sx={{ borderRadius: 1 }} />
            )}
          </Box>
        )}

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="sales management tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              fontFamily: "'Poppins', sans-serif",
            },
          }}
        >
          <Tab icon={<OrderIcon />} label="Purchase Orders" />
          <Tab icon={<InvoiceIcon />} label="Invoices" />
          <Tab icon={<ReceiptIcon />} label="Receipts" />
        </Tabs>
      </Paper>

      {/* Purchase Orders Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Controls */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                    Purchase Order Management
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<RefreshIcon />}
                      onClick={processBatchOrders}
                      disabled={batchingStatus === "processing"}
                      sx={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Process Batch Orders
                    </Button>
                    <Button variant="outlined" startIcon={<AddIcon />} sx={{ fontFamily: "'Poppins', sans-serif" }}>
                      Manual PO
                    </Button>
                  </Box>
                </Box>

                {/* Batch Processing Info */}
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Automated Batching:</strong> Customer orders are automatically batched every 30 minutes.
                    Similar products are grouped by supplier and category, then purchase orders are generated and
                    emailed to suppliers.
                  </Typography>
                </Alert>

                {/* Statistics */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e3f2fd" }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                        {purchaseOrders.length}
                      </Typography>
                      <Typography variant="body2">Total POs</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fff3e0" }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                        {purchaseOrders.filter((po) => po.status === "pending").length}
                      </Typography>
                      <Typography variant="body2">Pending</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e8" }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                        {purchaseOrders.filter((po) => po.emailSent).length}
                      </Typography>
                      <Typography variant="body2">Sent</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fce4ec" }}>
                      <Typography variant="h4" color="error.main" sx={{ fontWeight: 600 }}>
                        {customerOrders.filter((order) => order.status === "pending").length}
                      </Typography>
                      <Typography variant="body2">Pending Orders</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Purchase Orders Table */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif" }}>
                  Purchase Orders
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>PO Number</TableCell>
                        <TableCell>Supplier</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total Value</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchaseOrders.map((po) => (
                        <TableRow key={po.id}>
                          <TableCell sx={{ fontWeight: 500 }}>{po.poNumber}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <SupplierIcon fontSize="small" color="primary" />
                              {po.supplier}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={po.category} size="small" icon={<CategoryIcon />} variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Badge badgeContent={po.items.length} color="primary">
                              <GroupIcon />
                            </Badge>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(po.totalValue)}</TableCell>
                          <TableCell>
                            <Chip
                              label={po.status}
                              color={getStatusColor(po.status)}
                              size="small"
                              icon={po.emailSent ? <CheckIcon /> : <WarningIcon />}
                            />
                          </TableCell>
                          <TableCell>
                            {po.createdDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="View Details">
                                <IconButton size="small" onClick={() => handleViewPO(po)}>
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Send Email">
                                <IconButton size="small" color="primary">
                                  <EmailIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Print">
                                <IconButton size="small">
                                  <PrintIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                      {purchaseOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                            <Typography color="text.secondary">
                              No purchase orders found. Process batch orders to generate POs.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Invoices Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                    Invoice Management
                  </Typography>
                  <Button variant="contained" startIcon={<AddIcon />} sx={{ fontFamily: "'Poppins', sans-serif" }}>
                    Create Invoice
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell sx={{ fontWeight: 500 }}>{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.customerName}</TableCell>
                          <TableCell>
                            {invoice.invoiceDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(invoice.totalAmount)}</TableCell>
                          <TableCell>
                            <Chip label={invoice.status} color={getStatusColor(invoice.status)} size="small" />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="View Invoice">
                                <IconButton size="small" onClick={() => handleViewInvoice(invoice)}>
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Print">
                                <IconButton size="small">
                                  <PrintIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small">
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Receipts Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif" }}>
                  Customer Receipts
                </Typography>
                <Alert severity="info">
                  Receipt management functionality - Customer receipt order summaries will be displayed here.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Purchase Order Details Dialog */}
      <Dialog open={dialogOpen && dialogType === "viewPO"} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Purchase Order Details</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedPO?.poNumber}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPO && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedPO.supplier}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{selectedPO.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(selectedPO.totalValue)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expected Delivery
                  </Typography>
                  <Typography variant="body1">
                    {selectedPO.expectedDelivery.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPO.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontFamily: "monospace" }}>{item.productCode}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(item.totalValue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" startIcon={<EmailIcon />}>
            Send to Supplier
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />}>
            Print
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={dialogOpen && dialogType === "viewInvoice"} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Invoice Details</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedInvoice?.invoiceNumber}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              {/* Company Header */}
              <Box sx={{ textAlign: "center", mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
                  First Craft Ltd
                </Typography>
                <Typography variant="body2">P.O.Box 38869-00623</Typography>
                <Typography variant="body2">Nairobi Kenya</Typography>
                <Typography variant="body2">
                  Email: manager@fcl.co.ke | Website: https://www.fcl.co.ke | KRA Pin: P052130436J
                </Typography>
              </Box>

              {/* Invoice Info */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bill To:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedInvoice.customerName}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {selectedInvoice.customerAddress}
                  </Typography>
                  <Typography variant="body2">Tax ID: {selectedInvoice.customerTaxId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2">
                      <strong>Invoice Date:</strong>{" "}
                      {selectedInvoice.invoiceDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Delivery Date:</strong>{" "}
                      {selectedInvoice.deliveryDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Source:</strong> {selectedInvoice.source}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Items Table */}
              <TableContainer sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Taxes</TableCell>
                      <TableCell>Taxable Amount</TableCell>
                      <TableCell>Total Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            [{item.productCode}] {item.description}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.quantity} Pc</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>({item.taxRate}%)</TableCell>
                        <TableCell>{formatCurrency(item.taxableAmount)}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(item.totalAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Tax Summary */}
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    <strong>Payment terms:</strong> {selectedInvoice.paymentTerms}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Payment Communication:</strong> INV/2024/00018
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Tax Summary
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">16% VAT:</Typography>
                      <Typography variant="body2">{formatCurrency(selectedInvoice.taxAmount)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">{formatCurrency(selectedInvoice.subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Total:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatCurrency(selectedInvoice.totalAmount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">Paid:</Typography>
                      <Typography variant="body2" color="success.main">
                        {formatCurrency(selectedInvoice.paidAmount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">Amount Due:</Typography>
                      <Typography variant="body2" color={selectedInvoice.amountDue > 0 ? "error.main" : "success.main"}>
                        {formatCurrency(selectedInvoice.amountDue)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* SCU Information */}
              {selectedInvoice.scuInfo && (
                <Box sx={{ mt: 3, p: 2, bgcolor: "#e3f2fd", borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    SCU Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Date:</strong> {selectedInvoice.scuInfo.date} {selectedInvoice.scuInfo.time}
                      </Typography>
                      <Typography variant="body2">
                        <strong>SCU ID:</strong> {selectedInvoice.scuInfo.scuId}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Receipt Number:</strong> {selectedInvoice.scuInfo.receiptNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Payment Method:</strong> {selectedInvoice.paymentMethod}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Item Count:</strong> {selectedInvoice.scuInfo.itemCount}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Receipt Signature:</strong> {selectedInvoice.scuInfo.receiptSignature}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="outlined" startIcon={<PrintIcon />}>
            Print
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SalesManagement
