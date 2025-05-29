"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  InputAdornment,
  FormHelperText,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { Upload, Add, Delete, Image as ImageIcon, ExpandMore, QrCode } from "@mui/icons-material"

// Initial form state
const initialFormState = {
  productName: "",
  itemCode: "",
  productBarcode: "",
  category: "",
  subCategory: "",
  description: "",
  cashbackRate: "0",
  retailPrice: "", // Supplier price (hidden from customers)
  stockUnits: "",
  alertQuantity: "",
  measurementUnit: "Pieces",
  expiryDate: "",
  image: null,
  imagePreview: null,
  tierPricing: [
    { minQuantity: 1, maxQuantity: 3, price: "" },
    { minQuantity: 4, maxQuantity: 11, price: "" },
    { minQuantity: 12, maxQuantity: 999, price: "" },
  ],
}

const measurementUnits = ["Pieces", "Boxes", "Sets", "Kg", "Liters", "Meters", "Reams", "Packs"]

export default function NewItemForm({ categories = [], onSubmit, editItem = null }) {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [subCategories, setSubCategories] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editItem) {
      setIsEditMode(true)
      setFormData({
        ...editItem,
        tierPricing: editItem.tierPricing || initialFormState.tierPricing,
        imagePreview: editItem.image || null,
      })
    }
  }, [editItem])

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const selectedCategory = categories.find((cat) => cat.name === formData.category)
      if (selectedCategory && selectedCategory.subCategories) {
        setSubCategories(selectedCategory.subCategories)
        if (!selectedCategory.subCategories.some((sub) => sub.name === formData.subCategory)) {
          setFormData((prev) => ({ ...prev, subCategory: "" }))
        }
      } else {
        setSubCategories([])
      }
    } else {
      setSubCategories([])
    }
  }, [formData.category, categories])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: event.target.result,
        })
      }

      reader.readAsDataURL(file)
    }
  }

  const handleTierPricingChange = (index, field, value) => {
    const updatedTierPricing = [...formData.tierPricing]
    updatedTierPricing[index] = {
      ...updatedTierPricing[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      tierPricing: updatedTierPricing,
    })
  }

  const addTierPricing = () => {
    const newTier = {
      minQuantity: "",
      maxQuantity: "",
      price: "",
    }
    setFormData({
      ...formData,
      tierPricing: [...formData.tierPricing, newTier],
    })
  }

  const removeTierPricing = (index) => {
    if (formData.tierPricing.length > 1) {
      const updatedTierPricing = formData.tierPricing.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        tierPricing: updatedTierPricing,
      })
    }
  }

  const generateBarcode = () => {
    // Generate a simple barcode based on item code and timestamp
    const timestamp = Date.now().toString().slice(-6)
    const barcode = `${formData.itemCode || "ITM"}${timestamp}`
    setFormData({
      ...formData,
      productBarcode: barcode,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.productName) newErrors.productName = "Product name is required"
    if (!formData.itemCode) newErrors.itemCode = "Item code is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.stockUnits) newErrors.stockUnits = "Stock units is required"
    if (!formData.retailPrice) newErrors.retailPrice = "Retail price is required"

    // Validate tier pricing
    const tierPricingErrors = []
    formData.tierPricing.forEach((tier, index) => {
      const tierError = {}
      if (!tier.minQuantity) tierError.minQuantity = "Min quantity required"
      if (!tier.maxQuantity) tierError.maxQuantity = "Max quantity required"
      if (!tier.price) tierError.price = "Price required"

      if (Object.keys(tierError).length > 0) {
        tierPricingErrors[index] = tierError
      }
    })

    if (tierPricingErrors.length > 0) {
      newErrors.tierPricing = tierPricingErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const formattedData = {
        id: isEditMode ? editItem.id : Date.now(),
        ...formData,
        cashbackRate: formData.cashbackRate ? Number(formData.cashbackRate) : 0,
        retailPrice: formData.retailPrice ? Number(formData.retailPrice) : 0,
        stockUnits: formData.stockUnits ? Number(formData.stockUnits) : 0,
        alertQuantity: formData.alertQuantity ? Number(formData.alertQuantity) : 0,
        tierPricing: formData.tierPricing.map((tier) => ({
          ...tier,
          minQuantity: Number(tier.minQuantity),
          maxQuantity: Number(tier.maxQuantity),
          price: Number(tier.price),
        })),
        createdAt: isEditMode ? editItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (onSubmit) {
        onSubmit(formattedData)
      } else {
        console.log("Form submitted:", formattedData)
      }
    }
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setErrors({})
    setIsEditMode(false)
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color="#1976d2" gutterBottom>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditMode ? "Update product information" : "Fill in the details to add a new product to your inventory"}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* SECTION 1: BASIC INFORMATION */}
          <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: "#f8f9fa", borderRadius: "8px 8px 0 0" }}>
              <Typography variant="h6" fontWeight="600" color="#1976d2">
                📋 Basic Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Product Name"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    variant="outlined"
                    error={!!errors.productName}
                    helperText={errors.productName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Item Code"
                    name="itemCode"
                    value={formData.itemCode}
                    onChange={handleChange}
                    placeholder="e.g., SW001, KM001"
                    variant="outlined"
                    error={!!errors.itemCode}
                    helperText={errors.itemCode}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel></InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Category</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel></InputLabel>
                    <Select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      label="SubCategory"
                      displayEmpty
                      disabled={!formData.category || subCategories.length === 0}
                    >
                      <MenuItem value="">
                        <em>Select SubCategory</em>
                      </MenuItem>
                      {subCategories.map((subCat) => (
                        <MenuItem key={subCat.id} value={subCat.name}>
                          {subCat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Product Barcode"
                    name="productBarcode"
                    value={formData.productBarcode}
                    onChange={handleChange}
                    placeholder="Enter or generate barcode"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={generateBarcode}
                            startIcon={<QrCode />}
                            sx={{ textTransform: "none" }}
                          >
                            Generate
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Enter detailed product description"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* SECTION 2: PRICING */}
          <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: "#f8f9fa", borderRadius: "8px 8px 0 0" }}>
              <Typography variant="h6" fontWeight="600" color="#1976d2">
                💰 Pricing Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Retail Price (Supplier)"
                    name="retailPrice"
                    type="number"
                    value={formData.retailPrice}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">KSh</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!errors.retailPrice}
                    helperText={errors.retailPrice || "This price is hidden from customers"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cashback Rate"
                    name="cashbackRate"
                    type="number"
                    value={formData.cashbackRate}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!errors.cashbackRate}
                    helperText={errors.cashbackRate}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Bulk-Tier Pricing System
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                    Set different customer prices based on quantity ranges
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                          <TableCell sx={{ fontWeight: 600 }}>Min Qty</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Max Qty</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Customer Price (KSh)</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.tierPricing.map((tier, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                type="number"
                                value={tier.minQuantity}
                                onChange={(e) => handleTierPricingChange(index, "minQuantity", e.target.value)}
                                size="small"
                                error={!!errors.tierPricing?.[index]?.minQuantity}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={tier.maxQuantity}
                                onChange={(e) => handleTierPricingChange(index, "maxQuantity", e.target.value)}
                                size="small"
                                error={!!errors.tierPricing?.[index]?.maxQuantity}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={tier.price}
                                onChange={(e) => handleTierPricingChange(index, "price", e.target.value)}
                                size="small"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">KSh</InputAdornment>,
                                }}
                                error={!!errors.tierPricing?.[index]?.price}
                                sx={{ width: 120 }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => removeTierPricing(index)}
                                disabled={formData.tierPricing.length <= 1}
                                color="error"
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    startIcon={<Add />}
                    onClick={addTierPricing}
                    sx={{ mt: 2, textTransform: "none" }}
                    variant="outlined"
                  >
                    Add Pricing Tier
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* SECTION 3: ADDITIONAL INFORMATION */}
          <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: "#f8f9fa", borderRadius: "8px 8px 0 0" }}>
              <Typography variant="h6" fontWeight="600" color="#1976d2">
                📦 Additional Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Stock Quantity"
                        name="stockUnits"
                        type="number"
                        value={formData.stockUnits}
                        onChange={handleChange}
                        variant="outlined"
                        error={!!errors.stockUnits}
                        helperText={errors.stockUnits}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Alert Quantity"
                        name="alertQuantity"
                        type="number"
                        value={formData.alertQuantity}
                        onChange={handleChange}
                        variant="outlined"
                        helperText="Low stock alert threshold"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Measurement Unit</InputLabel>
                        <Select
                          name="measurementUnit"
                          value={formData.measurementUnit}
                          onChange={handleChange}
                          label="Measurement Unit"
                        >
                          {measurementUnits.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        helperText="Leave empty if not applicable"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Product Photo
                  </Typography>
                  <Card
                    sx={{
                      border: "2px dashed #e0e0e0",
                      textAlign: "center",
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {formData.imagePreview ? (
                      <Box sx={{ width: "100%", height: "100%" }}>
                        <img
                          src={formData.imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "8px",
                          }}
                        />
                        <Button variant="outlined" component="label" size="small" sx={{ textTransform: "none" }}>
                          Change Photo
                          <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <ImageIcon sx={{ fontSize: 48, color: "#bdbdbd", mb: 1 }} />
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<Upload />}
                          sx={{
                            bgcolor: "#1976d2",
                            "&:hover": { bgcolor: "#1565c0" },
                            textTransform: "none",
                            mb: 1,
                          }}
                        >
                          Upload Photo
                          <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                        </Button>
                        <Typography variant="caption" display="block" sx={{ color: "text.secondary" }}>
                          Max 5MB, JPG/PNG
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Submit Buttons */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                mr: 2,
              }}
            >
              {isEditMode ? "Update Product" : "Add Product"}
            </Button>
            {isEditMode && (
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={resetForm}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: 3,
                }}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  )
}
