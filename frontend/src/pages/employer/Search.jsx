import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCandidates, setSearchForm } from "../../redux/reducers/searchSlice";
import { useAuth } from "../../contexts/AuthContext";

import { scoreCandidates } from "./GenerateCandidateScore";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Input,
} from "@mui/material";

import { employerApi } from "../../services/api";
import { AppInfoContext } from "../../contexts/AppInfoContext";

const dummyobj1 = {
  employerId: "68659ec4901fec3956f9280f",
  jobTitle: "FullStack Developer",
  jobDescription:
    'Job Title: Junior React Developer\nLocation: [Your Location or "Remote"]\nJob Type: Full-Time / Part-Time / Contract\nExperience Level: Entry-Level (0–2 years)\n\nAbout the Role:\nWe are looking for a motivated and detail-oriented Junior React Developer to join our growing development team. In this role, you will help build and maintain responsive, user-friendly web applications using React.js. You’ll work closely with designers, product managers, and senior developers to turn design mockups into interactive, high-performance web interfaces.\n\nKey Responsibilities:\n\nDevelop and maintain front-end features using React.js\n\nCollaborate with team members in writing clean, maintainable code\n\nConvert Figma or design files into reusable React components\n\nIntegrate RESTful APIs and handle asynchronous data\n\nAssist in debugging, testing, and optimizing code for performance\n\nParticipate in code reviews and team meetings\n\nRequired Skills & Qualifications:\n\nBasic understanding of React.js and its core principles (JSX, components, props, state, lifecycle)\n\nProficiency in HTML5, CSS3, and JavaScript (ES6+)\n\nFamiliarity with version control systems (e.g., Git)\n\nUnderstanding of responsive and mobile-first design\n\nWillingness to learn and grow in a fast-paced environment\n\nGood communication and teamwork skills\n\nPreferred (Not Required):\n\nExperience with tools like Redux, Next.js, or Tailwind CSS\n\nExposure to backend technologies (Node.js, Express)\n\nUnderstanding of testing frameworks (Jest, React Testing Library)\n\nPerks & Benefits:\n\nFlexible work hours and remote work options\n\nLearning and mentorship opportunities\n\nFriendly, collaborative team environment\n\nCompetitive salary based on experience\n\n',
  requiredSkills: [
    {
      skill: "Html",
    },
  ],
  mustHaveCriteria: "NA",
  salaryRange: {
    min: "19",
    max: "31",
    perHour: true,
    perYear: false,
  },
  location: "Vancouver",
  jobType: "part-time",
  workEnvironment: "remote",
  requiredWorkAuthorization: ["PR Citizen", "Work Permit"],
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    location: "",
    jobDescription: "",
    jobType: "",
    salaryFrom: "",
    salaryTo: "",
    workStatus: "",
    skills: "",
  });

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Candidate Search" });
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  console.log("Hereee", user);

  const userId = user.profileId;

  console.log("searchQuery", searchQuery);
  const onChangeInputFiels = (value, type) => {
    setSearchQuery((data) => {
      return { ...data, [type]: value };
    });
  };

  const clearForm = () => {
    setSearchQuery({
      title: "",
      location: "",
      jobDescription: "",
      jobType: "",
      salaryFrom: "",
      salaryTo: "",
      workStatus: "",
      skills: "",
    });
  };

  const handleSubmit = async () => {
    const paramObj = {
      employerId: userId,
      jobTitle: searchQuery.title,
      jobDescription: searchQuery.jobDescription,
      requiredSkills: [
        ...searchQuery.skills.split(",").map((skill) => ({
          skill: skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1),
        })),
      ],
      mustHaveCriteria: "NA",
      salaryRange: {
        min: searchQuery.salaryFrom,
        max: searchQuery.salaryTo,
        perHour: true,
        perYear: false,
      },
      location: searchQuery.location,
      jobType: searchQuery.jobType,
      workEnvironment: "remote",
      requiredWorkAuthorization: ["PR Citizen", "Work Permit"],
    };

    console.log("Param Object", paramObj);

    try {
      const employerDD = await employerApi.saveJob(paramObj);
      const candidateList = await employerApi
        .getAllCandidates()
        .then(async (data) => {
          const scoredC = await scoreCandidates(
            data.data,
            paramObj.jobDescription
          );

          console.log(
            "ID's Array",
            scoredC,
            (scoredC || []).map((element) => {
              return element._id;
            })
          );

          await employerApi.saveTopCandidates(employerDD?.data._id, {
            topMatchedCandidates: (scoredC || []).map((element) => {
              return element._id;
            }),
          });
          console.log("scoredC", scoredC);
          dispatch(setSearchForm(paramObj));
          dispatch(setCandidates(scoredC));
          navigate(`/employer/searchResults?jobId=${employerDD?.data._id}`);
        });

      console.log("Candidate List", candidateList);
      // await employerApi.getSearchedCandidates({
      //   title: dataParams.jobTitle,
      //   jobType: dataParams.jobType,
      //   location: dataParams.location,
      //   salaryFrom: dataParams.salaryRange.min,
      //   salaryTo: dataParams.salaryRange.max,
      //   jobDescription: dataParams.jobDescription,
      //   workStatus: dataParams.requiredWorkAuthorization[0], \
      //   skills: "html",
      // });

      if (candidateList) {
      }
    } catch (c) {
      console.log("here");
    }
  };

  return (
    <div className="container">
      <div className="row">
        {/* LEFT COLUMN */}
        <div className="col-md-6">
          <div className="mb-3">
            <TextField
              className="w-100"
              id="outlined-basic"
              label="Title"
              variant="outlined"
              value={searchQuery?.title}
              onChange={(e) => {
                onChangeInputFiels(e.target.value, "title");
              }}
            />
          </div>

          <div className="mb-3">
            <TextField
              className="w-100"
              id="outlined-multiline-flexible"
              value={searchQuery?.location}
              onChange={(e) => {
                onChangeInputFiels(e.target.value, "location");
              }}
              label="Location"
              multiline
              maxRows={2}
            />
          </div>

          <div className="mb-3">
            <TextField
              className="w-100"
              id="outlined-multiline-flexible"
              value={searchQuery?.jobDescription}
              onChange={(e) => {
                onChangeInputFiels(e.target.value, "jobDescription");
              }}
              label="Job Description"
              multiline
              maxRows={20}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-md-6">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Job Type</InputLabel>
            <Select
              labelId="jobType"
              id="jobType"
              value={searchQuery?.jobType}
              label="jobType"
              onChange={(e) => {
                onChangeInputFiels(e.target.value, "jobType");
              }}
            >
              <MenuItem value={"full-time"}>Full-time</MenuItem>
              <MenuItem value={"part-time"}>Part-time</MenuItem>
              <MenuItem value={"contract"}>Contract</MenuItem>
              <MenuItem value={"internship"}>Internship</MenuItem>
            </Select>
          </FormControl>

          <div className="mb-3">
            <label htmlFor="jobType" className="form-label">
              Salary Range
            </label>
            <div>
              <input
                type="number"
                className="form-control form-control-sm"
                name="startRange"
                id="startRange"
                placeholder="From"
                value={searchQuery?.salaryFrom}
                onChange={(e) => {
                  onChangeInputFiels(e.target.value, "salaryFrom");
                }}
              />
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="To"
                name="endRange"
                id="endRange"
                value={searchQuery?.salaryTo}
                onChange={(e) => {
                  onChangeInputFiels(e.target.value, "salaryTo");
                }}
              />
            </div>
          </div>

          <div className="mb-3">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Work Status</InputLabel>
              <Select
                labelId="workStatus"
                id="workStatus"
                value={searchQuery?.workStatus}
                label="workStatus"
                onChange={(e) => {
                  onChangeInputFiels(e.target.value, "workStatus");
                }}
              >
                <MenuItem value={"studyPermit"}>Study Permit</MenuItem>
                <MenuItem value={"workPermit"}>Work Permit</MenuItem>
                <MenuItem value={"permanentResident"}>
                  Permanent Resident
                </MenuItem>
                <MenuItem value={"citizen"}>Citizen</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mb-3">
            <TextField
              className="w-100"
              value={searchQuery?.skills}
              onChange={(e) => {
                onChangeInputFiels(e.target.value, "skills");
              }}
              label="Skills"
              multiline
              maxRows={5}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-4">
        <button onClick={clearForm} className="btn btn-primary btn-sm mb-3">
          Reset
        </button>
        <button onClick={handleSubmit} className="btn btn-primary btn-sm mb-3">
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
