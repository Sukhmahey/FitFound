import { useState } from "react";
import { AppInfoContext } from "../contexts/AppInfoContext";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

const MainLayout = () => {
  const [appGeneralInfo, setAppGeneralInfo] = useState({});
  const isMobile = useMediaQuery("(max-width: 899px)");

  return (
    <AppInfoContext.Provider value={{ appGeneralInfo, setAppGeneralInfo }}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {!isMobile && (
          <Box
            sx={{
              width: "250px",
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
        )}

        <Box
          sx={{
            marginLeft: { md: "250px" },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <Header />

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                pb: isMobile ? 8 : 2, // reserve space for bottom nav
              }}
            >
              <Outlet />
            </Box>

            <Box sx={{ borderTop: "1px solid #eee", pb: isMobile ? 8 : 2 }}>
              <Footer />
            </Box>
          </Box>

          {isMobile && <MobileBottomNav />}
        </Box>
      </Box>
    </AppInfoContext.Provider>
  );
};

export default MainLayout;
