import React, { useEffect } from 'react'
import {
    Box,
    Button,
    Container,
    Typography,
    CardContent,
    Card,
    CardActions,
    CardMedia,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText

} from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useAuth } from '../../contexts/AuthContext';
import { candidateApi, employerApi } from '../../services/api';
import { auth } from '../../services/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import SubscriptionSelector from './settingsComponents/SubscriptionSelector';
import NotificationPermission from './settingsComponents/NotificationPermission';

export default function SettingsPage() {

    const { user } = useAuth();
    const userId = user?.userId;
    
    const [role, setRole] = React.useState(user?.role);
    const [candidateName, setCandidateName] = React.useState('');
    const [employerName, setEmployerName] = React.useState('');
    const [currentUserEmail, setCurrentUserEmail] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        await resetPassword();

        handleClose();
    };


//     useEffect(() => {

       
//         if (role === 'candidate' && userId) {
//      setCandidateEmail(user?.email);
//     candidateApi.getProfileByUserId(userId).then((response) => {
//       setCandidateName(response.data.personalInfo.firstName);
//     }).catch((error) => {
//       console.error("Error fetching candidate profile:", error);
//     });
//   }


//     }, [userId]);
useEffect(() => {
        setRole(user?.role)
  setCurrentUserEmail(user?.email);
  if (user?.role === 'candidate' && userId) {
    console.log('Candidate')
    candidateApi.getProfileByUserId(userId)
      .then((response) => {
        setCandidateName(response.data.personalInfo.firstName);
      })
      .catch((error) => {
        console.error("Error fetching candidate profile:", error);
      });
  }
  else if (user?.role === 'employer') {
    employerApi.getEmployerProfile(userId)
    .then((response) =>
        setEmployerName(response.data.companyName)
    )
    .catch((error) =>
        console.error("Error fetching employer profile:", error)
    );
  }
}, [userId]);

    const resetPassword = () => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, oldPassword);

        reauthenticateWithCredential(user, credential)
            .then(() => {

                return updatePassword(user, newPassword);
            })
            .then(() => {
                console.log("Password updated successfully");
            })
            .catch((error) => {
                console.error("Re-authentication or update failed:", error.message);
            });

    }

    return (
        <Container>
            {
                user && (<Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h5" component="h5" gutterBottom className=' text-center'>Settings</Typography>
                    <Card sx={{ maxWidth: 345, display: 'flex', mb: 5 }}>
                        <CardMedia>
                            <AccountCircleRoundedIcon sx={{ fontSize: '5rem' }}></AccountCircleRoundedIcon>
                        </CardMedia>
                        <CardContent>
                            {employerName && <Typography variant='h6'>{employerName}</Typography>}
                            {candidateName && <Typography variant='h6'>{candidateName}</Typography>}
                        </CardContent>
                    </Card>
                    <Box>
                        <Typography variant='h6' component={"h6"} className=' border-bottom'>Account Security</Typography>
                        <Box>
                            <Box>
                                <Typography component={"p"} sx={{ fontSize: '1rem' }}>Username</Typography>
                                <TextField size='small' value={currentUserEmail || ''}></TextField>
                            </Box>
                            <Box>
                                <Typography component={"p"} sx={{ fontSize: '1rem' }}>Password</Typography>
                                <TextField size='small' value={currentUserEmail || ''} disabled={true} type="password"
                                    autoComplete="current-password"></TextField>
                                <Button onClick={handleClickOpen}>Reset</Button>
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Reset Password</DialogTitle>
                                    <DialogContent sx={{ paddingBottom: 0 }}>

                                        <form onSubmit={handleSubmit}>
                                            <DialogContentText>
                                                Enter Your Old Password
                                            </DialogContentText>
                                            <TextField
                                                autoFocus
                                                required
                                                margin="dense"
                                                id="old-password"
                                                name="old-password"
                                                label="Old Password"
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                fullWidth

                                            />
                                            <DialogContentText>
                                                Enter Your New Password
                                            </DialogContentText>
                                            <TextField
                                                autoFocus
                                                required
                                                margin="dense"
                                                id="new-password"
                                                name="new-password"
                                                label="New Password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                fullWidth

                                            />

                                            <DialogActions>
                                                <Button onClick={handleClose}>Cancel</Button>
                                                <Button type="submit">Confirm</Button>
                                            </DialogActions>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </Box>
                        </Box>
                    </Box>
        { role === 'candidate' && (<Box>
                        <Typography variant='h6' component={"h6"} className=' border-bottom'>Subscriptions</Typography>
                        <Box>
                            <SubscriptionSelector/>
                        </Box>
                    </Box>)}
                    <Box>
                        <Typography variant='h6' component={"h6"} className=' border-bottom'>Notifications</Typography>
                        <Box>
                            <NotificationPermission />
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant='h6' component={"h6"} className=' border-bottom'>Help</Typography>
                        <Card sx={{ maxWidth: 345, display: 'flex', mb: 5 , mt : 5, justifyContent: 'center', alignItems: 'center' , borderRadius: 5}}>
                        <CardContent sx={{display : 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', gap : 2}}>
                            <Typography variant='h6' sx={{ fontStyle:"bold", fontWeight:"800"}}>Get the help you need</Typography>
                            <Typography variant='p'>Reach got and get the help you need</Typography>
                            <Button variant='outlined'>Contact Us</Button>
                        </CardContent>
                    </Card>
                    </Box>
                </Box>)
            }
        </Container>
    )
}
