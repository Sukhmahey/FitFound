import React from 'react'
import { useEffect } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

function ProfileSummary({ profileScore, invitationCount }) {

    // const [profileScore, setProfileScore] = React.useState(0);
    const [profileScoreRemark, setProfileScoreRemark] = React.useState('');
    const [appearanceScore, setAppearanceScore] = React.useState(85);
    // const [invitationScore, setInvitationScore] = React.useState(10);



    useEffect(() => {
        if (profileScore >= 90) {
            setProfileScoreRemark('Exceptional!');
        } else if (profileScore >= 80) {
            setProfileScoreRemark('Excellent!');
        } else if (profileScore >= 60) {
            setProfileScoreRemark('Good!');
        } else if (profileScore >= 40) {
            setProfileScoreRemark('Lets Boost This!');
        } else {
            setProfileScoreRemark('Needs Improvement');
        }
    }, [profileScore]);


    return (
        <Box display="flex" justifyContent="space-between" gap={2} flexWrap="wrap" my={3} borderRadius={40}>
            <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 200, textAlign: 'center' }}>
                <Typography variant="h6">Profile Completion</Typography>
                <Box
                    sx={{
                        width: '5rem',
                        height: '5rem',
                        borderRadius: '50%',
                        backgroundColor: 'gray',
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 24,
                        fontWeight: 'bold',
                        mx: 'auto',
                        my: 1,
                    }}
                >
                    {profileScore}%
                </Box>
                <Typography variant="body2" align="center">{profileScoreRemark}</Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 200, textAlign: 'center' }}>
                <Typography variant="h6">Appearance</Typography>
                <Box sx={{
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '50%',
                    backgroundColor: 'gray',
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    mx: 'auto',
                    my: 1,
                }}>{invitationCount*3}</Box>
                <Typography variant="body2">In last 7 days</Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 200, textAlign: 'center' }}>
                <Typography variant="h6">Invitations</Typography>
                <Box sx={{
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '50%',
                    backgroundColor: 'gray',
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    mx: 'auto',
                    my: 1,
                }}>{invitationCount}</Box>
                <Typography variant="body2">In last 7 days</Typography>
            </Paper>
        </Box>
    )
}

export default ProfileSummary


