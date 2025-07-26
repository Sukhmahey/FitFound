import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Divider,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const planColors = {
  primary: '#0E3A62',
  secondary: '#3B67F6',
  accent: '#A5CCF7',
  light: '#EDF9FF'
};

const employerPlans = [
  {
    name: 'Basic',
    price: 'Free',
    description: '',
    features: [
      '30/month Candidate Search Queries',
      '5/month Candidate Invitations'
    ]
  },
  {
    name: 'Starter',
    price: '$79/month',
    description: 'Best for growing teams.',
    features: [
      '100/month Candidate Search Queries',
      '25/month Candidate Invitations'
    ]
  },
  {
    name: 'Professional',
    price: '$199/month',
    description: 'For large-scale hiring.',
    features: [
      'Unlimited Candidate Search Queries',
      'Unlimited Candidate Invitations'
    ]
  }
];

const candidatePlans = [
  {
    name: 'Candidate Basic',
    price: 'Free',
    description: 'Everything you need to get started.',
    features: ['Receive & Respond to Invitations']
  },
  {
    name: 'Candidate Premium',
    price: '$15/month',
    description: 'Accelerate your job search.',
    features: [
      'Receive & Respond to Invitations',
      'Job Verification Badge',
      'AI Insights & Recommendations'
    ]
  }
];

const PlanCard = ({ plan, isSelected, onSelect }) => (
  <Card
    elevation={isSelected ? 6 : 2}
    onClick={onSelect}
    sx={{
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 4,
      border: isSelected ? `2px solid ${planColors.secondary}` : '1px solid #ccc',
      backgroundColor: isSelected ? '#f0f6ff' : '#fff',
      transition: 'transform 0.3s, background-color 0.3s',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: 6
      }
    }}
  >
    <CardContent sx={{ p: 4, flex: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'black' }}>
        {plan.name}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: planColors.secondary, mt: 1 }}>
        {plan.price}
      </Typography>
      <Typography color="text.secondary" mb={2}>
        {plan.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={1}>
        {plan.features.map((feature, idx) => (
          <Typography key={idx} display="flex" alignItems="center">
            <CheckCircleIcon sx={{ color: 'green', mr: 1 }} /> {feature}
          </Typography>
        ))}
      </Stack>
    </CardContent>
    <Box px={4} pb={3}>
      <Button
        fullWidth
        variant={isSelected ? 'contained' : 'outlined'}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          backgroundColor: isSelected ? planColors.secondary : 'transparent',
          color: isSelected ? 'white' : planColors.secondary,
          '&:hover': {
            backgroundColor: isSelected ? '#3357d6' : planColors.accent
          }
        }}
      >
        {isSelected ? 'Get Started' : 'Choose Plan'}
      </Button>
    </Box>
  </Card>
);

const SubscriptionPricing = () => {
  const [active, setActive] = useState('employer');
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const isEmployer = active === 'employer';
  const plans = isEmployer ? employerPlans : candidatePlans;

  return (
    <Box className={'SubscriptionSection'} sx={{ backgroundColor:"#E6F4FE", py: 8, minHeight: '100vh' }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 1, color: 'black' }}
      >
        Pricing Plans
      </Typography>
      <Typography align="center" color="text.secondary" mb={4}>
        Choose the plan that’s right for you.
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <ToggleButtonGroup
          value={active}
          exclusive
          onChange={(e, val) => {
            if (val) {
              setActive(val);
              setSelectedPlanIdx(0);
            }
          }}
          sx={{
            backgroundColor: `${planColors.accent}33`,
            borderRadius: '30px',
            gap:3,
            p: 0.5
          }}
        >
          <ToggleButton
            value="employer"
            sx={{
              px: 4,
              py: 1,
              borderRadius: '20px !important',
              fontWeight: 600,
              '&.Mui-selected': {
                backgroundColor: planColors.secondary,
                color: '#fff'
              }
            }}
          >
            For Employers
          </ToggleButton>
          <ToggleButton
            value="candidate"
            sx={{
              px: 4,
              py: 1,
              borderRadius: '20px !important',
              fontWeight: 600,
              '&.Mui-selected': {
                backgroundColor: planColors.secondary,
                color: '#fff'
              }
            }}
          >
            For Candidates
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Typography align="center" color="text.secondary" mb={4} maxWidth="600px" mx="auto">
        {isEmployer
          ? 'This revised three-tier plan makes the Professional plan the top-tier offering with unlimited capabilities.'
          : 'Find your next opportunity with our tailored plans for job seekers.'}
      </Typography>

      <Grid container spacing={4} justifyContent="center" px={2}>
        {plans.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={plans.length === 3 ? 4 : 6} key={idx}>
            <PlanCard
              plan={plan}
              isSelected={selectedPlanIdx === idx}
              onSelect={() => setSelectedPlanIdx(idx)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubscriptionPricing;