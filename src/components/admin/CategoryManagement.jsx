"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Collapse,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Chip,
} from "@mui/material"
import { Edit, Delete, Visibility, Add } from "@mui/icons-material"

// Updated categories to match office supplies business theme
const initialCategories = [
  {
    id: 1,
    name: "Office Essentials",
    description: "Basic office supplies and stationery",
    totalProducts: 45,
    stockQuantity: 1250,
    subCategories: [
      { id: 101, name: "Paper Products", description: "A4 paper, notebooks, sticky notes" },
      { id: 102, name: "Writing Instruments", description: "Pens, pencils, markers, highlighters" },
      { id: 103, name: "Filing & Organization", description: "Folders, binders, dividers" },
    ],
  },
  {
    id: 2,
    name: "Toners & Inks",
    description: "Printer cartridges and refills",
    totalProducts: 28,
    stockQuantity: 340,
    subCategories: [
      { id: 201, name: "Laser Toners", description: "Toner cartridges for laser printers" },
      { id: 202, name: "Inkjet Cartridges", description: "Ink cartridges for inkjet printers" },
      { id: 203, name: "Refill Kits", description: "Ink and toner refill solutions" },
    ],
  },
  {
    id: 3,
    name: "Office Machines",
    description: "Office equipment and machines",
    totalProducts: 15,
    stockQuantity: 85,
    subCategories: [
      { id: 301, name: "Printers", description: "Inkjet and laser printers" },
      { id: 302, name: "Scanners", description: "Document and photo scanners" },
      { id: 303, name: "Shredders", description: "Paper shredders and accessories" },
      { id: 304, name: "Laminators", description: "Laminating machines and pouches" },
    ],
  },
  {
    id: 4,
    name: "School Supplies",
    description: "Educational and school materials",
    totalProducts: 52,
    stockQuantity: 890,
    subCategories: [
      { id: 401, name: "Student Stationery", description: "Exercise books, pencils, erasers" },
      { id: 402, name: "Art Supplies", description: "Crayons, paints, drawing materials" },
      { id: 403, name: "Educational Tools", description: "Calculators, rulers, protractors" },
    ],
  },
  {
    id: 5,
    name: "Stapling & Punching",
    description: "Binding and hole punching tools",
    totalProducts: 18,
    stockQuantity: 320,
    subCategories: [
      { id: 501, name: "Staplers", description: "Desktop and heavy-duty staplers" },
      { id: 502, name: "Hole Punchers", description: "2-hole and 3-hole punchers" },
      { id: 503, name: "Binding Supplies", description: "Staples, binding combs, rings" },
    ],
  },
  {
    id: 6,
    name: "IT Accessories",
    description: "Computer and technology accessories",
    totalProducts: 35,
    stockQuantity: 425,
    subCategories: [
      { id: 601, name: "Cables & Adapters", description: "USB, HDMI, power cables" },
      { id: 602, name: "Storage Devices", description: "USB drives, external hard drives" },
      { id: 603, name: "Computer Peripherals", description: "Keyboards, mice, webcams" },
    ],
  },
  {
    id: 7,
    name: "Office Furniture",
    description: "Desks, chairs and office furniture",
    totalProducts: 22,
    stockQuantity: 180,
    subCategories: [
      { id: 701, name: "Chairs", description: "Office chairs and seating" },
      { id: 702, name: "Desks & Tables", description: "Office desks and meeting tables" },
      { id: 703, name: "Storage Solutions", description: "Cabinets, shelves, lockers" },
    ],
  },
]

