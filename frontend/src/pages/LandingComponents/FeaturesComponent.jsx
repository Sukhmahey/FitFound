import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import searchImg from '../../assets/feature-search-img.png'
import badgeImg from '../../assets/feature-badge-img.png'
import profileImg from '../../assets/feature-profile-img.png'




export default function FeaturesComponent() {

const features = [
  {
    title: "Smart Candidate Matching",
    description:
      "Employers upload job requirements and receive a curated list of candidates filtered by skills, experience, location, and job-specific preferences.",
    highlight: "AI-matched candidates",
    img: searchImg,
    gif: '/search.gif'
  },
  {
    title: "One-Time Universal Profile",
    description:
      "Candidates build a single profile used across all job applications, removing the need to re-enter information or duplicate their efforts.",
    highlight: "Reusable profile",
    img: profileImg,
    gif: "/profile.gif",
  },
  {
    title: "Verified Hiring Badges",
    description:
      "After successful hiring, employers can verify and tag profiles to help others trust the candidate’s experience and background with ease.",
    highlight: "Verifiable work record",
    img: badgeImg,
    gif: "/badgeVeri.gif",
  },
];

  return (
    <div className="feature-section" id="features">
      <h2 className="feature-heading">Powerful Features offered by FitFound</h2>

      <div className="feature-grid">
        {features.map((item, idx) => (
          <div className="feature-card" key={idx}>
            {/* <img src={item.img} alt={item.title} className="feature-img mb-4" /> */}
            <div className="feature-img-wrapper">
  <img src={item.img}  alt={item.title} className="feature-img mb-4" onMouseEnter={e => e.currentTarget.src = item.gif}
  onMouseLeave={e => e.currentTarget.src = item.img} />
  {idx === 0 && (
    <div className="icon-overlay">
      <SearchIcon style={{ fontSize: 28, color: 'white' }} />
    </div>
  )}
  {idx === 1 && (
    <div className="icon-overlay">
      <AccountCircleIcon style={{ fontSize: 28, color: 'white' }} />
    </div>
  )}
  {idx === 2 && (
    <div className="icon-overlay">
      <VerifiedIcon style={{ fontSize: 28, color: 'white' }} />
    </div>
  )}
</div>
            <h4 className="feature-title">{item.title}</h4>
            <p className="feature-text">
              {item.description.replace(item.highlight, "")}
              <span className="highlight">{item.highlight}</span>
            </p>
            {/* <img src={item.img} alt={item.title} className="feature-img" /> */}
          </div>
        ))}
      </div>
    </div>
  )
}
