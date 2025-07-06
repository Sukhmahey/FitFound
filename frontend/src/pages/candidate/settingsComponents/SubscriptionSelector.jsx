import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Radio,
  FormControlLabel,
  Box
} from '@mui/material';

const plans = [
  {
    label: 'Basic Plan - Free',
    price: 'Free',
    features: ['3 month Profile Insights', 'Unlimited Job Invitations'],
    value: 'basic'
  },
  {
    label: 'Premium Plan - $120/year',
    price: '$120/year',
    features: ['Unlimited Profile Insights', 'Unlimited Job Invitations'],
    value: 'premium'
  }
];

export default function SubscriptionSelector() {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const handleSelect = (value) => {
    setSelectedPlan(value);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} key={plan.value}>
            <Card
              onClick={() => handleSelect(plan.value)}
              sx={{
                cursor: 'pointer',
                boxShadow: selectedPlan === plan.value ? 6 : 1,
                border: selectedPlan === plan.value ? '2px solid #1976d2' : '1px solid #ccc',
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {plan.label}
                    </Typography>
                    <Box mt={1}>
                      {plan.features.map((feature, index) => (
                        <Typography variant="body1" key={index}>
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedPlan === plan.value}
                        onChange={() => handleSelect(plan.value)}
                      />
                    }
                    label=""
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
