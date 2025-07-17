import { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppInfoContext } from "../../contexts/AppInfoContext";
import { useAuth } from "../../contexts/AuthContext";
import { employerApi } from "../../services/api";
import PopularTech from "./dashboardSections/PopularTech";
import RecentSearch from "./dashboardSections/RecentSearch";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Dashboard" });
  }, []);

  return (
    <div>
      <div>
        <PopularTech></PopularTech>
        <RecentSearch></RecentSearch>
      </div>
    </div>
  );
};

export default EmployerDashboard;
