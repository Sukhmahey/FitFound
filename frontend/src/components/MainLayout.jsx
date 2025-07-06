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
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "250px 1fr" },
          minHeight: "100vh",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            gridColumn: { xs: "1", md: "1" },
            gridRow: "1 / span 3",
            bgcolor: "#062F54",
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content Area (Header + Outlet + Footer) */}
        <Box
          sx={{
            gridColumn: { xs: "1", md: "2" },
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
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
          <Footer />
        </Box>
      </Box>
    </AppInfoContext.Provider>
  );
};

export default MainLayout;
