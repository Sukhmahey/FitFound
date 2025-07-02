import { useEffect, useState } from "react";
import { useContext } from 'react';

import { AppInfoContext } from "../../contexts/AppInfoContext";
import PopularTech from "./dashboardSections/PopularTech";
import RecentSearch from "./dashboardSections/RecentSearch";

const EmployerDashboard = () => {
  const { setAppGeneralInfo } = useContext(AppInfoContext);
    
      useEffect(() => {
          setAppGeneralInfo({ pageTitle: "Dashboard"});
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
