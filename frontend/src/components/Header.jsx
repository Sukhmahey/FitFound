import { Grid, Paper } from '@mui/material';

const Header = () => {
    return (
        <div>
            
            

            <Grid container spacing={2}>
                <Grid size={10}>
                    <div>Page Title</div>
                </Grid>
                <Grid size={2}>
                    <div>
                    <div>Notifications</div>
                    <div>Settings</div>
                </div>
                </Grid>
            </Grid>

        </div>
    );
};

export default Header;