import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  FaEdit,
  FaSearch,
  FaEye,
  FaPaperPlane,
  FaDownload,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import axios from "axios";
import toast from "react-hot-toast";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Warranty = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewWarranty, setViewWarranty] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [formData, setFormData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [showNewSerial, setShowNewSerial] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [data, setData] = useState({
    itemName: "",
    modelNo: "",
    serialNo: "",
    newSerialNo: "",
    fault: "",
    customerName: "",
    recievedBy: "",
    warrantyInDate: new Date(),
    warrantyOutDate: null,
    warrantyBackInDate: null,
    deliveredToCustomerDate: null,
    description: "",
    supplier: "",
    repairNotes: "",
    status: "Received from Customer",
  });

  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "Not set";
    if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue))
      return dateValue;
    if (dateValue instanceof Date) return dateValue.toISOString().split("T")[0];
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

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch warranties
        const warrantyResponse = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/warranty/getWarranty/"
        );
        if (warrantyResponse.status === 200) {
          setFormData(warrantyResponse.data.warranties || []);
        }

        //Fetch customer data for dropdown
        const customerResponse = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/customers/getCustomers"
        );
        if (customerResponse.status === 200) {
          console.log("Customer data fetched successfully:");
          setCustomers(customerResponse.data || []);
        }

        // Fetch employee data for dropdown
        const employeeResponse = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/employees/getEmployees"
        );
        if (employeeResponse.status === 200) {
          console.log("Employee data fetched successfully:");
          setEmployees(employeeResponse.data || []);
        }

        //Fetch supplier data for dropdown
        const response = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/suppliers/getSuppliers"
        );
        if (response.status === 200) {
          console.log("Employee data fetched successfully:");
          setSuppliers(response.data.suppliers || []);
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

  const handleAddWarranty = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedData = {
      ...data,
      newSerialNo: showNewSerial ? data.newSerialNo : "",
      warrantyInDate: data.warrantyInDate
        ? data.warrantyInDate.toISOString().split("T")[0]
        : "",
      warrantyOutDate: data.warrantyOutDate
        ? data.warrantyOutDate.toISOString().split("T")[0]
        : null,
      warrantyBackInDate: data.warrantyBackInDate
        ? data.warrantyBackInDate.toISOString().split("T")[0]
        : null,
      deliveredToCustomerDate: data.deliveredToCustomerDate
        ? data.deliveredToCustomerDate.toISOString().split("T")[0]
        : null,
    };

    try {
      if (editMode && selectedWarranty) {
        const response = await axios.put(
          `https://taskflowpro-exop.vercel.app/api/warranty/updateWarranty/${selectedWarranty._id}`,
          {
            ...formattedData,
            _id: selectedWarranty._id,
          }
        );
        if (response.data.success) {
          setFormData((prev) =>
            prev.map((warranty) =>
              warranty._id === selectedWarranty._id
                ? response.data.warranty
                : warranty
            )
          );
          toast.success("Warranty Item Updated Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
        }
      } else {
        const response = await axios.post(
          "https://taskflowpro-exop.vercel.app/api/warranty/addWarranty",
          formattedData
        );
        if (response.data.success) {
          setFormData((prev) => [...prev, response.data.warranty]);
          toast.success("Warranty Item Added Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
        }
      }
      handleClose();
      resetForm();
      setShowNewSerial(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Operation failed", {
        position: "top-right",
        style: { background: "#f44336", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setData({
      itemName: "",
      modelNo: "",
      serialNo: "",
      newSerialNo: "",
      fault: "",
      customerName: "",
      recievedBy: "",
      warrantyInDate: new Date(),
      warrantyOutDate: null,
      warrantyBackInDate: null,
      deliveredToCustomerDate: null,
      description: "",
      supplier: "",
      repairNotes: "",
      status: "Received from Customer",
    });
    setEditMode(false);
    setSelectedWarranty(null);
  };

  const handleEditWarranty = (warranty) => {
    setSelectedWarranty(warranty);
    setData({
      itemName: warranty.itemName || "",
      modelNo: warranty.modelNo || "",
      serialNo: warranty.serialNo || "",
      newSerialNo: warranty.newSerialNo || "",
      fault: warranty.fault || "",
      customerName: warranty.customerName || "",
      recievedBy: warranty.recievedBy || "",
      warrantyInDate: warranty.warrantyInDate
        ? new Date(warranty.warrantyInDate)
        : new Date(),
      warrantyOutDate: warranty.warrantyOutDate
        ? new Date(warranty.warrantyOutDate)
        : null,
      warrantyBackInDate: warranty.warrantyBackInDate
        ? new Date(warranty.warrantyBackInDate)
        : null,
      deliveredToCustomerDate: warranty.deliveredToCustomerDate
        ? new Date(warranty.deliveredToCustomerDate)
        : null,
      description: warranty.description || "",
      supplier: warranty.supplier || "",
      repairNotes: warranty.repairNotes || "",
      status: warranty.status || "Received from Customer",
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDeleteWarranty = async (warrantyId) => {
    if (window.confirm("Are you sure you want to delete this warranty item?")) {
      setIsDeletingId(warrantyId);
      try {
        const response = await axios.delete(
          `https://taskflowpro-exop.vercel.app/api/warranty/deleteWarranty/${warrantyId}`
        );
        if (response.data.success) {
          setFormData((prev) =>
            prev.filter((warranty) => warranty._id !== warrantyId)
          );
          toast.success("Warranty Item Deleted Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to delete warranty item", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const updateWarrantyStatus = async (warranty, updates) => {
    try {
      const response = await axios.put(
        `https://taskflowpro-exop.vercel.app/api/warranty/updateWarranty/${warranty._id}`,
        {
          ...warranty,
          ...updates,
        }
      );
      if (response.status === 200 && response.data.success) {
        setFormData((prev) =>
          prev.map((item) =>
            item._id === warranty._id ? response.data.warranty : item
          )
        );
        return true;
      }
    } catch (error) {
      console.error("Error updating warranty:", error);
      toast.error("Error updating warranty item!", {
        position: "top-right",
        style: { background: "#f44336", color: "#fff" },
      });
      return false;
    }
  };

  const handleSendToWarranty = async (warranty) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const success = await updateWarrantyStatus(warranty, {
      warrantyOutDate: currentDate,
      status: "Sent to Warranty",
    });
    if (success)
      toast("Item sent to warranty service!", {
        icon: "ℹ️",
        position: "top-right",
        style: { background: "#5ba4fc", color: "#fff" },
      });
  };

  const handleReceiveFromWarranty = async (warranty) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const success = await updateWarrantyStatus(warranty, {
      warrantyBackInDate: currentDate,
      status: "Received from Warranty",
    });
    if (success)
      toast("Item received from warranty service!", {
        icon: "ℹ️",
        position: "top-right",
        style: { background: "#5897ee", color: "#fff" },
      });
  };

  const handleMarkReadyForCustomer = async (warranty) => {
    const success = await updateWarrantyStatus(warranty, {
      status: "Ready for Customer",
    });
    if (success)
      toast("Item marked as ready for customer!", {
        icon: "ℹ️",
        position: "top-right",
        style: { background: "#0073e6", color: "#fff" },
      });
  };

  const handleDeliverToCustomer = async (warranty) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const success = await updateWarrantyStatus(warranty, {
      deliveredToCustomerDate: currentDate,
      status: "Delivered to Customer",
    });
    if (success)
      toast("Item delivered to customer!", {
        icon: "ℹ️",
        position: "top-right",
        style: { background: "#2563eb", color: "#fff" },
      });
  };

  //Handle sending warranty email
  const handleSendWarrantyEmail = async (warranty) => {
    try {
      const customer =
        customers.find((c) => c.customerName === warranty.customerName) || {};
      const email = customer.email || warranty.email;
      if (!email) {
        toast.error("No customer email found!", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
        return;
      }
      await axios.post("https://taskflowpro-exop.vercel.app/api/notify/send", {
        to: email,
        subject: `Warranty Item Ready: ${warranty.itemName}`,
        text: `Dear ${warranty.customerName},\n\nYour warranty item (${warranty.itemName}, Model: ${warranty.modelNo}, Serial: ${warranty.serialNo}) is ready for pickup.\n\nThank you!`,
        html: `
  <div style="font-family: Arial, sans-serif; background: #f4f6fb; padding: 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e7ef;">
      <tr>
        <td style="padding: 24px 32px 16px 32px;">
          <h1 style="color: #1976d2; margin-bottom: 0;">Warranty Item Ready!</h1>
          <p style="font-size: 1.1em; color: #333; margin-top: 8px;">
            Dear <b>${warranty.customerName}</b>,
          </p>
          <p style="color: #444;">
            We are pleased to inform you that your warranty item is <span style="color: #388e3c; font-weight: bold;">ready for pickup</span>.
          </p>
          <table style="width: 100%; margin: 24px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #888;">Item Name:</td>
              <td style="padding: 8px 0; color: #222;"><b>${warranty.itemName}</b></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Model No:</td>
              <td style="padding: 8px 0; color: #222;">${warranty.modelNo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Serial No:</td>
              <td style="padding: 8px 0; color: #222;">${warranty.serialNo}</td>
            </tr>
            ${
              warranty.newSerialNo
                ? `<tr>
                    <td style="padding: 8px 0; color: #888;">New Serial No:</td>
                    <td style="padding: 8px 0; color: #222;">${warranty.newSerialNo}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px 0; color: #888;">Fault:</td>
              <td style="padding: 8px 0; color: #222;">${warranty.fault}</td>
            </tr>
             <tr>
              <td style="padding: 8px 0; color: #888;">Repair Notes:</td>
              <td style="padding: 8px 0; color: #222;">${warranty.repairNotes}</td>
            </tr>
          </table>
          <p style="color: #888; font-size: 0.95em; margin-top: 32px;">
            Thank you for choosing us for your warranty service.<br>
            <b>MN Computers Team</b>
          </p>
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
      toast.error("Failed to send email.", {
        position: "top-right",
        style: { background: "#f44336", color: "#fff" },
      });
    }
  };

  const filteredWarranties = formData.filter(
    (warranty) =>
      warranty.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.serialNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.fault?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.recievedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate warranties by status
  const getWarrantiesByStatus = (status) => {
    return filteredWarranties.filter((warranty) => warranty.status === status);
  };

  const receivedFromCustomer = getWarrantiesByStatus("Received from Customer");
  const sentToWarranty = getWarrantiesByStatus("Sent to Warranty");
  const receivedFromWarranty = getWarrantiesByStatus("Received from Warranty");
  const readyForCustomer = getWarrantiesByStatus("Ready for Customer");
  const deliveredToCustomer = getWarrantiesByStatus("Delivered to Customer");

  // Get current tab data
  const getCurrentTabData = () => {
    switch (tabValue) {
      case 0:
        return receivedFromCustomer;
      case 1:
        return sentToWarranty;
      case 2:
        return receivedFromWarranty;
      case 3:
        return readyForCustomer;
      case 4:
        return deliveredToCustomer;
      default:
        return [];
    }
  };

  const currentTabData = getCurrentTabData();

  // Calculate pagination for current tab
  const totalItems = currentTabData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentTabData.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
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

  // Reset pagination when tab changes or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tabValue, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Received from Customer":
        return "info";
      case "Sent to Warranty":
        return "warning";
      case "Received from Warranty":
        return "success";
      case "Ready for Customer":
        return "primary";
      case "Delivered to Customer":
        return "default";
      default:
        return "default";
    }
  };

  const getActionButton = (warranty) => {
    switch (warranty.status) {
      case "Received from Customer":
        return (
          <Button
            size="small"
            variant="contained"
            color="warning"
            startIcon={<FaPaperPlane />}
            onClick={() => handleSendToWarranty(warranty)}
            sx={{ minWidth: "32px", padding: "4px 8px", fontSize: "0.75rem" }}
          >
            {!isTablet && "Send to Warranty"}
          </Button>
        );
      case "Sent to Warranty":
        return (
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<FaDownload />}
            onClick={() => handleReceiveFromWarranty(warranty)}
            sx={{ minWidth: "32px", padding: "4px 8px", fontSize: "0.75rem" }}
          >
            {!isTablet && "Receive"}
          </Button>
        );
      case "Received from Warranty":
        return (
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<FaCheckCircle />}
            onClick={() => handleMarkReadyForCustomer(warranty)}
            sx={{ minWidth: "32px", padding: "4px 8px", fontSize: "0.75rem" }}
          >
            {!isTablet && "Mark Ready"}
          </Button>
        );
      case "Ready for Customer":
        return (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<FaTruck />}
            onClick={() => handleDeliverToCustomer(warranty)}
            sx={{ minWidth: "32px", padding: "4px 8px", fontSize: "0.75rem" }}
          >
            {!isTablet && "Deliver"}
          </Button>
        );
      default:
        return null;
    }
  };

  // Render warranty cards for mobile view
  const renderWarrantyCards = () => {
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
            No warranty items found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No items in this status"}
          </Typography>
        </Box>
      );
    }

    return currentItems.map((warranty) => (
      <Card key={warranty._id} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{warranty.itemName}</Typography>
        <Typography variant="body2" component="div">
          <strong>Model:</strong> {warranty.modelNo}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Serial No:</strong> {warranty.serialNo}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>New Serial No:</strong> {warranty.newSerialNo || "_"}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Customer:</strong> {warranty.customerName}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Fault:</strong> {warranty.fault}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Supplier:</strong> {warranty.supplier}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Received By:</strong> {warranty.recievedBy}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Status:</strong>{" "}
          <Chip
            label={warranty.status}
            color={getStatusColor(warranty.status)}
            size="small"
          />
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Button
            onClick={() => {
              setViewWarranty(warranty);
              setViewOpen(true);
            }}
            variant="contained"
            color="info"
            size="small"
            startIcon={<FaEye />}
          >
            View
          </Button>
          <Button
            onClick={() => handleEditWarranty(warranty)}
            variant="contained"
            color="success"
            size="small"
            startIcon={<FaEdit />}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteWarranty(warranty._id)}
            variant="outlined"
            color="error"
            size="small"
            startIcon={
              isDeletingId === warranty._id ? (
                <CircularProgress size={16} />
              ) : (
                <MdDelete />
              )
            }
            disabled={isDeletingId === warranty._id}
          >
            {isDeletingId === warranty._id ? "Deleting..." : "Delete"}
          </Button>
          {getActionButton(warranty)}
          {warranty.status === "Ready for Customer" && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<FaPaperPlane />}
              onClick={() => handleSendWarrantyEmail(warranty)}
              sx={{ minWidth: "32px", padding: "4px 8px", fontSize: "0.75rem" }}
            >
              Send Email
            </Button>
          )}
        </Box>
      </Card>
    ));
  };

  // Render warranty table for desktop view
  const renderWarrantyTable = () => {
    if (currentItems.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No warranty items found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No items in this status"}
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ overflowX: "auto" }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            "& th, & td": {
              padding: "8px",
              textAlign: "left",
              borderBottom: "1px solid #ddd",
              fontSize: "0.875rem",
            },
            "& th": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        >
          <Box component="thead">
            <Box component="tr">
              <Box component="th">Item Info</Box>{" "}
              {/* Changed from "Item Details" */}
              <Box component="th">Customer</Box>
              <Box component="th">Issue</Box> {/* Changed from "Fault" */}
              <Box component="th">Supplier</Box>
              <Box component="th">Received By</Box>
              {!isTablet && <Box component="th">Status</Box>}
              <Box component="th">Actions</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {currentItems.map((warranty) => (
              <Box component="tr" key={warranty._id}>
                <Box component="td">
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "0.8rem", lineHeight: 1.2 }}
                    >
                      {warranty.itemName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", lineHeight: 1.1 }}
                    >
                      {warranty.modelNo}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.7rem", lineHeight: 1.1 }}
                    >
                      S/N: {warranty.serialNo}
                    </Typography>
                    {warranty.newSerialNo && (
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{
                          display: "block",
                          fontSize: "0.7rem",
                          lineHeight: 1.1,
                        }}
                      >
                        New S/N: {warranty.newSerialNo}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box component="td">{warranty.customerName}</Box>
                <Box component="td" sx={{ maxWidth: "150px" }}>
                  {warranty.fault}
                </Box>
                <Box component="td">{warranty.supplier}</Box>
                <Box component="td">{warranty.recievedBy}</Box>
                {!isTablet && (
                  <Box component="td">
                    <Chip
                      label={warranty.status}
                      color={getStatusColor(warranty.status)}
                      size="small"
                    />
                  </Box>
                )}
                <Box component="td">
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      onClick={() => {
                        setViewWarranty(warranty);
                        setViewOpen(true);
                      }}
                      variant="contained"
                      color="info"
                      size="small"
                      sx={{ minWidth: "32px", padding: "4px 8px" }}
                      startIcon={<FaEye />}
                    >
                      {!isTablet && "View"}
                    </Button>
                    <Button
                      onClick={() => handleEditWarranty(warranty)}
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ minWidth: "32px", padding: "4px 8px" }}
                      startIcon={<FaEdit />}
                    >
                      {!isTablet && "Edit"}
                    </Button>
                    <Button
                      onClick={() => handleDeleteWarranty(warranty._id)}
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ minWidth: "32px", padding: "4px 8px" }}
                      startIcon={
                        isDeletingId === warranty._id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <MdDelete />
                        )
                      }
                      disabled={isDeletingId === warranty._id}
                    >
                      {!isTablet &&
                        (isDeletingId === warranty._id
                          ? "Deleting..."
                          : "Delete")}
                    </Button>
                    {getActionButton(warranty)}

                    {warranty.status === "Ready for Customer" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<FaPaperPlane />}
                        onClick={() => handleSendWarrantyEmail(warranty)}
                        sx={{
                          minWidth: "32px",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {!isTablet && "Send Email"}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading Warranty Management Section...
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h3" fontWeight={600}>
            Warranty Management
          </Typography>
          <Typography variant="subtitle2" component="h6" color="textSecondary">
            Dashboard / Warranty
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }} />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editMode ? "Edit Warranty Item" : "Add Warranty Item"}
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <IoMdCloseCircle />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ width: "100%", mt: 1 }}>
            <Box component="form" onSubmit={handleAddWarranty}>
              <TextField
                size="small"
                autoFocus
                value={data.itemName || ""}
                onChange={(e) => setData({ ...data, itemName: e.target.value })}
                label="Item Name"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
                required
              />
              <TextField
                size="small"
                value={data.modelNo || ""}
                onChange={(e) => setData({ ...data, modelNo: e.target.value })}
                label="Model Number"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
                required
              />
              <TextField
                size="small"
                value={data.serialNo || ""}
                onChange={(e) => setData({ ...data, serialNo: e.target.value })}
                label="Serial Number"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
                required
              />
              {/* Checkbox and conditional textfield for new serial no */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showNewSerial}
                      onChange={(e) => setShowNewSerial(e.target.checked)}
                      disabled={isSubmitting}
                    />
                  }
                  label="New Serial No"
                />
                {showNewSerial && (
                  <TextField
                    size="small"
                    value={data.newSerialNo || ""}
                    onChange={(e) =>
                      setData({ ...data, newSerialNo: e.target.value })
                    }
                    label="New Serial Number"
                    variant="outlined"
                    margin="normal"
                    disabled={isSubmitting}
                  />
                )}
              </Box>

              <TextField
                size="small"
                label="Fault Description"
                value={data.fault || ""}
                onChange={(e) => setData({ ...data, fault: e.target.value })}
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                disabled={isSubmitting}
                required
              />

              <Autocomplete
                options={customers}
                getOptionLabel={(option) => option.customerName}
                value={
                  customers.find((c) => c.customerName === data.customerName) ||
                  null
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
                    label="Customer Name"
                    margin="normal"
                    size="small"
                    required
                    disabled={isSubmitting}
                    fullWidth
                  />
                )}
                disabled={isSubmitting}
              />

              <Autocomplete
                options={employees}
                getOptionLabel={(option) => option.employeeName}
                value={
                  employees.find((e) => e.employeeName === data.recievedBy) ||
                  null
                }
                onChange={(_, newValue) =>
                  setData({
                    ...data,
                    recievedBy: newValue ? newValue.employeeName : "",
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Received By"
                    margin="normal"
                    size="small"
                    required
                    disabled={isSubmitting}
                    fullWidth
                  />
                )}
                disabled={isSubmitting}
              />

              <Autocomplete
                options={suppliers.filter((s) => s && s.supplierName)}
                getOptionLabel={(option) => option.supplierName}
                value={
                  suppliers
                    .filter((s) => s && s.supplierName)
                    .find((s) => s.supplierName === data.supplier) || null
                }
                onChange={(_, newValue) =>
                  setData({
                    ...data,
                    supplier: newValue ? newValue.supplierName : "",
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Supplier"
                    margin="normal"
                    size="small"
                    required
                    disabled={isSubmitting}
                    fullWidth
                  />
                )}
                disabled={isSubmitting}
              />

              <TextField
                size="small"
                label="Description"
                value={data.description || ""}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                disabled={isSubmitting}
              />
              <TextField
                size="small"
                label="Repair Notes"
                value={data.repairNotes || ""}
                onChange={(e) =>
                  setData({ ...data, repairNotes: e.target.value })
                }
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                disabled={isSubmitting}
              />

              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={data.status || ""}
                  label="Status"
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  disabled={isSubmitting}
                >
                  <MenuItem value="Received from Customer">
                    Received from Customer
                  </MenuItem>
                  <MenuItem value="Sent to Warranty">Sent to Warranty</MenuItem>
                  <MenuItem value="Received from Warranty">
                    Received from Warranty
                  </MenuItem>
                  <MenuItem value="Ready for Customer">
                    Ready for Customer
                  </MenuItem>
                  <MenuItem value="Delivered to Customer">
                    Delivered to Customer
                  </MenuItem>
                </Select>
              </FormControl>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <DatePicker
                  label="Warranty In Date"
                  value={data.warrantyInDate || null}
                  onChange={(newValue) =>
                    setData({ ...data, warrantyInDate: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      disabled: isSubmitting,
                    },
                  }}
                />
                <DatePicker
                  label="Warranty Out Date"
                  value={data.warrantyOutDate || null}
                  onChange={(newValue) =>
                    setData({ ...data, warrantyOutDate: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      disabled: isSubmitting,
                    },
                  }}
                />
                <DatePicker
                  label="Warranty Back In Date"
                  value={data.warrantyBackInDate || null}
                  onChange={(newValue) =>
                    setData({ ...data, warrantyBackInDate: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      disabled: isSubmitting,
                    },
                  }}
                />
                <DatePicker
                  label="Delivered to Customer Date"
                  value={data.deliveredToCustomerDate || null}
                  onChange={(newValue) =>
                    setData({ ...data, deliveredToCustomerDate: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      disabled: isSubmitting,
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={16} />}
                  sx={{ mt: 2 }}
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
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Enhanced View Dialog with All Dates */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Warranty Item Details
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={() => setViewOpen(false)}
          >
            <IoMdCloseCircle />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {viewWarranty && (
            <Box sx={{ mt: 2 }}>
              {/* Basic Information */}
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Basic Information
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Item Name
                  </Typography>
                  <Typography variant="body1">
                    {viewWarranty.itemName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Model Number
                  </Typography>
                  <Typography variant="body1">
                    {viewWarranty.modelNo}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Serial Number
                  </Typography>
                  <Typography variant="body1">
                    {viewWarranty.serialNo}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    New Serial Number
                  </Typography>
                  <Typography variant="body1">
                    {viewWarranty.newSerialNo ? viewWarranty.newSerialNo : "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1">
                    {viewWarranty.customerName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Received By
                  </Typography>
                  <Typography variant="body1">
                    {viewWarranty.recievedBy}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Current Status
                  </Typography>
                  <Chip
                    label={viewWarranty.status}
                    color={getStatusColor(viewWarranty.status)}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1">
                    {viewWarranty.supplier || "Not assigned"}
                  </Typography>
                </Box>
              </Box>

              {/* Date Timeline */}
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Date Timeline
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Warranty In Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: viewWarranty.warrantyInDate
                        ? "text.primary"
                        : "text.secondary",
                    }}
                  >
                    {formatDateForDisplay(viewWarranty.warrantyInDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Warranty Out Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: viewWarranty.warrantyOutDate
                        ? "text.primary"
                        : "text.secondary",
                    }}
                  >
                    {formatDateForDisplay(viewWarranty.warrantyOutDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Warranty Back In Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: viewWarranty.warrantyBackInDate
                        ? "text.primary"
                        : "text.secondary",
                    }}
                  >
                    {formatDateForDisplay(viewWarranty.warrantyBackInDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Delivered to Customer Date
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: viewWarranty.deliveredToCustomerDate
                        ? "text.primary"
                        : "text.secondary",
                    }}
                  >
                    {formatDateForDisplay(viewWarranty.deliveredToCustomerDate)}
                  </Typography>
                </Box>
              </Box>

              {/* Fault and Notes */}
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Fault Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                >
                  {viewWarranty.fault}
                </Typography>
              </Box>
              {viewWarranty.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    {viewWarranty.description}
                  </Typography>
                </Box>
              )}
              {viewWarranty.repairNotes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Repair Notes
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    {viewWarranty.repairNotes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <Card>
        <CardContent>
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
            <TextField
              placeholder="Search Warranty Items..."
              variant="outlined"
              size="small"
              fullWidth={isMobile}
              sx={{ maxWidth: isMobile ? "100%" : "300px" }}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              startIcon={<IoShieldCheckmarkSharp />}
              sx={{
                whiteSpace: "nowrap",
                minWidth: isMobile ? "100%" : "auto",
              }}
            >
              Add Warranty Item
            </Button>
          </Box>

          {/* Tabular Status Sections */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label={`Received (${receivedFromCustomer.length})`} />
              <Tab label={`Sent to Warranty (${sentToWarranty.length})`} />
              <Tab
                label={`Back from Warranty (${receivedFromWarranty.length})`}
              />
              <Tab label={`Ready (${readyForCustomer.length})`} />
              <Tab label={`Delivered (${deliveredToCustomer.length})`} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Received from Customer ({receivedFromCustomer.length})
            </Typography>
            {isMobile ? renderWarrantyCards() : renderWarrantyTable()}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Sent to Warranty ({sentToWarranty.length})
            </Typography>
            {isMobile ? renderWarrantyCards() : renderWarrantyTable()}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Received from Warranty ({receivedFromWarranty.length})
            </Typography>
            {isMobile ? renderWarrantyCards() : renderWarrantyTable()}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Ready for Customer ({readyForCustomer.length})
            </Typography>
            {isMobile ? renderWarrantyCards() : renderWarrantyTable()}
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Delivered to Customer ({deliveredToCustomer.length})
            </Typography>
            {isMobile ? renderWarrantyCards() : renderWarrantyTable()}
          </TabPanel>

          {/* Pagination Controls */}
          {totalItems > 0 && (
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
                <Typography variant="body2" component="div">
                  Page {currentPage} of {totalPages || 1}
                </Typography>
                <Typography variant="body2" component="div">
                  Showing {Math.min(itemsPerPage, currentItems.length)} of{" "}
                  {totalItems} items
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default Warranty;
