// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   Stack,
//   IconButton,
//   InputAdornment,
//   Box,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { FaUserPlus, FaEdit, FaSearch } from "react-icons/fa";
// import { IoMdCloseCircle } from "react-icons/io";
// import { MdDelete } from "react-icons/md";
// import { GrFormPrevious, GrFormNext } from "react-icons/gr";
// import "./Customer.css";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Customers = () => {

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));

//   // Dialog state
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//  // Add these state variables after the existing ones
//   const [editMode, setEditMode] = useState(false)
//   const [selectedCustomer, setSelectedCustomer] = useState(null)

//   // Sample customer data
//   const [formData, setFormData] = useState([]);

// //get data from database
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/customers/getCustomers");
//         if (response.status === 200) {
//           console.log("Customer data fetched successfully:", response.data);
//           setFormData(response.data);
//         }

//       } catch (error) {
//         console.error("Error fetching customer data:", error);
//       }
//     };
//     fetchData();
//   }, []);

// //Add customer
// const [data, setData] = useState({
//   customerName: '',
//   email: '',
//   address: '',
//   phoneNo: '',
// });

// const handleAddCustomer = async (e) => {
//   e.preventDefault();

//   const {customerName,email,address,phoneNo} = data;

//   // try {
//   //   const {data} = await axios.post("http://localhost:5000/api/customers/addCustomers", {customerName,email,address,phoneNo});
    
//   //   if(data.error){
//   //       toast.error(data.error,{position:"bottom-left"}) 

//   //     }else{
//   //      resetForm();
//   //       toast.success('Customer Added Successfully',{position:"bottom-left"})
//   //       setFormData((prev) => [...prev, data]);
//   //     }
//   // } catch (error) {
//   //   console.log(error)
//   // }
//  try {
//       if (editMode && selectedCustomer) {
//         // Update existing customer
//         const response = await axios.put(`http://localhost:5000/api/customers/updateCustomer/${selectedCustomer._id}`, {
//           customerName,
//           email,
//           address,
//           phoneNo,
//         })

//         if (response.data.error) {
//           toast.error(response.data.error, { position: "bottom-left" })
//         } else {
//           // Update the customer in the local state
//           setFormData((prev) =>
//             prev.map((customer) =>
//               customer._id === selectedCustomer._id ? { ...customer, customerName, email, address, phoneNo } : customer,
//             ),
//           )
//           toast.success("Customer Updated Successfully", { position: "bottom-left" })
//           handleClose()
//           resetForm()
//         }
//       } else {
//         // Add new customer (existing code)
//         const { data: responseData } = await axios.post("http://localhost:5000/api/customers/addCustomers", {customerName,email,address,phoneNo,})

//         if (responseData.error) {
//           toast.error(responseData.error, { position: "bottom-left" })
//         } else {
//           setData({
//             customerName: "",
//             email: "",
//             address: "",
//             phoneNo: "",
//           })
//           toast.success("Customer Added Successfully", { position: "bottom-left" })
//           setFormData((prev) => [...prev, responseData])
//           handleClose()
//         }
//       }
//     } catch (error) {
//       console.log(error)
//       toast.error("Operation failed", { position: "bottom-left" })
//     }

// };

// //Update customer






//  // Reset form function
//   const resetForm = () => {
//     setData({
//       customerName: "",
//       email: "",
//       address: "",
//       phoneNo: "",
//     })
//     setEditMode(false)
//     setSelectedCustomer(null)
//   }

//  // Handle edit customer
//   const handleEditCustomer = (customer) => {
//     setSelectedCustomer(customer)
//     setData({
//       customerName: customer.customerName,
//       email: customer.email,
//       address: customer.address,
//       phoneNo: customer.phoneNo,
//     })
//     setEditMode(true)
//     setOpen(true)
//   }


//   // Search state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredCustomers, setFilteredCustomers] = useState([]);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Filter customers based on search term
//   useEffect(() => {
//     const results = formData.filter(
//       (customerRec) =>
//         customerRec.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customerRec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customerRec.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customerRec.phoneNo.includes(searchTerm)
//     );
//     setFilteredCustomers(results);
//     setCurrentPage(1); // Reset to first page when search changes
//   }, [searchTerm, formData]);

//  // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Calculate pagination
//   const totalItems = filteredCustomers.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredCustomers.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Render customer cards for mobile view
//   const renderCustomerCards = () => {
//     return currentItems.map((customer) => (
//       <Card key={customer._id} className="customer-card" sx={{ mb: 2, p: 2 }}>
//         <Typography variant="h6">{customer.customerName}</Typography>
//         <Typography variant="body2">
//           <strong>Address:</strong> {customer.address}
//         </Typography>
//         <Typography variant="body2">
//           <strong>Phone:</strong> {customer.phoneNo}
//         </Typography>
//         <Typography variant="body2">
//           <strong>Email:</strong> {customer.email}
//         </Typography>
//         <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//           <Button
//             type="submit"
//             onClick={() => handleEditCustomer(customer)}
//             variant="contained"
//             color="success"
//             size="small"
//             startIcon={<FaEdit />}
//           >
//             Edit
//           </Button>
//           <Button
//             type="submit"
//             onClick={customer._id}
//             variant="outlined"
//             color="error"
//             size="small"
//             startIcon={<MdDelete />}
//           >
//             Delete
//           </Button>
//         </Box>
//       </Card>
//     ));
//   };

