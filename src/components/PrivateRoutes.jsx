import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { validate } from "uuid";

const PrivateRoutes = () => {
  const { meetingCode } = useParams();
  return validate(meetingCode) ? <Outlet /> : <Navigate to="/error" />;
};

export default PrivateRoutes;
