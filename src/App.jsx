import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Error from "./pages/Error";
import Meeting from "./pages/Meeting";
import Homepage from "./pages/Homepage";
import Error404 from "./pages/Error404.";
import PrivateRoutes from "./components/PrivateRoutes";

const App = () => {
  return (
    <div className="h-screen bg-slate-100 overflow-hidden">
      <Router >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route element={<PrivateRoutes />}>
            <Route path=":meetingCode" element={<Meeting />} />
          </Route>
          <Route path="/error" element={<Error />} />
          <Route path="/*" element={<Error404 />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
