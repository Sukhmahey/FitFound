import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { SiFigma } from "react-icons/si"; 
import { Box } from '@mui/material';
import member1Img from '../../assets/team-img/member1.png'
import member2Img from '../../assets/team-img/member2.png'
import member3Img from '../../assets/team-img/member3.png'
import member4Img from '../../assets/team-img/member4.png'
import member5Img from '../../assets/team-img/member5.png'


function TeamSection() {
  const teamMembers = [
    {
      name: 'Sukhbir Singh',
      position: 'Project Manager',
      image: member1Img,
      linkedin: 'https://www.linkedin.com/in/sukhbir-singh-7a3a3',
      github: 'https://github.com/Sukhmahey'
    },
    {
      name: 'Vipul Juneja',
      position: 'Lead Developer',
      image: member2Img,
      linkedin: 'https://www.linkedin.com/in/vipul-juneja-512274122/',
      github: 'https://github.com/vipuljuneja'
    },
    {
      name: 'Hitin Sachdeva',
      position: 'Fullstack Developer',
      image: member3Img,
      linkedin: 'https://www.linkedin.com/in/hitin-sachdeva-574670196',
      github: 'https://github.com/HitinSachdeva161'
    },
    {
      name: 'Sindy Montano',
      position: 'Fullstack Developer',
      image: member4Img,
      linkedin: 'https://www.linkedin.com/in/sindy-vanessa-montano',
      github: 'https://github.com/sindyvaness'
    },
    {
      name: 'Shubham Maini',
      position: 'Lead Designer',
      image: member5Img,
      linkedin: 'https://www.linkedin.com/in/shubham-maini',
      figma: 'https://www.figma.com/@maini'
    }
  ];

  return (
    <div className="container py-5 my-5" id="team">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Meet the Brains</h2>
        <p className="text-muted">We’re not just building a product, we’re solving a problem we’ve faced ourselves.</p>
      </div>
      <div className="row g-4 justify-content-center">
        {teamMembers.map((member, i) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 text-center mb-5" key={i}>
            <div className="team-card p-3">
              <img
                src={member.image}
                alt={member.name}
                className="rounded-circle img-fluid mb-3 picture-member"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h5 className="mb-0">{member.name}</h5>
              <small className="text-muted d-block mb-2">{member.position}</small>
              <div>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="me-2 text-dark">
                  <LinkedInIcon />
                </a>
                <span>/</span>
                {i!=4 && (<a href={member.github} target="_blank" rel="noopener noreferrer" className="ms-2 text-dark">
                  <GitHubIcon />
                </a>)}
                {i==4 &&(
                  <a href={member.figma} target="_blank " rel="noopener noreferrer" className="ms-2 text-dark">
                    <SiFigma></SiFigma>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamSection;
