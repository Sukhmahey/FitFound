import { Grid, Paper } from '@mui/material';
import { useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppInfoContext } from "../contexts/AppInfoContext";
import { Link } from 'react-router-dom';
import DashboardBell from '../pages/DashboardBell';

const Header = () => {
    const { appGeneralInfo } = useContext(AppInfoContext);
    const { user } = useAuth();

    const settingsPath = user?.role === 'candidate'
        ? '/candidate/settings'
        : user?.role === 'employer'
            ? '/employer/settings'
            : '/settings';

    return (
        <div>



            <Grid container spacing={2}>
                <Grid size={10}>
                    <div>{appGeneralInfo.pageTitle}</div>
                </Grid>
                <Grid size={2}>
                    <div>
                        <DashboardBell></DashboardBell>
                        <Link to={settingsPath}>Settings</Link>
                    </div>
                </Grid>
            </Grid>

        </div>
    );
};

export default Header;