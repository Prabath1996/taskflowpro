import { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FaTools, FaEdit, FaSearch, FaEye } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import "./Repair.css";
import axios from "axios";
import toast from "react-hot-toast";

const Repair = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // View dialog state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewRepair, setViewRepair] = useState(null);

  // Add these state variables after the existing ones
  const [editMode, setEditMode] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

  // Repair data
  const [formData, setFormData] = useState([]);

  // Customers data for dropdown
  const [customers, setCustomers] = useState([]);

  // Employees data for dropdown
  const [employees, setEmployees] = useState([]);

  // Helper function to format date for display
  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "";

    // If it's already a string in YYYY-MM-DD format, return as is
    if (
      typeof dateValue === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
      return dateValue;
    }

    // If Date is a Date object, convert to YYYY-MM-DD
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split("T")[0];
    }

    // Convert if date is a ISO String
    if (typeof dateValue === "string") {
      try {
        const date = new Date(dateValue);
        return date.toISOString().split("T")[0];
      } catch (error) {
        return dateValue;
      }
    }

    return String(dateValue);
  };

  //get data from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch repair data
        const repairResponse = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/repairs/getRepairs"
        );
        if (repairResponse.status === 200) {
          console.log("Repair data fetched successfully:");
          setFormData(repairResponse.data);
        }

        // Fetch customer data for dropdown
        const customerResponse = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/customers/getCustomers"
        );
        if (customerResponse.status === 200) {
          console.log("Customer data fetched successfully:");
          setCustomers(customerResponse.data);
        }

        // Fetch employee data for dropdown
        const employeeResponse = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/employees/getEmployees"
        );
        if (employeeResponse.status === 200) {
          console.log("Employee data fetched successfully:");
          setEmployees(employeeResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  //Add Repair
  const [data, setData] = useState({
    itemName: "",
    modelNo: "",
    serialNo: "",
    fault: "",
    customerName: "",
    recievedBy: "",
    itemInDate: new Date(),
    itemOutDate: null,
    status: "Pending",
  });

  // Loading state for add/update operations
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRepair = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      itemName,
      modelNo,
      serialNo,
      fault,
      customerName,
      recievedBy,
      itemInDate,
      itemOutDate,
      status,
    } = data;

    // Convert Date objects to ISO strings
    const formattedItemInDate = itemInDate
      ? itemInDate.toISOString().split("T")[0]
      : "";
    const formattedItemOutDate = itemOutDate
      ? itemOutDate.toISOString().split("T")[0]
      : "";

    try {
      if (editMode && selectedRepair) {
        // Update existing Repair
        const response = await axios.put(
          `https://taskflowpro-exop.vercel.app/api/repairs/updateRepairs/${selectedRepair._id}`,
          {
            itemName,
            modelNo,
            serialNo,
            fault,
            customerName,
            recievedBy,
            itemInDate: formattedItemInDate,
            itemOutDate: formattedItemOutDate,
            status,
          }
        );

        if (response.data.error) {
          toast.error(response.data.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          });
        } else {
          // Update the Repair in the local state
          setFormData((prev) =>
            prev.map((repair) =>
              repair._id === selectedRepair._id
                ? {
                    ...repair,
                    itemName,
                    modelNo,
                    serialNo,
                    fault,
                    customerName,
                    recievedBy,
                    itemInDate,
                    itemOutDate,
                    status,
                  }
                : repair
            )
          );
          toast.success("Repair Updated Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
          handleClose();
          resetForm();
        }
      } else {
        // Add new Repair
        const { data: responseData } = await axios.post(
          "https://taskflowpro-exop.vercel.app/api/repairs/addRepairs",
          {
            itemName,
            modelNo,
            serialNo,
            fault,
            customerName,
            recievedBy,
            itemInDate: formattedItemInDate,
            itemOutDate: formattedItemOutDate,
            status,
          }
        );

        if (responseData.error) {
          toast.error(responseData.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          });
        } else {
          resetForm();
          toast.success("Repair Added Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
          setFormData((prev) => [...prev, responseData]);
          handleClose();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Operation failed", {
        position: "top-right",
        style: { background: "#f44336", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setData({
      itemName: "",
      modelNo: "",
      serialNo: "",
      fault: "",
      customerName: "",
      recievedBy: "",
      itemInDate: new Date(),
      itemOutDate: null,
      status: "Pending",
    });
    setEditMode(false);
    setSelectedRepair(null);
  };

  // Handle edit Repair
  const handleEditRepair = (repair) => {
    setSelectedRepair(repair);
    setData({
      itemName: repair.itemName,
      modelNo: repair.modelNo,
      serialNo: repair.serialNo,
      fault: repair.fault,
      customerName: repair.customerName,
      recievedBy: repair.recievedBy,
      itemInDate: repair.itemInDate ? new Date(repair.itemInDate) : new Date(),
      itemOutDate: repair.itemOutDate ? new Date(repair.itemOutDate) : null,
      status: repair.status || "Pending",
    });
    setEditMode(true);
    setOpen(true);
  };

  // Handle view repair
  const handleViewRepair = (repair) => {
    setViewRepair(repair);
    setViewOpen(true);
  };

  // Handle delete Repair
  const [isDeletingId, setIsDeletingId] = useState(null);

  const handleDeleteRepair = async (repairId) => {
    if (window.confirm("Are you sure you want to delete this repair record?")) {
      setIsDeletingId(repairId);
      try {
        const response = await axios.delete(
          `https://taskflowpro-exop.vercel.app/api/repairs/deleteRepairs/${repairId}`
        );

        if (response.data.error) {
          toast.error(response.data.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          });
        } else {
          // Remove Repair from local state
          setFormData((prev) =>
            prev.filter((repair) => repair._id !== repairId)
          );
          toast.success("Repair Record Deleted Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete repair record", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRepairs, setFilteredRepairs] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Repairs based on search term
  useEffect(() => {
    const results = formData.filter(
      (repairRec) =>
        repairRec.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repairRec.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repairRec.serialNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repairRec.customerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        repairRec.fault?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repairRec.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepairs(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, formData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Calculate pagination
  const totalItems = filteredRepairs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRepairs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render Repair cards for mobile view
  const renderRepairCards = () => {
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
            No repair records found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Add your first repair record to get started"}
          </Typography>
        </Box>
      );
    }

    return currentItems.map((repair) => (
      <Card key={repair._id} className="repair-card" sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{repair.itemName}</Typography>
        <Typography variant="body2">
          <strong>Model No:</strong> {repair.modelNo}
        </Typography>
        <Typography variant="body2">
          <strong>Serial No:</strong> {repair.serialNo}
        </Typography>
        <Typography variant="body2">
          <strong>Customer:</strong> {repair.customerName}
        </Typography>
        <Typography variant="body2">
          <strong>Fault:</strong> {repair.fault}
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong>{" "}
          <span
            className={`status-badge ${
              repair.status?.toLowerCase().replace(/\s/g, "") || "pending"
            }`}
          >
            {repair.status || "Pending"}
          </span>
        </Typography>
        <Typography variant="body2">
          <strong>Received By:</strong> {repair.recievedBy}
        </Typography>
        <Typography variant="body2">
          <strong>Item In Date:</strong>{" "}
          {formatDateForDisplay(repair.itemInDate)}
        </Typography>
        {repair.itemOutDate && (
          <Typography variant="body2">
            <strong>Item Out Date:</strong>{" "}
            {formatDateForDisplay(repair.itemOutDate) || "Not Set"}
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Button
            type="button"
            onClick={() => handleViewRepair(repair)}
            variant="contained"
            color="info"
            size="small"
            startIcon={<FaEye />}
          >
            View
          </Button>
          <Button
            type="button"
            onClick={() => handleEditRepair(repair)}
            variant="contained"
            color="success"
            size="small"
            startIcon={<FaEdit />}
            disabled={isDeletingId === repair._id}
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleDeleteRepair(repair._id)}
            variant="outlined"
            color="error"
            size="small"
            startIcon={
              isDeletingId === repair._id ? (
                <CircularProgress size={16} color="error" />
              ) : (
                <MdDelete />
              )
            }
            disabled={isDeletingId === repair._id}
          >
            {isDeletingId === repair._id ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Card>
    ));
  };

  // Render Repair table for desktop view
  const renderRepairTable = () => {
    return (
      <div className="repairTableWrapper">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Model No</th>
              {!isTablet && <th>Serial No</th>}
              <th>Customer</th>
              {!isTablet && <th>Fault</th>}
              <th>Status</th>
              {!isTablet && <th>Received By</th>}
              {!isTablet && <th>Item In Date</th>}
              {!isTablet && <th>Item Out Date</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={isTablet ? "6" : "9"}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No repair records found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Add your first repair record to get started"}
                  </Typography>
                </td>
              </tr>
            ) : (
              currentItems.map((repair) => {
                return (
                  <tr key={repair._id}>
                    <td>{repair.itemName}</td>
                    <td>{repair.modelNo}</td>
                    {!isTablet && <td>{repair.serialNo}</td>}
                    <td>{repair.customerName}</td>
                    {!isTablet && <td>{repair.fault}</td>}
                    <td>
                      <span
                        className={`status-badge ${
                          repair.status?.toLowerCase().replace(/\s/g, "") ||
                          "pending"
                        }`}
                      >
                        {repair.status || "Pending"}
                      </span>
                    </td>
                    {!isTablet && <td>{repair.recievedBy}</td>}
                    {!isTablet && (
                      <td>{formatDateForDisplay(repair.itemInDate)}</td>
                    )}
                    {!isTablet && (
                      <td>
                        {formatDateForDisplay(repair.itemOutDate) || "Not Set"}
                      </td>
                    )}
                    <td>
                      <div className="actions">
                        <Button
                          onClick={() => handleViewRepair(repair)}
                          variant="contained"
                          color="info"
                          size={isTablet ? "small" : "medium"}
                          startIcon={<FaEye />}
                          sx={{ mr: 1 }}
                        >
                          {!isTablet && "View"}
                        </Button>
                        <Button
                          onClick={() => handleEditRepair(repair)}
                          variant="contained"
                          color="success"
                          size={isTablet ? "small" : "medium"}
                          startIcon={<FaEdit />}
                          disabled={isDeletingId === repair._id}
                          sx={{ mr: 1 }}
                        >
                          {!isTablet && "Edit"}
                        </Button>
                        <Button
                          onClick={() => handleDeleteRepair(repair._id)}
                          variant="outlined"
                          color="error"
                          size={isTablet ? "small" : "medium"}
                          startIcon={
                            isDeletingId === repair._id ? (
                              <CircularProgress size={16} color="error" />
                            ) : (
                              <MdDelete />
                            )
                          }
                          disabled={isDeletingId === repair._id}
                        >
                          {!isTablet &&
                            (isDeletingId === repair._id
                              ? "Deleting..."
                              : "Delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewRepair(null);
  };

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
        Loading repair data...
      </Typography>
    </Box>
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3" fontWeight={600}>
              Repair Management
            </Typography>
            <Typography
              variant="subtitle2"
              component="h6"
              color="textSecondary"
            >
              Dashboard / Repairs
            </Typography>
          </CardContent>
        </Card>

        <br />

        {/* Add Repair Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editMode ? "Edit Repair Record" : "Add Repair Record"}
            <IconButton
              style={{ float: "right" }}
              onClick={handleClose}
              color="default"
              disabled={isSubmitting}
            >
              <IoMdCloseCircle />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ width: "100%" }}>
              <form onSubmit={handleAddRepair}>
                <TextField
                  size="small"
                  autoFocus
                  type="text"
                  value={data.itemName}
                  onChange={(e) =>
                    setData({ ...data, itemName: e.target.value })
                  }
                  label="Item Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  size="small"
                  label="Model No"
                  type="text"
                  value={data.modelNo}
                  onChange={(e) =>
                    setData({ ...data, modelNo: e.target.value })
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  size="small"
                  label="Serial No"
                  type="text"
                  value={data.serialNo}
                  onChange={(e) =>
                    setData({ ...data, serialNo: e.target.value })
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  size="small"
                  label="Fault Description"
                  type="text"
                  value={data.fault}
                  onChange={(e) => setData({ ...data, fault: e.target.value })}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  disabled={isSubmitting}
                />

                {/* Customer Selection */}
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="customer-select-label">Customer</InputLabel>
                  <Select
                    labelId="customer-select-label"
                    id="customer-select"
                    value={data.customerName}
                    label="Customer"
                    onChange={(e) =>
                      setData({ ...data, customerName: e.target.value })
                    }
                    disabled={isSubmitting}
                  >
                    {customers.map((customer) => (
                      <MenuItem
                        key={customer._id}
                        value={customer.customerName}
                      >
                        {customer.customerName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Employee Selection */}
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="employee-select-label">
                    Received By
                  </InputLabel>
                  <Select
                    labelId="employee-select-label"
                    id="employee-select"
                    value={data.recievedBy}
                    label="Received By"
                    onChange={(e) =>
                      setData({ ...data, recievedBy: e.target.value })
                    }
                    disabled={isSubmitting}
                  >
                    {employees.map((employee) => (
                      <MenuItem
                        key={employee._id}
                        value={employee.employeeName}
                      >
                        {employee.employeeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Status Selection */}
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={data.status}
                    label="Status"
                    onChange={(e) =>
                      setData({ ...data, status: e.target.value })
                    }
                    disabled={isSubmitting}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>

                {/* Date Pickers */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <DatePicker
                    label="Item In Date"
                    value={data.itemInDate}
                    onChange={(newValue) =>
                      setData({ ...data, itemInDate: newValue })
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        variant: "outlined",
                        disabled: isSubmitting,
                      },
                    }}
                    disabled={isSubmitting}
                  />

                  <DatePicker
                    label="Item Out Date"
                    value={data.itemOutDate}
                    onChange={(newValue) =>
                      setData({ ...data, itemOutDate: newValue })
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
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
                    sx={{ alignSelf: "flex-start", mt: 2 }}
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting && (
                        <CircularProgress size={16} color="inherit" />
                      )
                    }
                  >
                    {isSubmitting
                      ? editMode
                        ? "Updating..."
                        : "Adding..."
                      : editMode
                      ? "Update"
                      : "Add"}
                  </Button>
                </Box>
              </form>
            </Stack>
          </DialogContent>
        </Dialog>

        {/* View Repair Dialog */}
        <Dialog
          open={viewOpen}
          onClose={handleViewClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Repair Details
            <IconButton
              style={{ float: "right" }}
              onClick={handleViewClose}
              color="default"
            >
              <IoMdCloseCircle />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {viewRepair && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Item Name
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewRepair.itemName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Model No
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewRepair.modelNo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Serial No
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewRepair.serialNo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Customer Name
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewRepair.customerName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Received By
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewRepair.recievedBy}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 1 }}
                      className={`status-badge ${
                        viewRepair.status?.toLowerCase().replace(/\s/g, "") ||
                        "pending"
                      }`}
                    >
                      {viewRepair.status || "Pending"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Item In Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {formatDateForDisplay(viewRepair.itemInDate) || "Not set"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Item Out Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {formatDateForDisplay(viewRepair.itemOutDate) ||
                        "Not set"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fault Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    {viewRepair.fault}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Main Content Card */}
        <Card>
          <CardContent>
            {/* Search and Add Repair Row */}
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
                placeholder="Search Repairs..."
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

              {/* Add Repair Button */}
              <Button
                className="btnAddRepair btn-lg"
                variant="contained"
                onClick={handleOpen}
                startIcon={<FaTools />}
                disabled={isLoading}
                sx={{
                  whiteSpace: "nowrap",
                  minWidth: isMobile ? "100%" : "auto",
                }}
              >
                Add Repair
              </Button>
            </Box>

            {/* Loading Screen or Repair List */}
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <>
                {/* Repair List - Table or Cards based on screen size */}
                {isMobile ? renderRepairCards() : renderRepairTable()}

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
};

export default Repair;
