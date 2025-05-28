"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Fab,
  Paper,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { Add, Edit, Delete, Visibility, Star, Upload, Remove } from "@mui/icons-material"

const initialProducts = [
  {
    id: 1,
    name: "Executive Office Chair",
    itemCode: "EOC001",
    category: "Furniture",
    subCategory: "Office Chairs",
    warehouse: "Main Warehouse",
    retailPrice: 450000,
    purchasePrice: 350000,
    cashback: 5,
    taxRate: 16,
    stockUnits: 25,
    alertQuantity: 5,
    measurementUnit: "Pieces",
    barcode: "1234567890123",
    description: "Comfortable executive chair with lumbar support",
    validToDate: "2025-12-31",
    inStock: true,
    featured: true,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200&query=office chair",
    bulkPricing: [
      { minQty: 10, price: 420000 },
      { minQty: 50, price: 400000 },
    ],
    tierPricing: [
      { tier: "Bronze", price: 450000 },
      { tier: "Silver", price: 430000 },
      { tier: "Gold", price: 410000 },
    ],
  },
  {
    id: 2,
    name: "Wireless Mouse",
    itemCode: "WM002",
    category: "Electronics",
    subCategory: "Computer Accessories",
    warehouse: "Electronics Warehouse",
    retailPrice: 35000,
    purchasePrice: 25000,
    cashback: 3,
    taxRate: 16,
    stockUnits: 150,
    alertQuantity: 20,
    measurementUnit: "Pieces",
    barcode: "2345678901234",
    description: "Ergonomic wireless mouse with long battery life",
    validToDate: "2025-12-31",
    inStock: true,
    featured: false,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200&query=wireless mouse",
    bulkPricing: [
      { minQty: 20, price: 32000 },
      { minQty: 100, price: 30000 },
    ],
    tierPricing: [
      { tier: "Bronze", price: 35000 },
      { tier: "Silver", price: 33000 },
      { tier: "Gold", price: 31000 },
    ],
  },
]

const categories = ["Furniture", "Electronics", "Office Supplies", "Accessories"]
const subCategories = {
  Furniture: ["Office Chairs", "Desks", "Storage", "Seating"],
  Electronics: ["Computer Accessories", "Monitors", "Laptops", "Peripherals"],
  "Office Supplies": ["Stationery", "Paper", "Writing Tools", "Organization"],
  Accessories: ["Cables", "Adapters", "Cases", "Stands"],
}
const warehouses = ["Main Warehouse", "Electronics Warehouse", "Furniture Warehouse", "Supplies Warehouse"]
const measurementUnits = ["Pieces", "Kg", "Liters", "Meters", "Boxes", "Sets"]

