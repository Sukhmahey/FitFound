import React from 'react';
import { useState } from 'react';


export default function PersonalInfoStep({ data, onUpdate }) {


  const [workMode, setWorkMode] = useState(data.workMode || "");
  const [jobType, setJobType] = useState(data.jobType || "");


  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };


  return (
    <div>
      <h3>Personal Information</h3>
      <form>
        <div>
          <label>Main Role:</label>
          <input
            type="text"
            name="mainRole"
            value={data.mainRole || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Experience Level:</label>
          <input
            type="text"
            name="experienceLevel"
            value={data.experienceLevel || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Years of Experience:</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={data.yearsOfExperience || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Job Type</label>
          <label>
            <input
              type="radio"
              name="jobType"
              value="part-time"
              checked={jobType === "part-time"}
              onChange={(e) => {
                setJobType(e.target.value);
                onUpdate({ jobType: e.target.value });
              }}
            />
            Part-time
          </label>

          <label>
            <input
              type="radio"
              name="jobType"
              value="full-time"
              checked={jobType === "full-time"}
              onChange={(e) => {
                setJobType(e.target.value);
                onUpdate({ jobType: e.target.value });
              }}
            />
            Full-time
          </label>

          <label>
            <input
              type="radio"
              name="jobType"
              value="contract"
              checked={jobType === "contract"}
              onChange={(e) => {
                setJobType(e.target.value);
                onUpdate({ jobType: e.target.value });
              }}
            />
            Contract
          </label>


        </div>

        <div>
          <label>Work Preference</label>
          <input
            type="text"
            name="prefferedRole"
            value={data.prefferedRole || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Salary Expectation:</label>
          <input
            type="number"
            name="salary"
            value={data.salary || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preferred Work Mode:</label>
          <div>
            <label>
              <input
                type="radio"
                name="workMode"
                value="On-site"
                checked={workMode === "On-site"}
                onChange={(e) => {
                  setWorkMode(e.target.value);
                  onUpdate({ workMode: e.target.value });
                }}
              />
              On-site
            </label>

            <label>
              <input
                type="radio"
                name="workMode"
                value="Remote"
                checked={workMode === "Remote"}
                onChange={(e) => {
                  setWorkMode(e.target.value);
                  onUpdate({ workMode: e.target.value });
                }}
              />
              Remote
            </label>

            <label>
              <input
                type="radio"
                name="workMode"
                value="Hybrid"
                checked={workMode === "Hybrid"}
                onChange={(e) => {
                  setWorkMode(e.target.value);
                  onUpdate({ workMode: e.target.value });
                }}
              />
              Hybrid
            </label>
          </div>


        </div>

      </form>
    </div>
  );
}
