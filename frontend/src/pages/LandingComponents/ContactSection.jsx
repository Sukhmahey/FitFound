import React, { useState } from 'react';
import { FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import qrSrc from '../../assets/qr-code.png'
import Snackbar from "@mui/material/Snackbar";




function ContactSection() {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');



    const GOOGLE_FORM_ENTRY_IDS = {
        email: 'entry.1818659939',
        subject: 'entry.1478930464',
        message: 'entry.949545104',
    };


    const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSf1G1CX3E7TLUWexqh4lPyMU_LJu3R7UbGZA0TWULM0-1Bw0Q/formResponse';


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const dataToSend = new FormData();
        dataToSend.append(GOOGLE_FORM_ENTRY_IDS.email, formData.email);
        dataToSend.append(GOOGLE_FORM_ENTRY_IDS.subject, formData.subject);
        dataToSend.append(GOOGLE_FORM_ENTRY_IDS.message, formData.message);

        try {


            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: dataToSend,
            });
            setSnackbarMessage('Message sent successfully!');
            setSnackbarOpen(true);

            setFormData({
                email: '',
                subject: '',
                message: '',
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            setSnackbarMessage('Failed to send message. Please try again.');
            setSnackbarOpen(true);
        }
    };


    return (
        <>


            <Box
                id="contact"
                sx={{
                    maxWidth: '1100px',
                    margin: '5rem auto',
                    px: { xs: 2, md: 4 },
                    py: { xs: 4, md: 6 },

                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 6,
                    }}
                >


                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: { xs: 4, md: 0 },
                            mt: { xs: 8, md: 4 },
                            order: { xs: 2, md: 0 },
                        }}
                    >
                        <div className="envelope">
                            <div className="paper">
                                <a href="https://linktr.ee/FitFound" target='_blank' style={{display:'contents'}}><img src={qrSrc} alt="QR Code" /></a>
                            </div>
                        </div>
                        <Typography mt={2} fontWeight="bold" textAlign="center">
                            All our links in one place
                        </Typography>
                    </Box>




                    <Box
                        sx={{
                            flex: 1,
                            maxWidth: '450px',
                            mx: 'auto',
                            width: '100%',
                            order: { xs: 1, md: 0 },
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" textAlign="center">
                            Get in Touch
                        </Typography>
                        <Typography variant="body2" textAlign="center" mb={2}>
                            Let us know how we can help you.
                        </Typography>

                        <FormControl
                            component="form"
                            onSubmit={handleSubmit}
                            variant="standard"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <TextField
                                required
                                label="Email"
                                variant="outlined"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                            />
                            <TextField
                                required
                                label="What is it about"
                                variant="outlined"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                            <TextareaAutosize
                                aria-label="Your message"
                                minRows={4}
                                placeholder="How can we help you?"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                style={{
                                    padding: '12px',
                                    fontSize: '1rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    alignSelf: 'center',
                                    px: 4,
                                    py: 1.5,
                                }}
                            >
                                Send Message
                            </Button>
                        </FormControl>
                    </Box>

                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />

        </>
    );
}

export default ContactSection;