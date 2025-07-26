import React from 'react';
import { Button } from '@mui/material';
import heroImg from '../../assets/hero-img.webp'

export default function HeroSection() {
  return (
    <section className="hero-section mx-auto">
      <div className="container">
        <div className="row align-items-center justify-content-between flex-column flex-lg-row">
         
          <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
            <h1 className="hero-title">Connecting Candidates with Employers</h1>
            <p className="hero-subtitle">
              FitFound is a job-matching web application designed to flip the traditional hiring model, enabling employers to find candidates, not the other way around. This platform empowers both employers and job seekers with a more transparent, efficient, and effective hiring experience.
            </p>
            <Button className='btn btn-primary' variant='contained' sx={{alignSelf:"center", backgroundColor:"#0E3A62" , color:"white"}} onClick={()=>{
              window.open("https://drive.google.com/drive/folders/1r33pVJzY5Ey2TyJz5B1LvZusSJNRCPIQ?usp=drive_link","_blank")
            }}>Download Proposal</Button>
          </div>

          
          <div className="col-lg-6 d-flex justify-content-center">
            <img
              src={heroImg}
              alt="FitFound Candidate Dashboard"
              className="hero-desktop-mockup"
            />
          </div>
        </div>
      </div>
    </section>

  );
}