import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCandidates, setSearchForm } from "../../redux/reducers/searchSlice";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Backdrop, Button } from "@mui/material";
import { scoreCandidates } from "./GenerateCandidateScore";

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

const predefinedJobTitles = [
  "frontend developer",
  "backend developer",
  "fullstack developer",
  "ux designer",
  "ui designer",
];

// Removed dummyObj as it's unused
// const dummyObj = { /* ... your dummy object ... */ };

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    location: "",
    jobDescription: "",
    jobType: "",
    salaryFrom: "",
    salaryTo: "", // Keep this for the UI and the jobToSave object
    workStatus: "",
    skills: "",
    locationType: "", // This will hold the single selected work environment type
  });

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  const primaryColor = "#062F54";

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Candidate Search" });
  }, [setAppGeneralInfo]); // Added setAppGeneralInfo to dependency array

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const userId = user.profileId;

  // Modified onChangeInputFiels to correctly handle locationType
  const onChangeInputFiels = (value, type, isChecked = true) => {
    setSearchQuery((data) => {
      if (type === "locationType") {
        // If a checkbox is being checked, set it as the value.
        // If it's being unchecked, clear locationType.
        // This assumes only one work environment can be selected at a time.
        return { ...data, [type]: isChecked ? value : "" };
      }
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
      locationType: "",
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Ensure workEnvironment matches backend enum values
    const finalWorkEnvironment = searchQuery.locationType || "remote"; // Defaults to "remote" if nothing is selected

    const jobToSave = {
      employerId: userId,
      jobTitle: searchQuery.title,
      jobDescription: searchQuery.jobDescription,
      requiredSkills: searchQuery.skills
        ? searchQuery.skills.split(",").map((skill) => ({
            skill: skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1),
          }))
        : [],
      mustHaveCriteria: "NA",
      salaryRange: {
        min: searchQuery.salaryFrom ? Number(searchQuery.salaryFrom) : 0,
        max: searchQuery.salaryTo ? Number(searchQuery.salaryTo) : 0,
        perHour: true,
        perYear: false,
      },
      location: searchQuery.location,
      jobType: searchQuery.jobType,
      workEnvironment: finalWorkEnvironment, // This will now correctly be "on-site", "remote", or "hybrid"
      requiredWorkAuthorization: ["PR Citizen", "Work Permit"],
    };

    console.log("Job data being prepared to save:", jobToSave);

    try {
      const savedJobResponse = await employerApi.saveJob(jobToSave);
      const jobId = savedJobResponse?.data._id;
      console.log("Response after saving job:", savedJobResponse.data);

      const searchParams = {
        title: searchQuery.title,
        skills: searchQuery.skills,
        jobType: searchQuery.jobType,
        salaryFrom: searchQuery.salaryFrom,
        salaryTo: searchQuery.salaryTo,
      };

      console.log(
        "Search parameters for employerApi.getSearchedCandidates:",
        searchParams
      );

      const searchCandidatesResponse = await employerApi.getSearchedCandidates(
        searchParams
      );
      const candidates = searchCandidatesResponse.data;
      console.log("Candidates received from search API:", candidates);

      const scoredCandidates = await scoreCandidates(
        candidates,
        searchQuery.jobDescription
      );
      console.log("All Scored Candidates:", scoredCandidates);

      const relevantScoredCandidates = scoredCandidates
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score);
      console.log(
        "Relevant Scored Candidates (filtered & sorted):",
        relevantScoredCandidates
      );

      const arrayOfCandidateIds = relevantScoredCandidates.map(
        (element) => element._id
      );
      console.log("Array of Candidate IDs for saving:", arrayOfCandidateIds);

      await employerApi.saveTopCandidates(jobId, {
        topMatchedCandidates: arrayOfCandidateIds,
      });
      console.log("Top candidates saved successfully.");

      await employerApi.saveCandidateAppearance({
        employerId: userId,
        skills: searchQuery.skills
          ? searchQuery.skills.split(",").map((s) => s.trim())
          : [],
        candidateIds: arrayOfCandidateIds,
      });
      console.log("Candidate appearance logged successfully.");

      dispatch(setSearchForm(jobToSave));
      dispatch(setCandidates(relevantScoredCandidates));

      navigate(`/employer/searchResults?jobId=${jobId}`);
    } catch (error) {
      console.error("Error during candidate search process:", error);
      if (error.response && error.response.data) {
        // Log the full backend error response for more details
        console.error("Backend Error Details:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <FormControl fullWidth>
                <InputLabel id="job-title-select-label">Title</InputLabel>
                <Select
                  labelId="job-title-select-label"
                  id="job-title-select"
                  value={searchQuery?.title}
                  label="Title"
                  onChange={(e) => {
                    onChangeInputFiels(e.target.value, "title");
                  }}
                >
                  {predefinedJobTitles.map((title) => (
                    <MenuItem key={title} value={title}>
                      {title.charAt(0).toUpperCase() + title.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                        // Check against the correct value now
                        checked={searchQuery?.locationType === "on-site"}
                        onChange={(e) =>
                          onChangeInputFiels(
                            "on-site", // Changed from "onsite" to "on-site"
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
                        // Check against the correct value now
                        checked={searchQuery?.locationType === "remote"}
                        onChange={(e) =>
                          onChangeInputFiels(
                            "remote", // Changed from "remotee" to "remote"
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
                        // Check against the correct value now
                        checked={searchQuery?.locationType === "hybrid"}
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
              <FormControl
                className="col-md-6"
                sx={{
                  mb: 2,
                  pr: { xs: 0, md: 1 },
                  width: { xs: "100%", md: "50%" },
                }}
              >
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
              <FormControl
                sx={{
                  width: { xs: "100%", md: "50%" },
                  mb: 2,
                }}
              >
                <InputLabel id="demo-simple-select-label">
                  Work Status
                </InputLabel>
                <Select
                  labelId="workStatus"
                  id="workStatus"
                  value={searchQuery?.workStatus}
                  label="Work Status"
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
