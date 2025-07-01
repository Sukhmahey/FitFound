import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { candidateApi } from '../../services/api';
import {
    Container,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button
} from '@mui/material';

export default function ExperienceVerificationReqPage() {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [companyNames, setCompanyNames] = useState([]);
    const [workHistory, setWorkHistory] = useState([]);

    const { user } = useAuth();
    const userId = user?.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await candidateApi.getProfileByUserId(userId);
                const history = response.data?.workHistory || [];

                setWorkHistory(history);

                const names = history.map((entry) => entry.companyName).filter(Boolean);
                setCompanyNames(names);
            } catch (err) {
                console.error('Failed to load profile:', err);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    useEffect(() => {
        if (selectedCompany && workHistory.length) {
            const companyDetails = workHistory.find(
                (company) =>
                    company.companyName.toLowerCase() === selectedCompany.toLowerCase()
            );
            if (companyDetails) {
                // console.log('Selected company details:', companyDetails);
                setStartDate(companyDetails.startDate);
                setEndDate(companyDetails.endDate);
            }
        }
    }, [selectedCompany]);

    const handleSubmit = () => {
        console.log('Submitted:', { selectedCompany, startDate, endDate });
        alert('Verification request submitted!');
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 4, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom textAlign="center">
                    Experience Verification Request
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Company</InputLabel>
                    <Select
                        value={selectedCompany}
                        label="Company"
                        onChange={(e) => setSelectedCompany(e.target.value)}
                    >
                        <MenuItem value="">Select Company</MenuItem>
                        {companyNames.map((company, idx) => (
                            <MenuItem key={idx} value={company}>
                                {company}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    type="month"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate ? `${startDate.split('-')[1]}-${startDate.split('-')[0]}` : ''}
                    onChange={(e) => {
                        const [year, month] = e.target.value.split('-');
                        setStartDate(`${month}-${year}`);
                    }}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    type="month"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate ? `${endDate.split('-')[1]}-${endDate.split('-')[0]}` : ''}
                    onChange={(e) => {
                        const [year, month] = e.target.value.split('-');
                        setEndDate(`${month}-${year}`);
                    }}
                    sx={{ mb: 4 }}
                />


                <Button variant="contained" fullWidth onClick={handleSubmit}>
                    Submit Verification Request
                </Button>
            </Box>
        </Container>
    );
}
