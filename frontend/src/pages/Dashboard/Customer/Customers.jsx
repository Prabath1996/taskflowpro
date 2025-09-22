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
} from "@mui/material";
import { FaUserPlus, FaEdit, FaSearch } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import "./Customer.css";
import axios from "axios";
import toast from "react-hot-toast";

const Customers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // Add these state variables after the existing ones
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Sample customer data
  const [formData, setFormData] = useState([]);

  //get data from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/customers/getCustomers"
        );
        if (response.status === 200) {
          console.log("Customer data fetched successfully:");
          setFormData(response.data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error("Failed to load employee data", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  //Add customer
  const [data, setData] = useState({
    customerName: "",
    email: "",
    address: "",
    phoneNo: "",
  });

  // Loading state for add/update operations
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { customerName, email, address, phoneNo } = data;

    try {
      if (editMode && selectedCustomer) {
        toast.success("Customer Updated Successfully", {
          position: "top-right",
          style: { background: "#4caf50", color: "#fff" },
        });
        setFormData((prev) =>
          prev.map((customer) =>
            customer._id === selectedCustomer._id
              ? { ...customer, customerName, email, address, phoneNo }
              : customer
          )
        );
        handleClose();
        resetForm();
      } else {
        const response = await axios.post(
          "https://taskflowpro-exop.vercel.app/api/customers/addCustomers",
          { customerName, email, address, phoneNo }
        );
        toast.success("Customer Added Successfully", {
          position: "top-right",
          style: { background: "#4caf50", color: "#fff" },
        });
        setFormData((prev) => [...prev, response.data]);
        setData({
          customerName: "",
          email: "",
          address: "",
          phoneNo: "",
        });
        handleClose();
        resetForm();
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
      customerName: "",
      email: "",
      address: "",
      phoneNo: "",
    });
    setEditMode(false);
    setSelectedCustomer(null);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setData({
      customerName: customer.customerName,
      email: customer.email,
      address: customer.address,
      phoneNo: customer.phoneNo,
    });
    setEditMode(true);
    setOpen(true);
  };

  // Handle delete customer
  const [isDeletingId, setIsDeletingId] = useState(null);

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setIsDeletingId(customerId);
      try {
        const response = await axios.delete(
          `https://taskflowpro-exop.vercel.app/api/customers/deleteCustomers/${customerId}`
        );

        if (response.data.error) {
          toast.error(data.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          });
        } else {
          // Remove customer from local state
          setFormData((prev) =>
            prev.filter((customer) => customer._id !== customerId)
          );
          toast.success("Customer Deleted Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.error || "Failed to Delete customer",
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

  //Update customer

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter customers based on search term
  useEffect(() => {
    const results = formData.filter(
      (customerRec) =>
        customerRec.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customerRec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerRec.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerRec.phoneNo.includes(searchTerm)
    );
    setFilteredCustomers(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, formData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Calculate pagination
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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

  // Render customer cards for mobile view
  const renderCustomerCards = () => {
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
            No customer found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Add your first customer to get started"}
          </Typography>
        </Box>
      );
    }
    return currentItems.map((customer) => (
      <Card key={customer._id} className="customer-card" sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{customer.customerName}</Typography>
        <Typography variant="body2">
          <strong>Address:</strong> {customer.address}
        </Typography>
        <Typography variant="body2">
          <strong>Phone:</strong> {customer.phoneNo}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> {customer.email}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            type="button"
            onClick={() => handleEditCustomer(customer)}
            variant="contained"
            color="success"
            size="small"
            startIcon={<FaEdit />}
            disabled={isDeletingId === customer._id}
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleDeleteCustomer(customer._id)}
            variant="outlined"
            color="error"
            size="small"
            startIcon={
              isDeletingId === customer._id ? (
                <CircularProgress size={16} color="error" />
              ) : (
                <MdDelete />
              )
            }
            disabled={isDeletingId === customer._id}
          >
            {isDeletingId === customer._id ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Card>
    ));
  };

  // Render customer table for desktop view
  const renderCustomerTable = () => {
    return (
      <div className="customerTableWrapper">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              {!isTablet && <th>Address</th>}
              <th>Phone No</th>
              {!isTablet && <th>Email</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={isTablet ? "4" : "5"}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No customer found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Add your first customer to get started"}
                  </Typography>
                </td>
              </tr>
            ) : (
              currentItems.map((customer) => {
                return (
                  <tr key={customer._id}>
                    <td>{customer.customerName}</td>
                    {!isTablet && <td>{customer.address}</td>}
                    <td>{customer.phoneNo}</td>
                    {!isTablet && <td>{customer.email}</td>}
                    <td>
                      <div className="actions">
                        <Button
                          onClick={() => handleEditCustomer(customer)}
                          variant="contained"
                          color="success"
                          size={isTablet ? "small" : "medium"}
                          startIcon={<FaEdit />}
                          disabled={isDeletingId === customer._id}
                        >
                          {!isTablet && "Edit"}
                        </Button>
                        <Button
                          onClick={() => handleDeleteCustomer(customer._id)}
                          variant="outlined"
                          color="error"
                          size={isTablet ? "small" : "medium"}
                          startIcon={
                            isDeletingId === customer._id ? (
                              <CircularProgress size={16} color="error" />
                            ) : (
                              <MdDelete />
                            )
                          }
                          disabled={isDeletingId === customer._id}
                        >
                          {!isTablet &&
                            (isDeletingId === customer._id
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
        Loading customer data...
      </Typography>
    </Box>
  );

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h3" fontWeight={600}>
            Customers
          </Typography>
          <Typography variant="subtitle2" component="h6" color="textSecondary">
            Dashboard / Customers
          </Typography>
        </CardContent>
      </Card>

      <br />

      {/* Add Customer Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? "Edit Customer" : "Add Customer"}
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
            <form onSubmit={handleAddCustomer}>
              <TextField
                size="small"
                autoFocus
                type="text"
                value={data.customerName || ""}
                onChange={(e) =>
                  setData({ ...data, customerName: e.target.value })
                }
                label="Customer Name"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
              />
              <TextField
                size="small"
                label="Address"
                type="text"
                value={data.address || ""}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
              />
              <TextField
                size="small"
                label="Phone No"
                type="text"
                value={data.phoneNo || ""}
                onChange={(e) => setData({ ...data, phoneNo: e.target.value })}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
              />
              <TextField
                size="small"
                label="Email"
                type="text"
                value={data.email || ""}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                className="btn-lg"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
                startIcon={
                  isSubmitting && <CircularProgress size={16} color="inherit" />
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
            </form>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Main Content Card */}
      <Card>
        <CardContent>
          {/* Search and Add Customer Row */}
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
              placeholder="Search customers..."
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

            {/* Add Customer Button */}
            <Button
              className="btnAddCustomer btn-lg"
              variant="contained"
              onClick={handleOpen}
              startIcon={<FaUserPlus />}
              disabled={isLoading}
              sx={{
                whiteSpace: "nowrap",
                minWidth: isMobile ? "100%" : "auto",
              }}
            >
              Add Customer
            </Button>
          </Box>

          {/* Loading Screen or Employee List */}
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {/* Customer List - Table or Cards based on screen size */}
              {isMobile ? renderCustomerCards() : renderCustomerTable()}

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
    </>
  );
};

export default Customers;
