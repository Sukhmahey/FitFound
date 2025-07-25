import React, { useState } from 'react';
import './LandingPageStyles.css';
import Navbar from './LandingComponents/Navbar';
import HeroSection from './LandingComponents/HeroSection';
import TeamSection from './LandingComponents/TeamSection';
import ContactSection from './LandingComponents/ContactSection';
import SubscriptionPricing from './LandingComponents/SubscriptionPricing';
import FeaturesComponent from './LandingComponents/FeaturesComponent';

export default function LandingPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />
      <div className="landing-page-top-section">
        <Navbar expanded={expanded} setExpanded={setExpanded} />
        <HeroSection/>
      </div>
      <FeaturesComponent></FeaturesComponent>
      <SubscriptionPricing></SubscriptionPricing>
      <TeamSection/>
      <ContactSection/>


    
    </div>
  );
}