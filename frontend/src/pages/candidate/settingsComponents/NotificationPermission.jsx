import React from 'react';
import {
  Typography, Box, FormGroup, FormControlLabel, Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNotification } from '../../../contexts/NotificationContext';

export default function NotificationPermission() {
  const { isMuted, toggleMute } = useNotification(); 

  const silentIcon = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-2.8-1.6-5.2-4-6.3V4a2 2 0 0 0-4 0v.7c-2.4 1.1-4 3.5-4 6.3v5l-2 2v1h16v-1l-2-2z"/>
</svg>
`);

  const soundOnIcon = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
  <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6.29-5.88L18 15v-5c0-3.07-1.63-5.64-4.5-6.32V3a1.5 1.5 0 0 0-3 0v.68c-.46.1-.9.24-1.31.42l10.1 10.1zM4.27 3L3 4.27l4.39 4.39C7.14 9.57 7 10.27 7 11v5l-2 2v1h12.73l1 1L20 19.73 4.27 3z"/>
</svg>
`);

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        transform: 'translateX(22px)',
        color: '#fff',
        '& .MuiSwitch-thumb:before': {
          width: '1.5rem',
          marginLeft : '.25rem',
          backgroundImage: `url("data:image/svg+xml;utf8,${silentIcon}")`,
        },
        '& + .MuiSwitch-track': {
          backgroundColor: '#8796A5',
          opacity: 1,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '1.5rem',
          marginLeft : '.25rem',
        backgroundImage: `url("data:image/svg+xml;utf8,${soundOnIcon}")`,
      },
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#aab4be',
      borderRadius: 20 / 2,
      opacity: 1,
    },
  }));

  return (
    <Box sx={{ maxWidth: '50rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
      <Typography component={"h5"}>Manage when you’ll receive notifications.</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={!isMuted}
              onChange={toggleMute}
            />
          }
          label={!isMuted ? 'Notifications On' : 'Notifications Off'}
        />
      </FormGroup>
    </Box>
  );
}
