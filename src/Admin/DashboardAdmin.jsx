import React from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/Auth";

function DashboardAdmin() {
  const { logout } = useContext(AuthContext);
  return (
    <div>
      <h1>Dashboard</h1>
      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default DashboardAdmin   
