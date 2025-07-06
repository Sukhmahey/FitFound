import { Grid, Paper } from '@mui/material';
import { useContext } from 'react';
import { AppInfoContext } from "../contexts/AppInfoContext";

const Header = () => {
    const { appGeneralInfo } = useContext(AppInfoContext);

    return (
        <div>
            
            

            <Grid container spacing={2}>
                <Grid size={10}>
                    <div>{appGeneralInfo.pageTitle}</div>
                </Grid>
                <Grid size={2}>
                    <div>
                    <div>Notifications</div>
                    <a href='/settings'>Settings</a>
                </div>
                </Grid>
            </Grid>

        </div>
    );
};

export default Header;