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
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { FaUserPlus, FaEdit, FaSearch } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { GrFormPrevious, GrFormNext } from "react-icons/gr"
import "./Employees.css"
import axios from "axios"
import toast from "react-hot-toast"


const Employees = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Dialog state
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)

  // Add these state variables after the existing ones
  const [editMode, setEditMode] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Sample Employee data
  const [formData, setFormData] = useState([])

   // Helper function to format date for display
  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return ""

    // If it's already a string in YYYY-MM-DD format, return as is
    if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue
    }

    // If Date is a Date object, convert to YYYY-MM-DD
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split("T")[0]
    }

    // Convert if date is a ISO String 
    if (typeof dateValue === "string") {
      try {
        const date = new Date(dateValue)
        return date.toISOString().split("T")[0]
      } catch (error) {
        return dateValue
      }
    }

    return String(dateValue)
  }

  //get data from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("https://taskflowpro-exop.vercel.app/api/employees/getEmployees")
        if (response.status === 200) {
          console.log("Employee data fetched successfully:", response.data)
          setFormData(response.data)
        }
      } catch (error) {
        console.error("Error fetching Employee data:", error)
        toast.error("Failed to load employee data", { position: "bottom-left" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  //Add Employee
  const [data, setData] = useState({
    employeeName: "",
    phoneNo: "",
    designation: "",
    joinedDate: null,
  })

  // Loading state for add/update operations
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { employeeName, phoneNo, designation, joinedDate } = data

    // Convert Date object to ISO string
    const formattedJoinedDate = joinedDate ? joinedDate.toISOString().split("T")[0] : ""

    try {
      if (editMode && selectedEmployee) {
      
        // Update existing Employee
        const response = await axios.put(`https://taskflowpro-exop.vercel.app/api/employees/updateEmployees/${selectedEmployee._id}`, {
          employeeName,
          phoneNo,
          designation,
          joinedDate: formattedJoinedDate, //YYYY-MM-DD
        },)

        if (response.data.error) {
          toast.error(response.data.error, { position: "bottom-left" })
        } else {
          // Update the Employee in the local state
          setFormData((prev) =>
            prev.map((Employee) =>
              Employee._id === selectedEmployee._id ? { ...Employee, employeeName, phoneNo, designation, joinedDate } : Employee,
            ),
          )
          toast.success("Employee Updated Successfully", { position: "bottom-left" })
          handleClose()
          resetForm()
        }
      } else {
        // Add new Employee (existing code)
        const { data: responseData } = await axios.post("https://taskflowpro-exop.vercel.app/api/employees/addEmployees", {
          employeeName,
          phoneNo,
          designation,
          joinedDate: formattedJoinedDate,
        })

        if (responseData.error) {
          toast.error(responseData.error, { position: "bottom-left" })
        } else {
          setData({
            employeeName: "",
            phoneNo: "",
            designation: "",
            joinedDate: null,
          })
          toast.success("Employee Added Successfully", { position: "bottom-left" })
          setFormData((prev) => [...prev, responseData])
          handleClose()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Operation failed", { position: "bottom-left" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form function
  const resetForm = () => {
    setData({
      employeeName: "",
      phoneNo: "",
      designation: "",
      joinedDate: null,
    })
    setEditMode(false)
    setSelectedEmployee(null)
  }

  // Handle edit Employee
   // When editing, convert string back to Date object
  const handleEditEmployee = (Employee) => {
    setSelectedEmployee(Employee)
    setData({
      employeeName: Employee.employeeName,
      phoneNo: Employee.phoneNo,
      designation: Employee.designation,
      joinedDate: Employee.joinedDate ? new Date(Employee.joinedDate) : null, // Convert string to Date
    })
    setEditMode(true)
    setOpen(true)
  }

  // Handle delete Employee
  const [isDeletingId, setIsDeletingId] = useState(null)

  const handleDeleteEmployee = async (EmployeeId) => {
    
    if (window.confirm("Are you sure you want to delete this Employee?")) {
      setIsDeletingId(EmployeeId)
      try {
        const response = await axios.delete(`https://taskflowpro-exop.vercel.app/api/employees/deleteEmployees/${EmployeeId}`)

        if (response.data.error) {
          toast.error(response.data.error, { position: "bottom-left" })
        } else {
          // Remove Employee from local state
          setFormData((prev) => prev.filter((Employee) => Employee._id !== EmployeeId))
          toast.success("Employee Deleted Successfully", { position: "bottom-left" })
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to delete Employee", { position: "bottom-left" })
      } finally {
        setIsDeletingId(null)
      }
    }
  }

  //Update Employee

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter Employees based on search term
  useEffect(() => {
    const results = formData.filter(
      (EmployeeRec) =>
        EmployeeRec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        EmployeeRec.phoneNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        EmployeeRec.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDateForDisplay(EmployeeRec.joinedDate).includes(searchTerm),
    )
    setFilteredEmployees(results)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm, formData])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Calculate pagination
  const totalItems = filteredEmployees.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)

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

  // Render Employee cards for mobile view
  const renderEmployeeCards = () => {
    return currentItems.map((Employee) => (
      <Card key={Employee._id} className="Employee-card" sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{Employee.employeeName}</Typography>
        <Typography variant="body2">
          <strong>Phone No:</strong> {Employee.phoneNo}
        </Typography>
        <Typography variant="body2">
          <strong>Designation:</strong> {Employee.designation}
        </Typography>
        <Typography variant="body2">
          <strong>Joined Date:</strong> {formatDateForDisplay(Employee.joinedDate)}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            type="button"
            onClick={() => handleEditEmployee(Employee)}
            variant="contained"
            color="success"
            size="small"
            startIcon={<FaEdit />}
            disabled={isDeletingId === Employee._id}
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleDeleteEmployee(Employee._id)}
            variant="outlined"
            color="error"
            size="small"
            startIcon={isDeletingId === Employee._id ? <CircularProgress size={16} color="error" /> : <MdDelete />}
            disabled={isDeletingId === Employee._id}
          >
             {isDeletingId === Employee._id ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Card>
    ))
  }

  // Render Employee table for desktop view
  const renderEmployeeTable = () => {
    return (
      <div className="employeeTableWrapper">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              {!isTablet && <th>Phone No</th>}
              <th>Designation</th>
              {!isTablet && <th>Joined Date</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((Employee) => {
              return (
                <tr key={Employee._id}>
                  <td>{Employee.employeeName}</td>
                  {!isTablet && <td>{Employee.phoneNo}</td>}
                  <td>{Employee.designation}</td>
                  {!isTablet && <td>{formatDateForDisplay(Employee.joinedDate)}</td>}
                  <td>
                    <div className="actions">
                      <Button
                        onClick={() => handleEditEmployee(Employee)}
                        variant="contained"
                        color="success"
                        size={isTablet ? "small" : "medium"}
                        startIcon={<FaEdit />}
                        disabled={isDeletingId === Employee._id}
                      >
                        {!isTablet && "Edit"}
                      </Button>
                      <Button
                        onClick={() => handleDeleteEmployee(Employee._id)}
                        variant="outlined"
                        color="error"
                        size={isTablet ? "small" : "medium"}
                        startIcon={
                          isDeletingId === Employee._id ? <CircularProgress size={16} color="error" /> : <MdDelete />
                        }
                        disabled={isDeletingId === Employee._id}
                      >
                        {!isTablet && (isDeletingId === Employee._id ? 
                        "Deleting..." : "Delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
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
        Loading employee data...
      </Typography>
    </Box>
  )

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3" fontWeight={600}>
              Employees
            </Typography>
            <Typography
              variant="subtitle2"
              component="h6"
              color="textSecondary"
            >
              Dashboard / Employees
            </Typography>
          </CardContent>
        </Card>

        <br />

        {/* Add Employee Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editMode ? "Edit Employee" : "Add Employee"}
            <IconButton style={{ float: "right" }} onClick={handleClose} 
            color="default" disabled={isSubmitting}>
              <IoMdCloseCircle />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ width: "100%" }}>
              <form onSubmit={handleAddEmployee}>
                <TextField
                  size="small"
                  autoFocus
                  type="text"
                  value={data.employeeName}
                  onChange={(e) =>
                    setData({ ...data, employeeName: e.target.value })
                  }
                  label="Employee Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  size="small"
                  label="Phone No"
                  type="text"
                  value={data.phoneNo}
                  onChange={(e) =>
                    setData({ ...data, phoneNo: e.target.value })
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  size="small"
                  label="Designation"
                  type="text"
                  value={data.designation}
                  onChange={(e) =>
                    setData({ ...data, designation: e.target.value })
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />

                {/* Date Picker and Button Container */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <DatePicker
                    label="Joined Date"
                    value={data.joinedDate}
                    onChange={(newValue) =>
                      setData({ ...data, joinedDate: newValue })
                    }
                    // renderInput={(params) => (
                    //   <TextField
                    //     {...params}
                    //     size="small"
                    //     fullWidth
                    //     variant="outlined"
                    //   />
                    // )}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: false,
                        variant: "outlined",
                        disabled: isSubmitting,
                      },
                    }}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    className="btn-lg"
                    variant="contained"
                    color="primary"
                    sx={{ alignSelf: "flex-start" }}
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress 
                    size={16} color="inherit" />}
                  >
                    {isSubmitting ? (editMode ? "Updating..." : 
                    "Adding...") : editMode ? "Update" : "Add"}
                  </Button>
                </Box>
              </form>
            </Stack>
          </DialogContent>
        </Dialog>

        {/* Main Content Card */}
        <Card>
          <CardContent>
            {/* Search and Add Employee Row */}
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
                placeholder="Search Employees..."
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

              {/* Add Employee Button */}
              <Button
                className="btnAddEmployee btn-lg"
                variant="contained"
                onClick={handleOpen}
                startIcon={<FaUserPlus />}
                disabled={isLoading}
                sx={{
                  whiteSpace: "nowrap",
                  minWidth: isMobile ? "100%" : "auto",
                }}
              >
                Add Employee
              </Button>
            </Box>
            
            {/* Loading Screen or Employee List */}
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
            
            {/* Employee List - Table or Cards based on screen size */}
            {isMobile ? renderEmployeeCards() : renderEmployeeTable()}

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
                <Button
                  variant="outlined"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <GrFormPrevious />
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
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
                  Showing {Math.min(itemsPerPage, currentItems.length)} of{" "}
                  {totalItems} items
                </Typography>
              </Box>
            </Box>
             </>
          )}
          </CardContent>
        </Card>
      </LocalizationProvider>
    </>
  );
}

export default Employees