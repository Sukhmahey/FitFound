import React from 'react';
import {
  Typography, Box, FormGroup, FormControlLabel, Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNotification } from '../../../contexts/NotificationContext';

export default function NotificationPermission() {
  const { isMuted, toggleMute } = useNotification(); 

  const soundOnIcon = encodeURIComponent(`...`);
  const silentIcon = encodeURIComponent(`...`);

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
