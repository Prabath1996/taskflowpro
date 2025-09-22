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
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FaTools, FaEdit, FaSearch, FaEye, FaPaperPlane } from "react-icons/fa";
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
    invNo: "",
    itemName: "",
    modelNo: "",
    serialNo: "",
    fault: "",
    customerName: "",
    receivedBy: "",
    itemInDate: new Date(),
    itemOutDate: null,
    status: "Received",
  });

  // Loading state for add/update operations
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRepair = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      invNo,
      itemName,
      modelNo,
      serialNo,
      fault,
      customerName,
      receivedBy,
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
            invNo,
            itemName,
            modelNo,
            serialNo,
            fault,
            customerName,
            receivedBy,
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
                    invNo,
                    itemName,
                    modelNo,
                    serialNo,
                    fault,
                    customerName,
                    receivedBy,
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
            invNo,
            itemName,
            modelNo,
            serialNo,
            fault,
            customerName,
            receivedBy,
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
      toast.error(
        error?.response?.data?.error || "Operation failed",
        {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setData({
      invNo: "",
      itemName: "",
      modelNo: "",
      serialNo: "",
      fault: "",
      customerName: "",
      receivedBy: "",
      itemInDate: new Date(),
      itemOutDate: null,
      status: "Received",
    });
    setEditMode(false);
    setSelectedRepair(null);
  };

  // Handle edit Repair
  const handleEditRepair = (repair) => {
    setSelectedRepair(repair);
    setData({
      invNo: repair.invNo || "",
      itemName: repair.itemName,
      modelNo: repair.modelNo,
      serialNo: repair.serialNo,
      fault: repair.fault,
      customerName: repair.customerName,
      receivedBy: repair.receivedBy,
      itemInDate: repair.itemInDate ? new Date(repair.itemInDate) : new Date(),
      itemOutDate: repair.itemOutDate ? new Date(repair.itemOutDate) : null,
      status: repair.status || "Received",
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
        toast.error(
          error?.response?.data?.error || "Failed to delete repair record",
          {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          }
        );
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  // Handle sending repair email
  const handleSendRepairEmail = async (repair) => {
    try {
      const customer =
        customers.find((c) => c.customerName === repair.customerName) || {};
      const email = customer.email;
      if (!email) {
        toast.error("No customer email found!", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
        return;
      }
      await axios.post("https://taskflowpro-exop.vercel.app/api/notify/send", {
        to: email,
        subject: `Repair Completed: ${repair.itemName}`,
        text: `Dear ${repair.customerName},\n\nYour repair for ${repair.itemName} (Model: ${repair.modelNo}, Serial: ${repair.serialNo}) is completed and ready for pickup.\n\nThank you!`,
        html: `
  <div style="font-family: Arial, sans-serif; background: #f4f6fb; padding: 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e7ef;">
      <tr>
        <td style="padding: 24px 32px 16px 32px;">
          <h1 style="color: #1976d2; margin-bottom: 0;">Repair Completed!</h1>
          <p style="font-size: 1.1em; color: #333; margin-top: 8px;">
            Dear <b>${repair.customerName}</b>,
          </p>
          <p style="color: #444;">
            We are pleased to inform you that your repair is <span style="color: #388e3c; font-weight: bold;">completed</span> and ready for pickup.
          </p>
          <table style="width: 100%; margin: 24px 0; border-collapse: collapse;">
             <tr>
              <td style="padding: 8px 0; color: #888;">Invoice No:</td>
              <td style="padding: 8px 0; color: #222;">${repair.invNo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Item Name:</td>
              <td style="padding: 8px 0; color: #222;"><b>${repair.itemName}</b></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Model No:</td>
              <td style="padding: 8px 0; color: #222;">${repair.modelNo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Serial No:</td>
              <td style="padding: 8px 0; color: #222;">${repair.serialNo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Fault:</td>
              <td style="padding: 8px 0; color: #222;">${repair.fault}</td>
            </tr> 
          </table>
          <p style="color: #888; font-size: 0.95em; margin-top: 32px;">
            Thank you for trusting us with your repair.<br>
            <b>MN Computers Team</b>
          </p>
          <hr style="border: none; border-top: 1px solid #e0e7ef; margin: 32px 0 16px 0;">
          <div style="color: #888; font-size: 0.95em;">
            <p style="margin: 0;">
              <b>Need help?</b> Contact our support team:<br>
              <a href="mailto:gallemncomputer@gmail.com" style="color: #1976d2;">gallemncomputer@gmail.com</a> | +94 (076) 4199700
            </p>
            <p style="margin: 8px 0 0 0;">
              <a href="https://yourcompany.com" style="color: #1976d2; text-decoration: none;">Visit our website</a>
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
`,
      });
      toast.success("Email sent successfully!", {
        position: "top-right",
        style: { background: "#4caf50", color: "#fff" },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to send email.",
        {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        }
      );
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
          <strong>Invoice No:</strong> {repair.invNo}
        </Typography>
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
              repair.status?.toLowerCase().replace(/\s/g, "") || "Received"
            }`}
          >
            {repair.status || "Received"}
          </span>
        </Typography>
        <Typography variant="body2">
          <strong>Received By:</strong> {repair.receivedBy}
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
          {repair.status === "Completed" && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<FaPaperPlane />}
              onClick={() => handleSendRepairEmail(repair)}
              sx={{ minWidth: "32px", padding: "4px 8px", fontSize: "0.75rem" }}
            >
              Send Email
            </Button>
          )}
        </Box>
      </Card>
    ));
  };

  // Render Repair table for desktop view
  const renderRepairTable = () => {
    return (
      <div className="repairTableWrapper">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Invoice No</th>
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
                    <td>{repair.invNo || ""}</td>
                    <td>{repair.itemName}</td>
                    <td>{repair.modelNo}</td>
                    {!isTablet && <td>{repair.serialNo}</td>}
                    <td>{repair.customerName}</td>
                    {!isTablet && <td>{repair.fault}</td>}
                    <td>
                      <span
                        className={`status-badge ${
                          repair.status?.toLowerCase().replace(/\s/g, "") ||
                          "Received"
                        }`}
                      >
                        {repair.status || "Received"}
                      </span>
                    </td>
                    {!isTablet && <td>{repair.receivedBy}</td>}
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
                          size="small"
                          sx={{
                            minWidth: 0,
                            padding: "2px 6px",
                            fontSize: "0.8rem",
                            mr: 0.5,
                          }}
                          startIcon={<FaEye />}
                        >
                          {!isTablet && "View"}
                        </Button>
                        <Button
                          onClick={() => handleEditRepair(repair)}
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            minWidth: 0,
                            padding: "2px 6px",
                            fontSize: "0.8rem",
                            mr: 0.5,
                          }}
                          startIcon={<FaEdit />}
                          disabled={isDeletingId === repair._id}
                        >
                          {!isTablet && "Edit"}
                        </Button>
                        <Button
                          onClick={() => handleDeleteRepair(repair._id)}
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{
                            minWidth: 0,
                            padding: "2px 6px",
                            fontSize: "0.8rem",
                            mr: 0.5,
                          }}
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
                        {repair.status === "Completed" && (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FaPaperPlane />}
                            size="small"
                            sx={{
                              minWidth: 0,
                              padding: "2px 6px",
                              fontSize: "0.8rem",
                              mr: 0.5,
                            }}
                            onClick={() => handleSendRepairEmail(repair)}
                          >
                            {!isTablet && "Send Email"}
                          </Button>
                        )}
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
                  autoFocus={true}
                  type="text"
                  value={data.invNo}
                  onChange={(e) => setData({ ...data, invNo: e.target.value })}
                  label="Invoice No"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  size="small"
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
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => option.customerName}
                  value={
                    customers.find(
                      (c) => c.customerName === data.customerName
                    ) || null
                  }
                  onChange={(_, newValue) =>
                    setData({
                      ...data,
                      customerName: newValue ? newValue.customerName : "",
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      margin="normal"
                      size="small"
                      disabled={isSubmitting}
                      fullWidth
                    />
                  )}
                  disabled={isSubmitting}
                />

                {/* Employee Selection */}
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => option.employeeName}
                  value={
                    employees.find((e) => e.employeeName === data.receivedBy) ||
                    null
                  }
                  onChange={(_, newValue) =>
                    setData({
                      ...data,
                      receivedBy: newValue ? newValue.employeeName : "",
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Received By"
                      margin="normal"
                      size="small"
                      disabled={isSubmitting}
                      fullWidth
                    />
                  )}
                  disabled={isSubmitting}
                />

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
                    <MenuItem value="Received">Received</MenuItem>
                    <MenuItem value="Diagnosed">Diagnosed</MenuItem>
                    <MenuItem value="In Repair">In Repair</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
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
                      Invoice No
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewRepair.invNo}
                    </Typography>
                  </Box>
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
                      {viewRepair.receivedBy}
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
                        "Received"
                      }`}
                    >
                      {viewRepair.status || "Received"}
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
