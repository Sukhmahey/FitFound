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
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Fixed Sidebar */}
        <Box
          sx={{
            width: { md: "250px" },
            flexShrink: 0,
            bgcolor: "#062F54",
            minHeight: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "auto",
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Area */}
        <Box
          sx={{
            marginLeft: { md: "250px" },
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
          }}
        >
          {/* Sticky Header */}
          <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
            <Header />
          </Box>

          {/* Scrollable Content + Footer */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Outlet />
            </Box>

            <Box sx={{ borderTop: "1px solid #eee" }}>
              <Footer />
            </Box>
          </Box>
        </Box>
      </Box>
    </AppInfoContext.Provider>
  );
};

export default MainLayout;
