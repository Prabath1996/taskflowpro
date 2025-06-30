import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { FaUsers, FaUserTie, FaTools, FaTruck, FaTasks, FaShieldAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [counts, setCounts] = useState({
    customers: 0,
    employees: 0,
    repairs: 0,
    suppliers: 0,
    tasks: 0,
    warranty: 0,
  })

  // Status breakdowns
  const [warrantyStatus, setWarrantyStatus] = useState({
    receivedFromCustomer: 0,
    sentToWarranty: 0,
    receivedFromWarranty: 0,
    readyForCustomer: 0,
    deliveredToCustomer: 0,
  })

  const [taskStatus, setTaskStatus] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
    cancelled: 0,
  })

  const [repairStatus, setRepairStatus] = useState({
    received: 0,
    diagnosed: 0,
    inRepair: 0,
    completed: 0,
    delivered: 0,
  })

  // Fetch all data counts
  useEffect(() => {
    const fetchAllCounts = async () => {
      setIsLoading(true)
      try {
        // Fetch all data simultaneously
        const [customersRes, employeesRes, repairsRes, suppliersRes, tasksRes, warrantyRes] = await Promise.allSettled([
          axios.get("https://taskflowpro-exop.vercel.app/api/customers/getCustomers"),
          axios.get("https://taskflowpro-exop.vercel.app/api/employees/getEmployees"),
          axios.get("https://taskflowpro-exop.vercel.app/api/repairs/getRepairs"),
          axios.get("https://taskflowpro-exop.vercel.app/api/suppliers/getSuppliers"),
          axios.get("https://taskflowpro-exop.vercel.app/api/tasks/getTasks"),
          axios.get("https://taskflowpro-exop.vercel.app/api/warranty/getWarranty/"),
        ])

        // Process results and set counts
        const newCounts = {
          customers: customersRes.status === "fulfilled" ? customersRes.value.data.length : 0,
          employees: employeesRes.status === "fulfilled" ? employeesRes.value.data.length : 0,
          repairs: repairsRes.status === "fulfilled" ? repairsRes.value.data.length : 0,
          suppliers: suppliersRes.status === "fulfilled" ? suppliersRes.value.data.suppliers?.length || 0 : 0,
          tasks: tasksRes.status === "fulfilled" ? tasksRes.value.data.length : 0,
          warranty: warrantyRes.status === "fulfilled" ? warrantyRes.value.data.warranties?.length || 0 : 0,
        }

        setCounts(newCounts)

        // Process warranty status breakdown
        if (warrantyRes.status === "fulfilled" && warrantyRes.value.data.warranties) {
          const warranties = warrantyRes.value.data.warranties
          const statusBreakdown = {
            receivedFromCustomer: warranties.filter((w) => w.status === "Received from Customer").length,
            sentToWarranty: warranties.filter((w) => w.status === "Sent to Warranty").length,
            receivedFromWarranty: warranties.filter((w) => w.status === "Received from Warranty").length,
            readyForCustomer: warranties.filter((w) => w.status === "Ready for Customer").length,
            deliveredToCustomer: warranties.filter((w) => w.status === "Delivered to Customer").length,
          }
          setWarrantyStatus(statusBreakdown)
        }

        // Process task status breakdown
        if (tasksRes.status === "fulfilled" && tasksRes.value.data) {
          const tasks = tasksRes.value.data
          const taskStatusBreakdown = {
            pending: tasks.filter((t) => t.status === "Pending" || t.status === "pending").length,
            inProgress: tasks.filter((t) => t.status === "In Progress" || t.status === "in-progress").length,
            completed: tasks.filter((t) => t.status === "Completed" || t.status === "completed").length,
            onHold: tasks.filter((t) => t.status === "On Hold" || t.status === "on-hold").length,
            cancelled: tasks.filter((t) => t.status === "Cancelled" || t.status === "cancelled").length,
          }
          setTaskStatus(taskStatusBreakdown)
        }

        // Process repair status breakdown
        if (repairsRes.status === "fulfilled" && repairsRes.value.data) {
          const repairs = repairsRes.value.data
          const repairStatusBreakdown = {
            received: repairs.filter((r) => r.status === "Received" || r.status === "received").length,
            diagnosed: repairs.filter((r) => r.status === "Diagnosed" || r.status === "diagnosed").length,
            inRepair: repairs.filter((r) => r.status === "In Repair" || r.status === "in-repair").length,
            completed: repairs.filter((r) => r.status === "Completed" || r.status === "completed").length,
            delivered: repairs.filter((r) => r.status === "Delivered" || r.status === "delivered").length,
          }
          setRepairStatus(repairStatusBreakdown)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data", {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllCounts()
  }, [])

  // Navigation handlers
  const handleCardClick = (route) => {
    navigate(route)
  }

  // Dashboard cards configuration
  const dashboardCards = [
    {
      title: "Total Customers",
      count: counts.customers,
      icon: <FaUsers size={40} />,
      color: "#2196F3",
      route: "/customers",
      bgGradient: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
    },
    {
      title: "Total Employees",
      count: counts.employees,
      icon: <FaUserTie size={40} />,
      color: "#4CAF50",
      route: "/employees",
      bgGradient: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
    },
    {
      title: "Total Repairs",
      count: counts.repairs,
      icon: <FaTools size={40} />,
      color: "#FF9800",
      route: "/repairs",
      bgGradient: "linear-gradient(135deg, #FF9800 0%, #FFC107 100%)",
    },
    {
      title: "Total Suppliers",
      count: counts.suppliers,
      icon: <FaTruck size={40} />,
      color: "#9C27B0",
      route: "/suppliers",
      bgGradient: "linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)",
    },
    {
      title: "Total Tasks",
      count: counts.tasks,
      icon: <FaTasks size={40} />,
      color: "#F44336",
      route: "/tasks",
      bgGradient: "linear-gradient(135deg, #F44336 0%, #FF5722 100%)",
    },
    {
      title: "Total Warranty Items",
      count: counts.warranty,
      icon: <FaShieldAlt size={40} />,
      color: "#607D8B",
      route: "/warranty",
      bgGradient: "linear-gradient(135deg, #607D8B 0%, #78909C 100%)",
    },
  ]

  // Status configurations
  const warrantyStatusConfig = [
    {
      label: "Received from Customer",
      count: warrantyStatus.receivedFromCustomer,
      color: "info",
      bgColor: "#E3F2FD",
    },
    {
      label: "Sent to Warranty",
      count: warrantyStatus.sentToWarranty,
      color: "warning",
      bgColor: "#FFF3E0",
    },
    {
      label: "Received from Warranty",
      count: warrantyStatus.receivedFromWarranty,
      color: "success",
      bgColor: "#E8F5E8",
    },
    {
      label: "Ready for Customer",
      count: warrantyStatus.readyForCustomer,
      color: "primary",
      bgColor: "#E3F2FD",
    },
    {
      label: "Delivered to Customer",
      count: warrantyStatus.deliveredToCustomer,
      color: "default",
      bgColor: "#F5F5F5",
    },
  ]

  const taskStatusConfig = [
    {
      label: "Pending",
      count: taskStatus.pending,
      color: "warning",
      bgColor: "#FFF3E0",
    },
    {
      label: "In Progress",
      count: taskStatus.inProgress,
      color: "info",
      bgColor: "#E3F2FD",
    },
    {
      label: "Completed",
      count: taskStatus.completed,
      color: "success",
      bgColor: "#E8F5E8",
    },
    {
      label: "On Hold",
      count: taskStatus.onHold,
      color: "default",
      bgColor: "#F5F5F5",
    },
    {
      label: "Cancelled",
      count: taskStatus.cancelled,
      color: "error",
      bgColor: "#FFEBEE",
    },
  ]

  const repairStatusConfig = [
    {
      label: "Received",
      count: repairStatus.received,
      color: "info",
      bgColor: "#E3F2FD",
    },
    {
      label: "Diagnosed",
      count: repairStatus.diagnosed,
      color: "warning",
      bgColor: "#FFF3E0",
    },
    {
      label: "In Repair",
      count: repairStatus.inRepair,
      color: "primary",
      bgColor: "#E3F2FD",
    },
    {
      label: "Completed",
      count: repairStatus.completed,
      color: "success",
      bgColor: "#E8F5E8",
    },
    {
      label: "Delivered",
      count: repairStatus.delivered,
      color: "default",
      bgColor: "#F5F5F5",
    },
  ]

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading Dashboard...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {/* Header Card */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h3" fontWeight={600}>
            Dashboard
          </Typography>
          <Typography variant="subtitle2" component="h6" color="textSecondary">
            Overview of all system data
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }} />

      {/* Count Cards Grid*/}
      <Grid container spacing={5} justifyContent={"center"}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card
              sx={{
                background: card.bgGradient,
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
                height: "160px",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={() => handleCardClick(card.route)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: "100%",
                  flex: 1,
                }}
              >
                <Box sx={{ mb: 1, opacity: 0.9 }}>{card.icon}</Box>
                <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {card.count}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }} />

      {/* Tasks Status Breakdown Card */}
      <Card
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
          mb: 4,
        }}
        onClick={() => handleCardClick("/tasks")}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FaTasks size={32} color="#F44336" />
              <Box>
                <Typography variant="h5" component="h3" fontWeight={600}>
                  Tasks Status Overview
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Current status breakdown of all tasks
                </Typography>
              </Box>
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="error">
              {counts.tasks}
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent={"center"}>
            {taskStatusConfig.map((status, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card
                  sx={{
                    backgroundColor: status.bgColor,
                    border: "1px solid",
                    borderColor: `${status.color}.light`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      py: 2,
                      "&:last-child": { pb: 2 },
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                      {status.count}
                    </Typography>
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        height: "auto",
                        "& .MuiChip-label": {
                          px: 1,
                          py: 0.5,
                          whiteSpace: "normal",
                          lineHeight: 1.2,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}/>
        </CardContent>
      </Card>

      {/* Repairs Status Breakdown Card */}
      <Card
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
          mb: 4,
        }}
        onClick={() => handleCardClick("/repair")}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FaTools size={32} color="#FF9800" />
              <Box>
                <Typography variant="h5" component="h3" fontWeight={600}>
                  Repairs Status Overview
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Current status breakdown of all repairs
                </Typography>
              </Box>
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="warning.main">
              {counts.repairs}
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent={"center"}>
            {repairStatusConfig.map((status, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card
                  sx={{
                    backgroundColor: status.bgColor,
                    border: "1px solid",
                    borderColor: `${status.color}.light`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      py: 2,
                      "&:last-child": { pb: 2 },
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                      {status.count}
                    </Typography>
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        height: "auto",
                        "& .MuiChip-label": {
                          px: 1,
                          py: 0.5,
                          whiteSpace: "normal",
                          lineHeight: 1.2,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}/>
        </CardContent>
      </Card>

      {/* Warranty Status Breakdown Card */}
      <Card
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
        onClick={() => handleCardClick("/warranty")}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FaShieldAlt size={32} color="#607D8B" />
              <Box>
                <Typography variant="h5" component="h3" fontWeight={600}>
                  Warranty Status Overview
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Current status breakdown of all warranty items
                </Typography>
              </Box>
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="primary">
              {counts.warranty}
            </Typography>
          </Box>

          <Grid container spacing={2} justifyContent={"center"}>
            {warrantyStatusConfig.map((status, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card
                  sx={{
                    backgroundColor: status.bgColor,
                    border: "1px solid",
                    borderColor: `${status.color}.light`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      py: 2,
                      "&:last-child": { pb: 2 },
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                      {status.count}
                    </Typography>
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        height: "auto",
                        "& .MuiChip-label": {
                          px: 1,
                          py: 0.5,
                          whiteSpace: "normal",
                          lineHeight: 1.2,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}/>
        </CardContent>
      </Card>
    </>
  )
}

export default Dashboard
