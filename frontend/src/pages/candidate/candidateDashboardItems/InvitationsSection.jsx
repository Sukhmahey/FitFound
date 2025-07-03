import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { candidateApi } from '../../../services/api';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function InvitationsSection() {
  const [invitations, setInvitations] = useState([]);
  const { user } = useAuth();
  const profileId = user?.profileId;

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await candidateApi.fetchInteractions(profileId);
        console.log(response.data)
        const filtered = response.data
          .filter((obj) => obj.candidateConsentToReveal === false)
          .map((obj) => ({
            invitationId: obj._id,
            employerId: obj.employerId._id,
            employerName: obj.employerId.companyName,
            outreachMessage: obj.outreachMessage,
            job: obj.jobId,
            date: new Date(obj.updatedAt).toLocaleDateString(),
          }));
        setInvitations(filtered);
      } catch (error) {
        console.error(error);
      }
    };
    if (profileId) fetchInvitations();
  }, [profileId]);

  const Details = ({ e }) =>{
    console.log(e);

  };

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
                  elevation={2}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography fontWeight="bold">
                      {invitation.employerName} is inviting you to connect
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {invitation.date}
                    </Typography>
                  </Stack>
                  <Button variant="outlined" color="primary" onClick={(invitation)=>Details}>
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
    </Box>
  );
}
