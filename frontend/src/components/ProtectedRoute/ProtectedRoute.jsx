import { Navigate } from "react-router-dom";
import { SessionManager } from "../Utils/SessionManager";



const ProtectedRoute = ({ children }) => {
  const isLoggedIn = SessionManager.isLoggedIn()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute;
