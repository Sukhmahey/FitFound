import { useState } from "react";
import { AppInfoContext } from "../contexts/AppInfoContext";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [appGeneralInfo, setAppGeneralInfo] = useState({});

  return (
    <AppInfoContext.Provider value={{ appGeneralInfo, setAppGeneralInfo }}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Fixed Sidebar (non-scrollable) */}
        <Box
          sx={{
            width: { xs: "100%", md: "250px" },
            flexShrink: 0,
            bgcolor: "#062F54",
            minHeight: "100vh",
            position: "sticky",
            top: 0,
          }}
        >
          <Sidebar />
        </Box>

        {/* Scrollable Main Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Sticky Header */}
          <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
            <Header />
          </Box>

          {/* Scrollable Content */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
            <Outlet />
          </Box>

          {/* Footer */}
          <Box sx={{ borderTop: "1px solid #eee" }}>
            <Footer />
          </Box>
        </Box>
      </Box>
    </AppInfoContext.Provider>
  );
};

export default MainLayout;
