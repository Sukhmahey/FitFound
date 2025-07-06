import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { candidateApi } from '../../../services/api';
import InvitationSectionDialogbox from './InvitationSectionDialogbox';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  List,
  ListItem,
} from '@mui/material';
import useNotify from '../../../utils/notificationService';

export default function InvitationsSection({ setInvitationCount }) {
  const notify = useNotify();
  const [invitations, setInvitations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

  const { user } = useAuth();
  const profileId = user?.profileId;

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await candidateApi.fetchInteractions(profileId);
        console.log(response.data);
        const unfiltered = response.data;
        const filtered = response.data
          .filter((obj) => obj.candidateConsentToReveal === false)
          .map((obj) => ({
            invitationId: obj._id,
            employerId: obj.employerId?._id || null,
            contactPerson: obj.employerId?.contactInfo?.firstName || 'Unknown',
            employerName: obj.employerId?.companyName || 'Unknown Company',
            outreachMessage: obj.outreachMessage,
            job: obj.jobId,
            date: new Date(obj.updatedAt).toLocaleDateString(),
          }));
        setInvitations(filtered);
        setInvitationCount(unfiltered.length)
      } catch (error) {
        console.error(error);
      }
    };
    if (profileId) fetchInvitations();
  }, [profileId]);

//   useEffect(() => {
//   if (invitations.length !== 0) {
//     const seen = new Set();
    
//     const uniqueInvitations = invitations.filter((inv) => {
//       if (seen.has(inv.invitationId)) return false;
//       seen.add(inv.invitationId);
//       return true;
//     });

//     uniqueInvitations.forEach((inv) => {
//       console.log(`🔔 New unique invitation from ${inv.employerName}`);
//       notify.info(`🔔 New invitation from ${inv.employerName}`)
      
//     });

    
//   }
// }, [invitations]);
const alreadyNotified = useRef(new Set());

useEffect(() => {
  if (invitations.length !== 0) {
    const seen = new Set();
    const newUniques = invitations.filter((inv) => {
      if (seen.has(inv.invitationId)) return false;
      seen.add(inv.invitationId);
      return true;
    });

    newUniques.forEach((inv) => {
      if (!alreadyNotified.current.has(inv.invitationId)) {
        console.log(`🔔 New unique invitation from ${inv.employerName}`);
        notify.info(`🔔 New invitation from ${inv.employerName}`)
        alreadyNotified.current.add(inv.invitationId); 
      }
    });
  }
}, [invitations]);


  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Invitations
      </Typography>
      <Box p={2} border="1px solid #ccc" borderRadius={2}>
        <List>
          {invitations.map((invitation) => (
            <Paper sx={{ mb: 2, p: 2, borderRadius: 2 }} key={invitation.invitationId}>
              <ListItem
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Stack spacing={0.5}>
                  <Typography>
                    {invitation.contactPerson} is inviting you to connect
                  </Typography>
                  <Typography fontWeight="bold">
                    {invitation.employerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {invitation.date}
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSelectedInvitation(invitation);
                    setOpen(true);
                  }}
                >
                  Details
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>
        {invitations.length === 0 && (
          <Typography textAlign="center" color="text.secondary">
            No invitations yet.
          </Typography>
        )}
      </Box>

      {selectedInvitation && (
        <InvitationSectionDialogbox
          invitation={selectedInvitation}
          open={open}
          setOpen={setOpen}
        />
      )}
    </Box>
  );
}
