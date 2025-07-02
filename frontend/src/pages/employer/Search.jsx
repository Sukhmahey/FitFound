import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCandidates, setSearchForm } from "../../redux/reducers/searchSlice";

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

const dummyobj1 = {
  employerId: "uakvb65lGWfOqbsEix2dUvOL1nH2",
  jobTitle: "FrontEnd Developer",
  jobDescription:
    "Anderson Vacations is an established and respected Canadian tour operator and part of a diverse Western Canadian group of travel companies. We excel in creating and customizing independent and group tour packages across captivating destinations such as Canada, Australia, New Zealand, Tahiti, and Fiji's idyllic South Pacific islands. Additionally, we offer a unique selection of fully escorted small group tours to extraordinary locations within Canada.\n\nWith our expertise in Canada, our product range encompasses every Province and Territory in the country, providing the opportunity for one-of-a-kind, tailored itineraries in each locale. Beyond the well-known tourist destinations, we pride ourselves in exploring the less-travelled, hidden gems and specialize in offering authentic local experiences, including immersive Indigenous cultural encounters.\n\nSince we design, develop, manage, and operate our own tours, we are more familiar with the intricacies of our product than anyone else. This also means that we require sophisticated front and back-end systems to support the complex processes that allow us to provide a high-value travel experience to several thousand travellers each year.\n\nWe are an enthusiastic, passionate, and welcoming team, eager to welcome a dynamic and creative Junior/Intermediate Full-Stack Developer to our ranks. We are looking for a person based in Vancouver.\n\nResponsibilities:\n\nDeveloping responsive websites and web-based applications.\nDeployment and cross-browser testing for Quality Assurance.\nOngoing maintenance, development, bug fixes and customization.\nDocumenting website source code and applications.\nProviding IT Support and Troubleshooting\nInstalling hardware/software components\nMust Haves (min 2 yrs.):\n\nPHP\nJavaScript\nMySQL\nHTML5\nCSS3\nJSON\nXML\nNice To Haves:\n\nPhotoshop\nIllustrator\nLinux\nWindows\nNetworking\nRequirements:\n\nCandidate must have a legal work status or be a Canadian Permanent Resident or Canadian citizen.\nCompleted at least 2 academic years.\nAbility to write scalable, maintainable and well-documented code.\nSelf-motivated with the ability to multitask and work under pressure with tight deadlines.\nStrong problem-solving and troubleshooting skills.\nOutstanding attention to detail and quality control.\nKnowledge of website usability, conversion optimization, analytics, email marketing, and search engine optimization is not optional but an asset.\nIf you meet the requirements, please send your resume with examples of web development work and a cover letter stating salary expectations.\n\nJob Type: Full-time\n\nPay: From $55,000.00 per year\n\nBenefits:\n\nDental care\nExtended health care\nFlexible language requirement:\n\nFrench not required\nSchedule:\n\nMonday to Friday\nExperience:\n\nJavaScript: 2 years (required)\nPHP: 2 years (required)\nMySQL: 2 years (required)\nHTML5: 2 years (required)\nCSS3: 2 years (required)",
  requiredSkills: [
    { skill: "JavaScript", yearsOfExperience: 0, level: "junior" },
  ],
  mustHaveCriteria: "Experience with microservices",
  salaryRange: {
    min: 20,
    max: 30,
    perYear: false,
  },
  location: "Vancouver",
  jobType: "full-time",
  workEnvironment: "hybrid",
  requiredWorkAuthorization: ["Work Permit"],
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId") || "";

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
      await employerApi.saveJob(paramObj);
      const candidateList = await employerApi
        .getAllCandidates()
        .then(async (data) => {
          const scoredC = await scoreCandidates(
            data.data.slice(0, 3),
            dummyobj1.jobDescription
          );
          console.log("scoredC", scoredC);
          dispatch(setSearchForm(dummyobj1));
          dispatch(setCandidates(scoredC));
          navigate("/employer/searchResults");
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