//   // Render customer table for desktop view
//   const renderCustomerTable = () => {
//     return (
//       <div className="customerTableWrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>Customer Name</th>
//               {!isTablet && <th>Address</th>}
//               <th>Phone No</th>
//               {!isTablet && <th>Email</th>}
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.map((customer) => {
//               return (  
//               <tr key={customer._id}>
//                 <td>{customer.customerName}</td>
//                 {!isTablet && <td>{customer.address}</td>}
//                 <td>{customer.phoneNo}</td>
//                 {!isTablet && <td>{customer.email}</td>}
//                 <td>
//                   <div className="actions">
//                     <Button
//                       onClick={() => handleEditCustomer(customer)}
//                       variant="contained"
//                       color="success"
//                       size={isTablet ? "small" : "medium"}
//                       startIcon={<FaEdit />}
//                     >
//                       {!isTablet && "Edit"}
//                     </Button>
//                     <Button
                      
//                       variant="outlined"
//                       color="error"
//                       size={isTablet ? "small" : "medium"}
//                       startIcon={<MdDelete />}
//                     >
//                       {!isTablet && "Delete"}
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Card>
//         <CardContent>
//           <Typography variant="h5" component="h3" fontWeight={600}>
//             Customers
//           </Typography>
//           <Typography variant="subtitle2" component="h6" color="textSecondary">
//             Dashboard / Customers
//           </Typography>
//         </CardContent>
//       </Card>

//       <br />

//       {/* Add Customer Dialog */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>
//           Add Customer
//           <IconButton
//             style={{ float: "right" }}
//             onClick={handleClose}
//             color="default"
//           >
//             <IoMdCloseCircle />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <Stack spacing={2} sx={{ width: "100%" }}>
//             <form onSubmit={handleAddCustomer}>
//               <TextField
//                 size="small"
//                 autoFocus
//                 type="text"
//                 value={data.customerName}
//                 onChange={(e) => setData({...data,customerName:e.target.value})}
//                 label="Customer Name"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 size="small"
//                 label="Address"
//                 type="text"
//                 value={data.address}
//                 onChange={(e) => setData({...data,address:e.target.value})}
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 size="small"
//                 label="Phone No"
//                 type="text"
//                 value={data.phoneNo}
//                 onChange={(e) => setData({...data,phoneNo:e.target.value})}
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 size="small"
//                 label="Email"
//                 type="email"
//                 value={data.email}
//                 onChange={(e) => setData({...data,email:e.target.value})}
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//               />
//               <Button type="submit" className="btn-lg" variant="contained" color="primary" sx={{ mt: 2 }}>
//                 {editMode ? "Update" : "Submit"}
//               </Button>
//             </form>
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       {/* Main Content Card */}
//       <Card>
//         <CardContent>
//           {/* Search and Add Customer Row */}
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "space-between",
//               alignItems: isMobile ? "stretch" : "center",
//               gap: 2,
//               mb: 3,
//             }}
//           >
//             {/* Search Bar */}
//             <TextField
//               placeholder="Search customers..."
//               variant="outlined"
//               size="small"
//               fullWidth={isMobile}
//               sx={{ maxWidth: isMobile ? "100%" : "300px" }}
//               onChange={handleSearchChange}
//               value={searchTerm}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FaSearch />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Add Customer Button */}
//             <Button className="btnAddCustomer btn-lg"
//               variant="contained"
//               onClick={handleOpen}
//               startIcon={<FaUserPlus />}
//               sx={{
//                 whiteSpace: "nowrap",
//                 minWidth: isMobile ? "100%" : "auto",
//               }}
//             >
//               Add Customer
//             </Button>
//           </Box>

//           {/* Customer List - Table or Cards based on screen size */}
//           {isMobile ? renderCustomerCards() : renderCustomerTable()}

//           {/* Pagination Controls */}
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "space-between",
//               alignItems: isMobile ? "center" : "center",
//               gap: 2,
//               mt: 3,
//             }}
//           >
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <Button
//                 variant="outlined"
//                 onClick={handlePrevPage}
//                 disabled={currentPage === 1}
//               >
//                 <GrFormPrevious />
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 <GrFormNext />
//               </Button>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: isMobile ? "column" : "row",
//                 alignItems: "center",
//                 gap: isMobile ? 1 : 3,
//                 fontSize: "0.875rem",
//               }}
//             >
//               <Typography variant="body2">
//                 Page {currentPage} of {totalPages || 1}
//               </Typography>
//               <Typography variant="body2">
//                 Showing {Math.min(itemsPerPage, currentItems.length)} of{" "}
//                 {totalItems} items
//               </Typography>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>
//     </>
//   );
// };

// export default Customers;
"use client"

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
} from "@mui/material"
import { FaUserPlus, FaEdit, FaSearch } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { GrFormPrevious, GrFormNext } from "react-icons/gr"
import "./Customer.css"
import axios from "axios"
import toast from "react-hot-toast"

const Customers = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Dialog state
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)

  // Add these state variables after the existing ones
  const [editMode, setEditMode] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Sample customer data
  const [formData, setFormData] = useState([])

  //get data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers/getCustomers")
        if (response.status === 200) {
          console.log("Customer data fetched successfully:", response.data)
          setFormData(response.data)
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)
      }
    }
    fetchData()
  }, [])

  //Add customer
  const [data, setData] = useState({
    customerName: "",
    email: "",
    address: "",
    phoneNo: "",
  })

  const handleAddCustomer = async (e) => {
    e.preventDefault()

    const { customerName, email, address, phoneNo } = data

    try {
      if (editMode && selectedCustomer) {
      
        // Update existing customer
        const response = await axios.put(`http://localhost:5000/api/customers/updateCustomers/${selectedCustomer._id}`, {
          customerName,
          email,
          address,
          phoneNo,
        })

        if (response.data.error) {
          toast.error(response.data.error, { position: "bottom-left" })
        } else {
          // Update the customer in the local state
          setFormData((prev) =>
            prev.map((customer) =>
              customer._id === selectedCustomer._id ? { ...customer, customerName, email, address, phoneNo } : customer,
            ),
          )
          toast.success("Customer Updated Successfully", { position: "bottom-left" })
          handleClose()
          resetForm()
        }
      } else {
        // Add new customer (existing code)
        const { data: responseData } = await axios.post("http://localhost:5000/api/customers/addCustomers", {
          customerName,
          email,
          address,
          phoneNo,
        })

        if (responseData.error) {
          toast.error(responseData.error, { position: "bottom-left" })
        } else {
          setData({
            customerName: "",
            email: "",
            address: "",
            phoneNo: "",
          })
          toast.success("Customer Added Successfully", { position: "bottom-left" })
          setFormData((prev) => [...prev, responseData])
          handleClose()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Operation failed", { position: "bottom-left" })
    }
  }

  // Reset form function
  const resetForm = () => {
    setData({
      customerName: "",
      email: "",
      address: "",
      phoneNo: "",
    })
    setEditMode(false)
    setSelectedCustomer(null)
  }

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer)
    setData({
      customerName: customer.customerName,
      email: customer.email,
      address: customer.address,
      phoneNo: customer.phoneNo,
    })
    setEditMode(true)
    setOpen(true)
  }

  // Handle delete customer
  const handleDeleteCustomer = async (customerId) => {
    
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/customers/deleteCustomers/${customerId}`)

        if (response.data.error) {
          toast.error(response.data.error, { position: "bottom-left" })
        } else {
          // Remove customer from local state
          setFormData((prev) => prev.filter((customer) => customer._id !== customerId))
          toast.success("Customer Deleted Successfully", { position: "bottom-left" })
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to delete customer", { position: "bottom-left" })
      }
    }
  }

  //Update customer

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter customers based on search term
  useEffect(() => {
    const results = formData.filter(
      (customerRec) =>
        customerRec.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerRec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerRec.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerRec.phoneNo.includes(searchTerm),
    )
    setFilteredCustomers(results)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm, formData])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Calculate pagination
  const totalItems = filteredCustomers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)

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

  // Render customer cards for mobile view
  const renderCustomerCards = () => {
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
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleDeleteCustomer(customer._id)}
            variant="outlined"
            color="error"
            size="small"
            startIcon={<MdDelete />}
          >
            Delete
          </Button>
        </Box>
      </Card>
    ))
  }

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
            {currentItems.map((customer) => {
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
                      >
                        {!isTablet && "Edit"}
                      </Button>
                      <Button
                        onClick={() => handleDeleteCustomer(customer._id)}
                        variant="outlined"
                        color="error"
                        size={isTablet ? "small" : "medium"}
                        startIcon={<MdDelete />}
                      >
                        {!isTablet && "Delete"}
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
          <IconButton style={{ float: "right" }} onClick={handleClose} color="default">
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
                value={data.customerName}
                onChange={(e) => setData({ ...data, customerName: e.target.value })}
                label="Customer Name"
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                size="small"
                label="Address"
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                size="small"
                label="Phone No"
                type="text"
                value={data.phoneNo}
                onChange={(e) => setData({ ...data, phoneNo: e.target.value })}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                size="small"
                label="Email"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Button type="submit" className="btn-lg" variant="contained" color="primary" sx={{ mt: 2 }}>
                {editMode ? "Update" : "Submit"}
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
              sx={{
                whiteSpace: "nowrap",
                minWidth: isMobile ? "100%" : "auto",
              }}
            >
              Add Customer
            </Button>
          </Box>

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
        </CardContent>
      </Card>
    </>
  )
}

export default Customers
