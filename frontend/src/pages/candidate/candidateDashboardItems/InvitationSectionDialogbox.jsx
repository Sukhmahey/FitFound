import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { candidateApi } from '../../../services/api';

export default function InvitationSectionDialogbox({ invitation, open, setOpen }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const consentUpdate = async () => {
    try {
      const response = await candidateApi.setConsent(invitation.invitationId, true);
      console.log('Consent updated:', response);
    } catch (error) {
      console.error('Consent update failed:', error);
    }
  };

  const handleClose = async (agree = false) => {
    setOpen(false);
    if (agree) {
      await consentUpdate();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {invitation.employerName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {invitation.outreachMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Close</Button>
        <Button onClick={() => handleClose(true)} autoFocus>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
