import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

/**
 * @param {ReactNode} children 
 * @param {string[]} roles 
 */
export function RequireAuth({ children, roles = [] }) {
  const { user } = useContext(AuthContext);

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
