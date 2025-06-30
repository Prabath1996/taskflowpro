import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material"
import { FaEdit, FaSearch} from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"
import { MdDelete, MdLocalShipping } from "react-icons/md"
import { GrFormPrevious, GrFormNext } from "react-icons/gr"
import "./Suppliers.css"
import axios from "axios"
import toast from "react-hot-toast"

const Supplier = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Dialog state
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)

  // Edit mode state
  const [editMode, setEditMode] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  // Supplier data
  const [formData, setFormData] = useState([])

  // Get data from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch supplier data
        const supplierResponse = await axios.get("https://taskflowpro-exop.vercel.app/api/suppliers/getSuppliers")
        if (supplierResponse.status === 200) {
          console.log("Supplier data fetched successfully:")
          setFormData(supplierResponse.data.suppliers)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load supplier data", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Add Supplier
  const [data, setData] = useState({
    supplierName: "",
    address: "",
    phoneNo: "",
    email: "",
  })

  // Loading state for add/update operations
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddSupplier = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { supplierName, address, phoneNo, email } = data

    try {
      if (editMode && selectedSupplier) {
        // Update existing Supplier
        const { data: responseData } = await axios.put(
          `https://taskflowpro-exop.vercel.app/api/suppliers/updateSupplier/${selectedSupplier._id}`,
          {
            supplierName,
            address,
            phoneNo,
            email,
          },
        )

        if (responseData.error) {
          toast.error(responseData.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          })
        } else {
          // Update the Supplier in the local state
          setFormData((prev) =>
            prev.map((supplier) =>
              supplier._id === selectedSupplier._id
                ? {
                    ...supplier,
                    supplierName,
                    address,
                    phoneNo,
                    email,
                  }
                : supplier,
            ),
          )
          toast.success("Supplier Updated Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          })
          handleClose()
          resetForm()
        }
      } else {
        // Add new Supplier
        const { data: responseData } = await axios.post(
          "https://taskflowpro-exop.vercel.app/api/suppliers/addSupplier",
          {
            supplierName,
            address,
            phoneNo,
            email,
          },
        )

        if (responseData.error) {
          toast.error(responseData.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          })
        } else {
          resetForm()
          toast.success("Supplier Added Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          })
          setFormData((prev) => [...prev, responseData])
          handleClose()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Operation failed", {
        position: "top-right",
        style: { background: "#f44336", color: "#fff" },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form function
  const resetForm = () => {
    setData({
      supplierName: "",
      address: "",
      phoneNo: "",
      email: "",
    })
    setEditMode(false)
    setSelectedSupplier(null)
  }

  // Handle edit Supplier
  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setData({
      supplierName: supplier.supplierName,
      address: supplier.address,
      phoneNo: supplier.phoneNo,
      email: supplier.email,
    })
    setEditMode(true)
    setOpen(true)
  }

  // Handle delete Supplier
  const [isDeletingId, setIsDeletingId] = useState(null)

  const handleDeleteSupplier = async (supplierId) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      setIsDeletingId(supplierId)
      try {
        const data = await axios.delete(
          `https://taskflowpro-exop.vercel.app/api/suppliers/deleteSupplier/${supplierId}`,
        )

        if (data.error) {
          toast.error(data.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          })
        } else {
          // Remove Supplier from local state
          setFormData((prev) => prev.filter((supplier) => supplier._id !== supplierId))
          toast.success("Supplier Deleted Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          })
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to delete supplier", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        })
      } finally {
        setIsDeletingId(null)
      }
    }
  }

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSuppliers, setFilteredSuppliers] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter Suppliers based on search term
  useEffect(() => {
    const results = formData.filter(
      (supplier) =>
        supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phoneNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSuppliers(results)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm, formData])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Calculate pagination
  const totalItems = filteredSuppliers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Render Supplier cards for mobile view
  const renderSupplierCards = () => {
    if (currentItems.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            width: "100%",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No suppliers found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {searchTerm ? "Try adjusting your search criteria" : "Add your first supplier to get started"}
          </Typography>
        </Box>
      )
    }

    return currentItems.map((supplier) => (
      <Card key={supplier._id} className="supplier-card" sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{supplier.supplierName}</Typography>
        <Typography variant="body2">
          <strong>Address:</strong> {supplier.address}
        </Typography>
        <Typography variant="body2">
          <strong>Phone No:</strong> {supplier.phoneNo}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> {supplier.email}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Button
            type="button"
            onClick={() => handleEditSupplier(supplier)}
            variant="contained"
            color="success"
            size="small"
            startIcon={<FaEdit />}
            disabled={isDeletingId === supplier._id}
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleDeleteSupplier(supplier._id)}
            variant="outlined"
            color="error"
            size="small"
            startIcon={isDeletingId === supplier._id ? <CircularProgress size={16} color="error" /> : <MdDelete />}
            disabled={isDeletingId === supplier._id}
          >
            {isDeletingId === supplier._id ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Card>
    ))
  }

  // Render Supplier table for desktop view
  const renderSupplierTable = () => {
    return (
      <div className="supplierTableWrapper">
        <table>
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Address</th>
              {!isTablet && <th>Phone No</th>}
              {!isTablet && <th>Email</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={isTablet ? "3" : "5"} style={{ textAlign: "center", padding: "40px" }}>
                  <Typography variant="h6" color="textSecondary">
                    No suppliers found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {searchTerm ? "Try adjusting your search criteria" : "Add your first supplier to get started"}
                  </Typography>
                </td>
              </tr>
            ) : (
              currentItems.map((supplier) => {
                return (
                  <tr key={supplier._id}>
                    <td>{supplier.supplierName}</td>
                    <td>{supplier.address}</td>
                    {!isTablet && <td>{supplier.phoneNo}</td>}
                    {!isTablet && <td>{supplier.email}</td>}
                    <td>
                      <div className="actions">
                        <Button
                          onClick={() => handleEditSupplier(supplier)}
                          variant="contained"
                          color="success"
                          size={isTablet ? "small" : "medium"}
                          startIcon={<FaEdit />}
                          disabled={isDeletingId === supplier._id}
                          sx={{ mr: 1 }}
                        >
                          {!isTablet && "Edit"}
                        </Button>
                        <Button
                          onClick={() => handleDeleteSupplier(supplier._id)}
                          variant="outlined"
                          color="error"
                          size={isTablet ? "small" : "medium"}
                          startIcon={
                            isDeletingId === supplier._id ? <CircularProgress size={16} color="error" /> : <MdDelete />
                          }
                          disabled={isDeletingId === supplier._id}
                        >
                          {!isTablet && (isDeletingId === supplier._id ? "Deleting..." : "Delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    )
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  // Loading screen component
  const LoadingScreen = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "300px",
        width: "100%",
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading supplier data...
      </Typography>
    </Box>
  )

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h3" fontWeight={600}>
            Supplier Management
          </Typography>
          <Typography variant="subtitle2" component="h6" color="textSecondary">
            Dashboard / Suppliers
          </Typography>
        </CardContent>
      </Card>

      <br />

      {/* Add Supplier Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? "Edit Supplier" : "Add Supplier"}
          <IconButton style={{ float: "right" }} onClick={handleClose} color="default" disabled={isSubmitting}>
            <IoMdCloseCircle />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ width: "100%" }}>
            <form onSubmit={handleAddSupplier}>
              <TextField
                size="small"
                autoFocus
                type="text"
                value={data.supplierName}
                onChange={(e) => setData({ ...data, supplierName: e.target.value })}
                label="Supplier Name"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                disabled={isSubmitting}
              />

              <TextField
                size="small"
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                multiline
                rows={3}
                disabled={isSubmitting}
              />

              <TextField
                size="small"
                type="tel"
                value={data.phoneNo}
                onChange={(e) => setData({ ...data, phoneNo: e.target.value })}
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                disabled={isSubmitting}
              />

              <TextField
                size="small"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                className="btn-lg"
                variant="contained"
                color="primary"
                sx={{ alignSelf: "flex-start", mt: 2 }}
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={16} color="inherit" />}
              >
                {isSubmitting ? (editMode ? "Updating..." : "Adding...") : editMode ? "Update" : "Add"}
              </Button>
            </form>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Main Content Card */}
      <Card>
        <CardContent>
          {/* Search and Add Supplier Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: 2,
              mb: 3,
            }}
          >
            {/* Search Bar */}
            <TextField
              placeholder="Search Suppliers..."
              variant="outlined"
              size="small"
              fullWidth={isMobile}
              sx={{ maxWidth: isMobile ? "100%" : "300px" }}
              onChange={handleSearchChange}
              value={searchTerm}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
            />

            {/* Add Supplier Button */}
            <Button
              className="btnAddSupplier btn-lg"
              variant="contained"
              onClick={handleOpen}
              startIcon={<MdLocalShipping />
}
              disabled={isLoading}
              sx={{
                whiteSpace: "nowrap",
                minWidth: isMobile ? "100%" : "auto",
              }}
            >
              Add Supplier
            </Button>
          </Box>

          {/* Loading Screen or Supplier List */}
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {/* Supplier List - Table or Cards based on screen size */}
              {isMobile ? renderSupplierCards() : renderSupplierTable()}

              {/* Pagination Controls */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "center" : "center",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <GrFormPrevious />
                  </Button>
                  <Button variant="outlined" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <GrFormNext />
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    gap: isMobile ? 1 : 3,
                    fontSize: "0.875rem",
                  }}
                >
                  <Typography variant="body2">
                    Page {currentPage} of {totalPages || 1}
                  </Typography>
                  <Typography variant="body2">
                    Showing {Math.min(itemsPerPage, currentItems.length)} of {totalItems} items
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Supplier
