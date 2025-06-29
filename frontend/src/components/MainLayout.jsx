import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';


const MainLayout = () => {
    return (
        <div>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '20% 80%',
                    gridTemplateRows: '100px 1fr 100px',
                    gap: 2,
                    height: '100vh',
                    padding: 2,
                }}
                >
                <Box sx={{ gridRow: '1 / span 3' }}>
                    <Sidebar></Sidebar>
                </Box>
                <Box sx={{ gridRow: '1' }}>
                    <Header></Header>
                </Box>
                <Box sx={{ gridRow: '2' }}>
                    <Outlet></Outlet>
                </Box>
                <Box sx={{ gridRow: '3' }}>
                    <Footer></Footer>
                </Box>
            </Box>
        </div>
    );
};

export default MainLayout;