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
  Chip,
  OutlinedInput,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FaTasks, FaEdit, FaSearch, FaEye } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import "../Tasks/Tasks.css";
import axios from "axios";
import toast from "react-hot-toast";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Task = () => {
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
  const [viewTask, setViewTask] = useState(null);

  // Add these state variables after the existing ones
  const [editMode, setEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Task data
  const [formData, setFormData] = useState([]);

  //Customers data for dropdown
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
        // Fetch task data
        const taskResponse = await axios.get(
          "https://taskflowpro-exop.vercel.app/api/tasks/getTasks"
        );
        if (taskResponse.status === 200) {
          console.log("Task data fetched successfully:");
          setFormData(taskResponse.data);
        }

        //Fetch customer data for dropdown
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

  //Add Task
  const [data, setData] = useState({
    taskName: "",
    customerName: "",
    location: "",
    startDate: new Date(),
    assignTo: [], // Changed to array for multiple selection
    siteName: "",
    endDate: null,
    description: "",
    status: "Pending",
  });

  // Loading state for add/update operations
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      taskName,
      customerName,
      location,
      startDate,
      assignTo,
      siteName,
      endDate,
      description,
      status,
    } = data;

    // Convert Date objects to ISO strings
    const formattedStartDate = startDate
      ? startDate.toISOString().split("T")[0]
      : "";
    const formattedEndDate = endDate ? endDate.toISOString().split("T")[0] : "";

    try {
      if (editMode && selectedTask) {
        // Update existing Task
        const { data } = await axios.put(
          `https://taskflowpro-exop.vercel.app/api/tasks/updateTasks/${selectedTask._id}`,
          {
            taskName,
            customerName,
            location,
            startDate: formattedStartDate,
            assignTo: assignTo.join(", "), // Convert array to comma-separated string for backend
            siteName,
            endDate: formattedEndDate,
            description,
            status,
          }
        );

        if (data.error) {
          toast.error(data.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          });
        } else {
          // Update the Task in the local state
          setFormData((prev) =>
            prev.map((task) =>
              task._id === selectedTask._id
                ? {
                    ...task,
                    taskName,
                    customerName,
                    location,
                    startDate,
                    assignTo: assignTo.join(", "),
                    siteName,
                    endDate,
                    description,
                    status,
                  }
                : task
            )
          );
          toast.success("Task Updated Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
          handleClose();
          resetForm();
        }
      } else {
        // Add new Task
        const { data: responseData } = await axios.post(
          "https://taskflowpro-exop.vercel.app/api/tasks/addTasks",
          {
            taskName,
            customerName,
            location,
            startDate: formattedStartDate,
            assignTo: assignTo.join(", "), // Convert array to comma-separated string for backend
            siteName,
            endDate: formattedEndDate,
            description,
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
          toast.success("Task Added Successfully", {
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
      taskName: "",
      customerName: "",
      location: "",
      startDate: new Date(),
      assignTo: [],
      siteName: "",
      endDate: null,
      description: "",
      status: "Pending",
    });
    setEditMode(false);
    setSelectedTask(null);
  };

  // Handle edit Task
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setData({
      taskName: task.taskName,
      customerName: task.customerName,
      location: task.location,
      startDate: task.startDate ? new Date(task.startDate) : new Date(),
      assignTo: task.assignTo ? task.assignTo.split(", ") : [], // Convert comma-separated string to array
      siteName: task.siteName,
      endDate: task.endDate ? new Date(task.endDate) : null,
      description: task.description || "",
      status: task.status || "Pending",
    });
    setEditMode(true);
    setOpen(true);
  };

  // Handle view task
  const handleViewTask = (task) => {
    setViewTask(task);
    setViewOpen(true);
  };

  // Handle delete Task
  const [isDeletingId, setIsDeletingId] = useState(null);

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsDeletingId(taskId);
      try {
        const data = await axios.delete(
          `https://taskflowpro-exop.vercel.app/api/tasks/deleteTasks/${taskId}`
        );

        if (data.error) {
          toast.error(data.error, {
            position: "top-right",
            style: { background: "#f44336", color: "#fff" },
          });
        } else {
          // Remove Task from local state
          setFormData((prev) => prev.filter((task) => task._id !== taskId));
          toast.success("Task Deleted Successfully", {
            position: "top-right",
            style: { background: "#4caf50", color: "#fff" },
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete task", {
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
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Tasks based on search term
  useEffect(() => {
    const results = formData.filter(
      (task) =>
        task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.siteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, formData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Calculate pagination
  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

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

  // Handle multiple select change for assignTo
  const handleAssignToChange = (event) => {
    const {
      target: { value },
    } = event;
    setData({
      ...data,
      assignTo: typeof value === "string" ? value.split(",") : value,
    });
  };

  // Render Task cards for mobile view
  const renderTaskCards = () => {
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
            No tasks found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Add your first task to get started"}
          </Typography>
        </Box>
      );
    }

    return currentItems.map((task) => (
      <Card key={task._id} className="task-card" sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{task.taskName}</Typography>
        <Typography variant="body2">
          <strong>Customer Name:</strong> {task.customerName}
        </Typography>
        <Typography variant="body2">
          <strong>Location:</strong> {task.location}
        </Typography>
        <Typography variant="body2">
          <strong>Assigned To (Technician/s):</strong> {task.assignTo}
        </Typography>
        <Typography variant="body2">
          <strong>Description:</strong> {task.description}
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong>{" "}
          <span
            className={`status-badge ${
              task.status?.toLowerCase().replace(/\s/g, "") || "pending"
            }`}
          >
            {task.status || "Pending"}
          </span>
        </Typography>
        <Typography variant="body2">
          <strong>Start Date:</strong> {formatDateForDisplay(task.startDate)}
        </Typography>
        {task.endDate && (
          <Typography variant="body2">
            <strong>End Date:</strong>{" "}
            {formatDateForDisplay(task.endDate) || "Not Set"}
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Button
            type="button"
            onClick={() => handleViewTask(task)}
            variant="contained"
            color="info"
            size="small"
            startIcon={<FaEye />}
          >
            View
          </Button>
          <Button
            type="button"
            onClick={() => handleEditTask(task)}
            variant="contained"
            color="success"
            size="small"
            startIcon={<FaEdit />}
            disabled={isDeletingId === task._id}
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleDeleteTask(task._id)}
            variant="outlined"
            color="error"
            size="small"
            startIcon={
              isDeletingId === task._id ? (
                <CircularProgress size={16} color="error" />
              ) : (
                <MdDelete />
              )
            }
            disabled={isDeletingId === task._id}
          >
            {isDeletingId === task._id ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Card>
    ));
  };

  // Render Task table for desktop view
  const renderTaskTable = () => {
    return (
      <div className="taskTableWrapper">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Task</th>
              <th>Customer Name</th>
              <th>Location</th>
              {!isTablet && <th>Assigned To</th>}
              <th>Status</th>
              {!isTablet && <th>Start Date</th>}
              {!isTablet && <th>End Date</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={isTablet ? "4" : "7"}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No tasks found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Add your first task to get started"}
                  </Typography>
                </td>
              </tr>
            ) : (
              currentItems.map((task) => {
                return (
                  <tr key={task._id}>
                    <td>{task.taskName}</td>
                    <td>{task.customerName}</td>
                    <td>{task.location}</td>
                    {!isTablet && <td>{task.assignTo}</td>}
                    <td>
                      <span
                        className={`status-badge ${
                          task.status?.toLowerCase().replace(/\s/g, "") ||
                          "pending"
                        }`}
                      >
                        {task.status || "Pending"}
                      </span>
                    </td>
                    {!isTablet && (
                      <td>{formatDateForDisplay(task.startDate)}</td>
                    )}
                    {!isTablet && (
                      <td>{formatDateForDisplay(task.endDate) || "Not Set"}</td>
                    )}
                    <td>
                      <div className="actions">
                        <Button
                          onClick={() => handleViewTask(task)}
                          variant="contained"
                          color="info"
                          size={isTablet ? "small" : "medium"}
                          startIcon={<FaEye />}
                          sx={{ mr: 1 }}
                        >
                          {!isTablet && "View"}
                        </Button>
                        <Button
                          onClick={() => handleEditTask(task)}
                          variant="contained"
                          color="success"
                          size={isTablet ? "small" : "medium"}
                          startIcon={<FaEdit />}
                          disabled={isDeletingId === task._id}
                          sx={{ mr: 1 }}
                        >
                          {!isTablet && "Edit"}
                        </Button>
                        <Button
                          onClick={() => handleDeleteTask(task._id)}
                          variant="outlined"
                          color="error"
                          size={isTablet ? "small" : "medium"}
                          startIcon={
                            isDeletingId === task._id ? (
                              <CircularProgress size={16} color="error" />
                            ) : (
                              <MdDelete />
                            )
                          }
                          disabled={isDeletingId === task._id}
                        >
                          {!isTablet &&
                            (isDeletingId === task._id
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
    setViewTask(null);
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
        Loading task data...
      </Typography>
    </Box>
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3" fontWeight={600}>
              Task Management
            </Typography>
            <Typography
              variant="subtitle2"
              component="h6"
              color="textSecondary"
            >
              Dashboard / Tasks
            </Typography>
          </CardContent>
        </Card>

        <br />

        {/* Add Task Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editMode ? "Edit Task" : "Add Task"}
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
              <form onSubmit={handleAddTask}>
                <TextField
                  size="small"
                  autoFocus
                  type="text"
                  value={data.taskName}
                  onChange={(e) =>
                    setData({ ...data, taskName: e.target.value })
                  }
                  label="Task Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
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
                      required
                      disabled={isSubmitting}
                      fullWidth
                    />
                  )}
                  disabled={isSubmitting}
                />

                {/* location */}
                <TextField
                  size="small"
                  autoFocus
                  type="text"
                  value={data.location}
                  onChange={(e) =>
                    setData({ ...data, location: e.target.value })
                  }
                  label="Location"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />

                {/* Multiple Employee Selection for Assign To */}
                <Autocomplete
                  multiple
                  options={employees}
                  getOptionLabel={(option) => option.employeeName}
                  value={employees.filter((e) =>
                    data.assignTo.includes(e.employeeName)
                  )}
                  onChange={(_, newValue) =>
                    setData({
                      ...data,
                      assignTo: newValue.map((e) => e.employeeName),
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign To"
                      margin="normal"
                      size="small"
                      disabled={isSubmitting}
                      fullWidth
                    />
                  )}
                  disabled={isSubmitting}
                />

                <TextField
                  size="small"
                  label="Description"
                  type="text"
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
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
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
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
                    label="Start Date"
                    value={data.startDate}
                    onChange={(newValue) =>
                      setData({ ...data, startDate: newValue })
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
                    label="End Date"
                    value={data.endDate}
                    onChange={(newValue) =>
                      setData({ ...data, endDate: newValue })
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

        {/* View Task Dialog */}
        <Dialog
          open={viewOpen}
          onClose={handleViewClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Task Details
            <IconButton
              style={{ float: "right" }}
              onClick={handleViewClose}
              color="default"
            >
              <IoMdCloseCircle />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {viewTask && (
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
                      Task
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewTask.taskName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Customer Name
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewTask.customerName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewTask.location}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Assigned To
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {viewTask.assignTo}
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
                        viewTask.status?.toLowerCase().replace(/\s/g, "") ||
                        "pending"
                      }`}
                    >
                      {viewTask.status || "Pending"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {formatDateForDisplay(viewTask.startDate) || "Not set"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      End Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {formatDateForDisplay(viewTask.endDate) || "Not set"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    {viewTask.description || "No description provided"}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Main Content Card */}
        <Card>
          <CardContent>
            {/* Search and Add Task Row */}
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
                placeholder="Search Tasks..."
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

              {/* Add Task Button */}
              <Button
                className="btnAddTask btn-lg"
                variant="contained"
                onClick={handleOpen}
                startIcon={<FaTasks />}
                disabled={isLoading}
                sx={{
                  whiteSpace: "nowrap",
                  minWidth: isMobile ? "100%" : "auto",
                }}
              >
                Add Task
              </Button>
            </Box>

            {/* Loading Screen or Task List */}
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <>
                {/* Task List - Table or Cards based on screen size */}
                {isMobile ? renderTaskCards() : renderTaskTable()}

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

export default Task;
