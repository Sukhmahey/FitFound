import { useEffect, useState } from "react";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppInfoContext } from "../../contexts/AppInfoContext";
import { useAuth } from '../../contexts/AuthContext';
import { employerApi } from "../../services/api";
import PopularTech from "./dashboardSections/PopularTech";
import RecentSearch from "./dashboardSections/RecentSearch";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { setAppGeneralInfo } = useContext(AppInfoContext);
  const { user } = useAuth();
  const userId = user?.userId;
  const [userProfile, setUserProfile] = useState({});
    
  useEffect(() => {
      setAppGeneralInfo({ pageTitle: "Dashboard"});

      // Getting the user profile by ID
      employerApi.getEmployerProfile(userId)
      .then( result => {
        setUserProfile(result.data);;
      })
      .catch( error => {
        navigate('/login');
      });

  }, []);
  

  return (
    <div>
      <div>
        <PopularTech></PopularTech>
        <RecentSearch userProfile = { userProfile }></RecentSearch>
      </div>
    </div>
  );
};

export default EmployerDashboard;
