import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCandidates, setSearchForm } from "../../redux/reducers/searchSlice";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Backdrop, Button } from "@mui/material";
import { scoreCandidates } from "./GenerateCandidateScore";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


import {
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";

import { employerApi } from "../../services/api";
import { AppInfoContext } from "../../contexts/AppInfoContext";

const dummyObj = {
  employerId: "68741350ffbc20e8c92aa48b",
  jobTitle: "Full Stack Developer",
  jobDescription:
    "About the Role:\nWe are looking for a skilled and passionate Frontend Developer to join our dynamic team. You will be responsible for creating intuitive, visually appealing, and responsive web interfaces. You will work closely with designers, backend developers, and product managers to bring our user-facing products to life.\n\nKey Responsibilities:\nTranslate UI/UX designs and wireframes into responsive, high-quality code.\n\nDevelop and maintain reusable components and frontend libraries.\n\nOptimize applications for maximum speed and scalability.\n\nEnsure cross-browser compatibility and responsiveness across devices.\n\nCollaborate with backend developers and stakeholders to integrate APIs.\n\nParticipate in code reviews and contribute to improving development processes.\n\nStay up to date with emerging frontend technologies and trends.\n\nRequired Skills & Qualifications:\nProficiency in HTML5, CSS3, JavaScript, and modern frameworks such as React, Vue.js, or Angular.\n\nExperience with RESTful APIs and asynchronous request handling.\n\nFamiliarity with version control tools like Git.\n\nKnowledge of responsive design, accessibility standards, and performance best practices.\n\nExperience with build tools like Webpack, Vite, or Parcel.\n\nBasic understanding of SEO principles.\n\nNice to Have:\nExperience with TypeScript.\n\nFamiliarity with Tailwind CSS, SASS, or Styled Components.\n\nUnderstanding of backend technologies (Node.js, Express) is a plus.\n\nExposure to design tools such as Figma, Sketch, or Adobe XD.\n\nKnowledge of testing frameworks (Jest, React Testing Library, Cypress).\n\nWhat We Offer:\nCompetitive salary and benefits.\n\nFlexible working hours and remote-friendly environment.\n\nOpportunities for career growth and professional development.\n\nA collaborative and inclusive team culture.",
  requiredSkills: [
    {
      skill: "Html",
    },
    {
      skill: "CSS",
    },
  ],
  mustHaveCriteria: "NA",
  salaryRange: {
    min: "20",
    max: "70",
    perHour: true,
    perYear: false,
  },
  location: "Vancouver",
  jobType: "internship",
  workEnvironment: "remote",
  requiredWorkAuthorization: ["PR Citizen", "Work Permit"],
};

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    location: "",
    jobDescription: "",
    jobType: "",
    salaryFrom: "",
    salaryTo: "",
    workStatus: "",
    skills: "",
    locationType: "",
  });
  const [snackOpen, setSnackOpen] = useState(false);
const [snackMessage, setSnackMessage] = useState("");
const [snackSeverity, setSnackSeverity] = useState("error");


  const { setAppGeneralInfo } = useContext(AppInfoContext);

  const primaryColor = "#062F54";

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Candidate Search" });
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const userId = user.profileId;

  const validateSearchForm = () => {
  const errors = [];

  if (!searchQuery.title?.trim()) errors.push("Job title is required");
  if (!searchQuery.location?.trim()) errors.push("Location is required");
  if (!searchQuery.jobDescription?.trim()) errors.push("Job description is required");
  if (!searchQuery.jobType?.trim()) errors.push("Job type is required");
  if (!searchQuery.locationType?.trim()) errors.push("Location type is required");
  if (!searchQuery.salaryFrom || !searchQuery.salaryTo) {
    errors.push("Salary range (From and To) is required");
  }
  if (!searchQuery.skills?.trim()) errors.push("At least one skill is required");

  return errors;
};


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
    setLoading(true);
    const errors = validateSearchForm();