export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts)
  const [open, setOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    itemCode: "",
    category: "",
    subCategory: "",
    warehouse: "",
    retailPrice: "",
    purchasePrice: "",
    cashback: "",
    taxRate: "16",
    stockUnits: "",
    alertQuantity: "",
    measurementUnit: "",
    barcode: "",
    description: "",
    validToDate: "",
    inStock: true,
    featured: false,
    bulkPricing: [{ minQty: "", price: "" }],
    tierPricing: [{ tier: "Bronze", price: "" }],
  })

  const handleOpen = (product = null) => {
    if (product) {
      setEditProduct(product)
      setFormData({
        name: product.name,
        itemCode: product.itemCode,
        category: product.category,
        subCategory: product.subCategory,
        warehouse: product.warehouse,
        retailPrice: product.retailPrice.toString(),
        purchasePrice: product.purchasePrice.toString(),
        cashback: product.cashback.toString(),
        taxRate: product.taxRate.toString(),
        stockUnits: product.stockUnits.toString(),
        alertQuantity: product.alertQuantity.toString(),
        measurementUnit: product.measurementUnit,
        barcode: product.barcode,
        description: product.description,
        validToDate: product.validToDate,
        inStock: product.inStock,
        featured: product.featured,
        bulkPricing: product.bulkPricing || [{ minQty: "", price: "" }],
        tierPricing: product.tierPricing || [{ tier: "Bronze", price: "" }],
      })
    } else {
      setEditProduct(null)
      setFormData({
        name: "",
        itemCode: "",
        category: "",
        subCategory: "",
        warehouse: "",
        retailPrice: "",
        purchasePrice: "",
        cashback: "",
        taxRate: "16",
        stockUnits: "",
        alertQuantity: "",
        measurementUnit: "",
        barcode: "",
        description: "",
        validToDate: "",
        inStock: true,
        featured: false,
        bulkPricing: [{ minQty: "", price: "" }],
        tierPricing: [{ tier: "Bronze", price: "" }],
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditProduct(null)
  }

  const handleSubmit = () => {
    const newProduct = {
      id: editProduct ? editProduct.id : Date.now(),
      name: formData.name,
      itemCode: formData.itemCode,
      category: formData.category,
      subCategory: formData.subCategory,
      warehouse: formData.warehouse,
      retailPrice: Number.parseInt(formData.retailPrice),
      purchasePrice: Number.parseInt(formData.purchasePrice),
      cashback: Number.parseInt(formData.cashback),
      taxRate: Number.parseInt(formData.taxRate),
      stockUnits: Number.parseInt(formData.stockUnits),
      alertQuantity: Number.parseInt(formData.alertQuantity),
      measurementUnit: formData.measurementUnit,
      barcode: formData.barcode,
      description: formData.description,
      validToDate: formData.validToDate,
      inStock: formData.inStock,
      featured: formData.featured,
      bulkPricing: formData.bulkPricing.filter((bp) => bp.minQty && bp.price),
      tierPricing: formData.tierPricing.filter((tp) => tp.tier && tp.price),
      image: editProduct ? editProduct.image : "/placeholder.svg?height=200&width=200&query=product",
      rating: editProduct ? editProduct.rating : 4.0,
    }

    if (editProduct) {
      setProducts(products.map((product) => (product.id === editProduct.id ? newProduct : product)))
    } else {
      setProducts([...products, newProduct])
    }

    handleClose()
  }

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const addBulkPricing = () => {
    setFormData({
      ...formData,
      bulkPricing: [...formData.bulkPricing, { minQty: "", price: "" }],
    })
  }

  const removeBulkPricing = (index) => {
    const newBulkPricing = formData.bulkPricing.filter((_, i) => i !== index)
    setFormData({ ...formData, bulkPricing: newBulkPricing })
  }

  const updateBulkPricing = (index, field, value) => {
    const newBulkPricing = [...formData.bulkPricing]
    newBulkPricing[index][field] = value
    setFormData({ ...formData, bulkPricing: newBulkPricing })
  }

  const addTierPricing = () => {
    setFormData({
      ...formData,
      tierPricing: [...formData.tierPricing, { tier: "Bronze", price: "" }],
    })
  }

  const removeTierPricing = (index) => {
    const newTierPricing = formData.tierPricing.filter((_, i) => i !== index)
    setFormData({ ...formData, tierPricing: newTierPricing })
  }

  const updateTierPricing = (index, field, value) => {
    const newTierPricing = [...formData.tierPricing]
    newTierPricing[index][field] = value
    setFormData({ ...formData, tierPricing: newTierPricing })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Item Master
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add New Item
        </Button>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ position: "relative" }}>
                <CardMedia component="img" height="200" image={product.image} alt={product.name} />
                {product.featured && (
                  <Chip
                    icon={<Star />}
                    label="Featured"
                    size="small"
                    color="warning"
                    sx={{ position: "absolute", top: 8, left: 8 }}
                  />
                )}
                {!product.inStock && (
                  <Chip
                    label="Out of Stock"
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                  {product.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Item Code: {product.itemCode}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {product.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip label={product.category} size="small" variant="outlined" sx={{ mb: 1, mr: 1 }} />
                  <Chip label={product.warehouse} size="small" variant="outlined" sx={{ mb: 1 }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatNumber(product.retailPrice)}/=
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="success.main">
                    {product.cashback}% Cashback
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Stock: {product.stockUnits} {product.measurementUnit}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton size="small" onClick={() => handleOpen(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                      <Delete />
                    </IconButton>
                    <IconButton size="small" color="info">
                      <Visibility />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Star sx={{ fontSize: 16, color: "gold" }} />
                    <Typography variant="caption">{product.rating}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>{editProduct ? "Edit Item" : "Add New Item"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Code *"
                value={formData.itemCode}
                onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.category}
                  label="Category *"
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value, subCategory: "" })
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>SubCategory</InputLabel>
                <Select
                  value={formData.subCategory}
                  label="SubCategory"
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  disabled={!formData.category}
                >
                  {formData.category &&
                    subCategories[formData.category]?.map((subCat) => (
                      <MenuItem key={subCat} value={subCat}>
                        {subCat}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Warehouse *</InputLabel>
                <Select
                  value={formData.warehouse}
                  label="Warehouse *"
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse} value={warehouse}>
                      {warehouse}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Measurement Unit</InputLabel>
                <Select
                  value={formData.measurementUnit}
                  label="Measurement Unit"
                  onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
                >
                  {measurementUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Pricing Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Pricing Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Retail Price (UGX) *"
                type="number"
                value={formData.retailPrice}
                onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Purchase Price (UGX)"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cashback (%)"
                type="number"
                value={formData.cashback}
                onChange={(e) => setFormData({ ...formData, cashback: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            {/* Bulk Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Bulk Pricing
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Minimum Quantity</TableCell>
                      <TableCell>Price (UGX)</TableCell>
                      <TableCell width={50}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.bulkPricing.map((bulk, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={bulk.minQty}
                            onChange={(e) => updateBulkPricing(index, "minQty", e.target.value)}
                            placeholder="Min Qty"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={bulk.price}
                            onChange={(e) => updateBulkPricing(index, "price", e.target.value)}
                            placeholder="Price"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => removeBulkPricing(index)}>
                            <Remove />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button startIcon={<Add />} onClick={addBulkPricing} sx={{ mt: 1 }}>
                Add Bulk Pricing
              </Button>
            </Grid>

            {/* Tier Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Tier Pricing
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Tier</TableCell>
                      <TableCell>Price (UGX)</TableCell>
                      <TableCell width={50}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.tierPricing.map((tier, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormControl size="small" fullWidth>
                            <Select
                              value={tier.tier}
                              onChange={(e) => updateTierPricing(index, "tier", e.target.value)}
                            >
                              <MenuItem value="Bronze">Bronze</MenuItem>
                              <MenuItem value="Silver">Silver</MenuItem>
                              <MenuItem value="Gold">Gold</MenuItem>
                              <MenuItem value="Platinum">Platinum</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={tier.price}
                            onChange={(e) => updateTierPricing(index, "price", e.target.value)}
                            placeholder="Price"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => removeTierPricing(index)}>
                            <Remove />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button startIcon={<Add />} onClick={addTierPricing} sx={{ mt: 1 }}>
                Add Tier Pricing
              </Button>
            </Grid>

            {/* Inventory Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Inventory Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Stock Units"
                type="number"
                value={formData.stockUnits}
                onChange={(e) => setFormData({ ...formData, stockUnits: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Alert Quantity"
                type="number"
                value={formData.alertQuantity}
                onChange={(e) => setFormData({ ...formData, alertQuantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valid To Date"
                type="date"
                value={formData.validToDate}
                onChange={(e) => setFormData({ ...formData, validToDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                }
                label="In Stock"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                }
                label="Featured Item"
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Image
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Button variant="outlined" startIcon={<Upload />} component="label">
                Upload Image
                <input type="file" hidden accept="image/*" />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editProduct ? "Update Item" : "Add Item"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => handleOpen()}
      >
        <Add />
      </Fab>
    </Box>
  )
}
