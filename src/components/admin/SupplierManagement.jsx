"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })

  useEffect(() => {
    // Fetch suppliers from API (replace with your actual API endpoint)
    const fetchSuppliers = async () => {
      try {
        // Simulate API call
        const mockSuppliers = [
          { id: 1, name: "Supplier A", contact: "John Doe", email: "john.doe@example.com", address: "123 Main St" },
          { id: 2, name: "Supplier B", contact: "Jane Smith", email: "jane.smith@example.com", address: "456 Oak Ave" },
        ]
        setSuppliers(mockSuppliers)
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        setAlert({ open: true, message: "Error fetching suppliers", severity: "error" })
      }
    }

    fetchSuppliers()
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenDialog = (supplier) => {
    setSelectedSupplier(supplier)
    setName(supplier?.name || "")
    setContact(supplier?.contact || "")
    setEmail(supplier?.email || "")
    setAddress(supplier?.address || "")
    setOpenDialog(true)
    setIsAdd(!supplier)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedSupplier(null)
    setName("")
    setContact("")
    setEmail("")
    setAddress("")
    setIsAdd(false)
  }

  const handleSaveSupplier = async () => {
    try {
      // Simulate API call to update/add supplier
      if (selectedSupplier) {
        // Update existing supplier
        const updatedSuppliers = suppliers.map((supplier) =>
          supplier.id === selectedSupplier.id ? { ...supplier, name, contact, email, address } : supplier,
        )
        setSuppliers(updatedSuppliers)
        setAlert({ open: true, message: "Supplier updated successfully", severity: "success" })
      } else {
        // Add new supplier
        const newSupplier = {
          id: suppliers.length + 1, // Simple ID generation
          name,
          contact,
          email,
          address,
        }
        setSuppliers([...suppliers, newSupplier])
        setAlert({ open: true, message: "Supplier added successfully", severity: "success" })
      }
      handleCloseDialog()
    } catch (error) {
      console.error("Error saving supplier:", error)
      setAlert({ open: true, message: "Error saving supplier", severity: "error" })
    }
  }

  const handleDeleteSupplier = async (id) => {
    try {
      // Simulate API call to delete supplier
      const updatedSuppliers = suppliers.filter((supplier) => supplier.id !== id)
      setSuppliers(updatedSuppliers)
      setAlert({ open: true, message: "Supplier deleted successfully", severity: "success" })
    } catch (error) {
      console.error("Error deleting supplier:", error)
      setAlert({ open: true, message: "Error deleting supplier", severity: "error" })
    }
  }

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setAlert({ ...alert, open: false })
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#f8fafc", minHeight: "100vh", p: 3, overflow: "hidden" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          label="Search Suppliers"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog(null)}>
          Add Supplier
        </Button>
      </Box>

      <TableContainer sx={{ overflow: "auto", maxWidth: "100%" }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {supplier.name}
                </TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" onClick={() => handleOpenDialog(supplier)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDeleteSupplier(supplier.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isAdd ? "Add Supplier" : "Edit Supplier"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="contact"
            label="Contact"
            type="text"
            fullWidth
            variant="standard"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSupplier}>{isAdd ? "Add" : "Save"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SupplierManagement