export default function CategoryManagement({ onCategoriesChange }) {
  const [categories, setCategories] = useState(initialCategories)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [subCategoryDialog, setSubCategoryDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "", parentCategory: "" })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Notify parent component when categories change
  useEffect(() => {
    if (onCategoriesChange) {
      onCategoriesChange(categories)
    }
  }, [categories, onCategoriesChange])

  const handleOpenCategoryDialog = (category = null) => {
    setEditMode(!!category)
    setSelectedCategory(category)
    setFormData({
      name: category ? category.name : "",
      description: category ? category.description : "",
      parentCategory: "",
    })
    setCategoryDialog(true)
  }

  const handleOpenSubCategoryDialog = (categoryId = null, subCategory = null) => {
    const category = categoryId ? categories.find((cat) => cat.id === categoryId) : null
    setEditMode(!!subCategory)
    setSelectedCategory(category)
    setSelectedSubCategory(subCategory)
    setFormData({
      name: subCategory ? subCategory.name : "",
      description: subCategory ? subCategory.description : "",
      parentCategory: category ? category.id : "",
    })
    setSubCategoryDialog(true)
  }

  const handleCloseDialog = () => {
    setCategoryDialog(false)
    setSubCategoryDialog(false)
    setFormData({ name: "", description: "", parentCategory: "" })
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setEditMode(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Category name is required")
      return
    }

    try {
      if (editMode) {
        // Update existing category
        const updatedCategories = categories.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, name: formData.name, description: formData.description } : cat,
        )
        setCategories(updatedCategories)
        setSuccessMessage("Category updated successfully")
      } else {
        // Add new category
        const newCategory = {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          totalProducts: 0,
          stockQuantity: 0,
          subCategories: [],
        }
        setCategories([...categories, newCategory])
        setSuccessMessage("Category added successfully")
      }

      handleCloseDialog()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      setErrorMessage("Error saving category: " + error.message)
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  const handleSaveSubCategory = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Subcategory name is required")
      return
    }

    if (!formData.parentCategory) {
      setErrorMessage("Parent category is required")
      return
    }

    try {
      const updatedCategories = categories.map((cat) => {
        if (cat.id === Number(formData.parentCategory)) {
          let updatedSubCategories

          if (editMode && selectedSubCategory) {
            // Update existing subcategory
            updatedSubCategories = cat.subCategories.map((subCat) =>
              subCat.id === selectedSubCategory.id
                ? { ...subCat, name: formData.name, description: formData.description }
                : subCat,
            )
          } else {
            // Add new subcategory
            const newSubCategory = {
              id: Date.now(),
              name: formData.name,
              description: formData.description,
            }
            updatedSubCategories = [...cat.subCategories, newSubCategory]
          }

          return { ...cat, subCategories: updatedSubCategories }
        }
        return cat
      })

      setCategories(updatedCategories)
      setSuccessMessage(editMode ? "Subcategory updated successfully" : "Subcategory added successfully")
      handleCloseDialog()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      setErrorMessage("Error saving subcategory: " + error.message)
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  const handleDeleteCategory = (categoryId) => {
    try {
      const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
      setCategories(updatedCategories)
      setSuccessMessage("Category deleted successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      setErrorMessage("Error deleting category: " + error.message)
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header with Action Buttons */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#1976d2" gutterBottom>
          Product Categories
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Manage your product categories and subcategories for better organization
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenCategoryDialog()}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Add New Category
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleOpenSubCategoryDialog()}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                bgcolor: "rgba(25, 118, 210, 0.04)",
              },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Add New SubCategory
          </Button>
        </Box>
      </Box>

      {/* Success and Error Messages */}
      <Collapse in={!!successMessage}>
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Collapse>

      <Collapse in={!!errorMessage}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Collapse>

      {/* Categories Table */}
      <Paper sx={{ overflow: "hidden", borderRadius: 2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#333", width: "5%" }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#333", width: "30%" }}>
                  Category Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#333", width: "15%" }}>
                  Total Products
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#333", width: "15%" }}>
                  Stock Quantity
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#333", width: "20%" }}>
                  Subcategories
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#333", width: "15%" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category.id} hover sx={{ "&:hover": { bgcolor: "#f8f9fa" } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ color: "#1976d2", fontWeight: 600, mb: 0.5 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.totalProducts}
                      size="small"
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.stockQuantity}
                      size="small"
                      sx={{
                        bgcolor: "#e8f5e8",
                        color: "#2e7d32",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.subCategories.length} subcategories
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          bgcolor: "#4caf50",
                          "&:hover": { bgcolor: "#45a049" },
                          minWidth: "auto",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.75rem",
                          textTransform: "none",
                        }}
                        startIcon={<Visibility sx={{ fontSize: "14px" }} />}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenCategoryDialog(category)}
                        sx={{
                          bgcolor: "#ff9800",
                          "&:hover": { bgcolor: "#f57c00" },
                          minWidth: "auto",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.75rem",
                          textTransform: "none",
                        }}
                        startIcon={<Edit sx={{ fontSize: "14px" }} />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleDeleteCategory(category.id)}
                        sx={{
                          bgcolor: "#f44336",
                          "&:hover": { bgcolor: "#d32f2f" },
                          minWidth: "auto",
                          px: 1,
                          py: 0.5,
                          fontSize: "0.75rem",
                        }}
                      >
                        <Delete sx={{ fontSize: "14px" }} />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Category Dialog */}
      <Dialog open={categoryDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {editMode ? "Edit Category" : "Add New Product Category"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                name="name"
                placeholder="Enter category name"
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                placeholder="Enter category description"
                variant="outlined"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: "none",
              color: "#666",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
              textTransform: "none",
              px: 4,
              fontWeight: 600,
            }}
          >
            {editMode ? "Update Category" : "Add Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={subCategoryDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {editMode ? "Edit Subcategory" : "Add New SubCategory"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SubCategory Name"
                name="name"
                placeholder="Enter subcategory name"
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                placeholder="Enter subcategory description"
                variant="outlined"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <Select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="">
                    <em>Select Parent Category</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: "none",
              color: "#666",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSubCategory}
            variant="contained"
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
              textTransform: "none",
              px: 4,
              fontWeight: 600,
            }}
          >
            {editMode ? "Update SubCategory" : "Add SubCategory"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
