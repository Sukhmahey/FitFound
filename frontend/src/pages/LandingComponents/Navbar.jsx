import { Button } from '@mui/material';
import React from 'react';
import OurLogo from '../../assets/logo-blue.svg'

export default function Navbar({ expanded, setExpanded }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container d-flex justify-content-between align-items-center">
        
        <a className="navbar-brand d-flex align-items-center me-auto" href="#">
          
          <img src={OurLogo} alt="FitFound Logo" className="logo me-2"/>
        </a>

        
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
        </button>

        
        <div className={`collapse navbar-collapse justify-content-center text-center ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item px-4">
              <a className="nav-link" href="">Overview</a>
            </li>
            <li className="nav-item px-4">
              <a className="nav-link" href="#features">Features</a>
            </li>
            <li className="nav-item px-4">
              <a className="nav-link" href="#team">Team</a>
            </li>
            <li className="nav-item px-4">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        
        <div className="d-none d-lg-block">
          <Button variant='contained' sx={{backgroundColor:"#0E3A62", borderRadius:"1rem", px:"1.5rem"}} className="btn btn-primary" href="/login">Login</Button>
        </div>
      </div>
    </nav>
  );
}