if (errors.length > 0) {
  setSnackMessage(errors.join(" , "));
  setSnackSeverity("error");
  setSnackOpen(true);
  setLoading(false);
  return;
}

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

    try {
      const candidateList = await employerApi
        .getAllCandidates()
        .then(async (data) => {
          const employerDD = await employerApi.saveJob(paramObj);
          const scoredC = await scoreCandidates(
            data.data.slice(0, 5),
            paramObj.jobDescription
          );

          const arrayOfCandidateIds = [];

          await employerApi
            .saveTopCandidates(employerDD?.data._id, {
              topMatchedCandidates: (scoredC || []).map((element) => {
                arrayOfCandidateIds.push(element._id);
                return element._id;
              }),
            })
            .then(async () => {
              await employerApi.saveCandidateAppearance({
                employerId: userId,
                skills: ["Html", "CSS", "Javascript"],
                candidateIds: arrayOfCandidateIds,
              });
            });

          dispatch(setSearchForm(paramObj));
          dispatch(setCandidates(scoredC));
          navigate(`/employer/searchResults?jobId=${employerDD?.data._id}`);
        });

      setLoading(false);
    } catch (c) {
      console.log("here");
      setLoading(false);
    }
  };

  return (
    <>
    <Snackbar open={snackOpen} autoHideDuration={5000} onClose={() => setSnackOpen(false)}>
  <MuiAlert onClose={() => setSnackOpen(false)} severity={snackSeverity} elevation={6} variant="filled">
    {snackMessage}
  </MuiAlert>
</Snackbar>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
          Loading candidates...
        </div>
      </Backdrop>

      <div className="container">
        <div className="row">
          <div className="m-0 p-0">
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
            <div className="row">
              <div className="mb-3 col-md-6">
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
              <FormControl
                component="fieldset"
                className="col-md-6"
                sx={{ alignItems: "center" }}
              >
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          searchQuery?.locationType?.includes("onsite") || false
                        }
                        onChange={(e) =>
                          onChangeInputFiels(
                            "onsite",
                            "locationType",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="On Site"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          searchQuery?.locationType?.includes("remotee") ||
                          false
                        }
                        onChange={(e) =>
                          onChangeInputFiels(
                            "remotee",
                            "locationType",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Remote"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          searchQuery?.locationType?.includes("hybrid") || false
                        }
                        onChange={(e) =>
                          onChangeInputFiels(
                            "hybrid",
                            "locationType",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Hybrid"
                  />
                </FormGroup>
              </FormControl>
            </div>
          </div>
          <FormControl className="">
            <div className="flex flex-row">
              <FormControl className="col-md-6" sx={{ mb: 2, pr: 1 }}>
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
              <FormControl className="col-md-6">
                <InputLabel id="demo-simple-select-label">
                  Work Status
                </InputLabel>
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
            <Typography
              sx={{
                mb: 2,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: primaryColor,
              }}
            >
              Salary Range (per hour)
            </Typography>
            <FormControl
              fullWidth
              sx={{ display: "flex", flexDirection: "row", gap: "8px" }}
            >
              <TextField
                fullWidth
                label="Salary From"
                type="number"
                variant="outlined"
                value={searchQuery.salaryFrom}
                onChange={(e) =>
                  onChangeInputFiels(e.target.value, "salaryFrom")
                }
              />
              <TextField
                fullWidth
                label="Salary To"
                type="number"
                variant="outlined"
                value={searchQuery.salaryTo}
                onChange={(e) => onChangeInputFiels(e.target.value, "salaryTo")}
              />
            </FormControl>
            <div className="mb-3"></div>
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
          </FormControl>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#041f39",
                color: "white",
              },
            }}
            onClick={clearForm}
          >
            Clear All Fields
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#062F54",
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#041f39",
              },
            }}
            onClick={handleSubmit}
          >
            Find Matching Candidates
          </Button>
        </div>
      </div>
    </>
  );
};

export default Search;
