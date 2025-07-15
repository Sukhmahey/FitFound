import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { candidateApi } from "../../../services/api";
import InvitationSectionDialogbox from "./InvitationSectionDialogbox";
import useNotify from "../../../utils/notificationService";

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  List,
  ListItem,
  Divider,
} from "@mui/material";

const primaryColor = "#0E3A62";
const cardBg = "#F5F7FA";

export default function InvitationsSection({ setInvitationCount }) {
  const notify = useNotify();
  const [invitations, setInvitations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

  const { user } = useAuth();
  const profileId = user?.profileId;

  const alreadyNotified = useRef(new Set());

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await candidateApi.fetchInteractions(profileId);
        const unfiltered = response.data;
        const filtered = response.data
          .filter((obj) => obj.candidateConsentToReveal === false)
          .map((obj) => ({
            invitationId: obj._id,
            employerId: obj.employerId?._id || null,
            contactPerson: obj.employerId?.contactInfo?.firstName || "Unknown",
            employerName: obj.employerId?.companyName || "Unknown Company",
            outreachMessage: obj.outreachMessage,
            job: obj.jobId,
            date: new Date(obj.updatedAt).toLocaleDateString(),
          }));
        setInvitations(filtered);
        setInvitationCount(unfiltered.length);
      } catch (error) {
        console.error(error);
      }
    };
    if (profileId) fetchInvitations();
  }, [profileId]);

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
          notify.info(`🔔 New invitation from ${inv.employerName}`);
          alreadyNotified.current.add(inv.invitationId);
        }
      });
    }
  }, [invitations]);

  return (
    <Box mt={4}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          color: primaryColor,
          mb: 2,
        }}
      >
        Invitations
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: cardBg,
        }}
      >
        <List disablePadding>
          {invitations.map((invitation) => (
            <Paper
              key={invitation.invitationId}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "white",
                mb: 2,
              }}
              elevation={1}
            >
              <ListItem
                disableGutters
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    sx={{
                      fontFamily: "Figtree, sans-serif",
                      fontSize: 14,
                      color: "#333",
                    }}
                  >
                    <strong>{invitation.contactPerson}</strong> is inviting you
                    to connect
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: 16,
                      color: primaryColor,
                    }}
                  >
                    {invitation.employerName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Figtree, sans-serif",
                      fontSize: 12,
                      color: "#777",
                    }}
                  >
                    {invitation.date}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedInvitation(invitation);
                    setOpen(true);
                  }}
                  sx={{
                    fontFamily: "Figtree, sans-serif",
                    textTransform: "none",
                    backgroundColor: primaryColor,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontSize: 13,
                    mt: { xs: 1, sm: 0 },
                    "&:hover": {
                      backgroundColor: "#062F54",
                    },
                  }}
                >
                  View Details
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>

        {invitations.length === 0 && (
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{
              fontFamily: "Figtree, sans-serif",
              fontSize: 14,
              mt: 2,
            }}
          >
            No invitations yet.
          </Typography>
        )}
      </Paper>

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
