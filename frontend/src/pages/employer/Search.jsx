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

const predefinedJobTitles = [
  "frontend developer",
  "backend developer",
  "fullstack developer",
  "ux designer",
  "ui designer",
];

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
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("error");

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  const primaryColor = "#062F54";

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Candidate Search" });
  }, [setAppGeneralInfo]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const userId = user.profileId;

  const validateSearchForm = () => {
    const errors = [];

    if (!searchQuery.title?.trim()) errors.push("Job title is required.");
    if (!searchQuery.location?.trim()) errors.push("Location is required.");
    if (!searchQuery.jobDescription?.trim())
      errors.push("Job description is required.");
    if (!searchQuery.jobType?.trim()) errors.push("Job type is required.");
    if (!searchQuery.locationType?.trim())
      errors.push("Work environment (On Site, Remote, Hybrid) is required.");
    if (!searchQuery.salaryFrom || !searchQuery.salaryTo) {
      errors.push("Salary range (From and To) is required.");
    } else if (Number(searchQuery.salaryFrom) >= Number(searchQuery.salaryTo)) {
      errors.push("Salary 'From' must be less than 'To'.");
    }
    if (!searchQuery.skills?.trim()) errors.push("At least one skill is required.");

    return errors;
  };

  const onChangeInputFiels = (value, type, isChecked = true) => {
    setSearchQuery((data) => {
      if (type === "locationType") {

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

    const errors = validateSearchForm();
    if (errors.length > 0) {
      setSnackMessage(errors.join(" ")); // Join errors with a space for better readability
      setSnackSeverity("error");
      setSnackOpen(true);
      setLoading(false);
      return;
    }

    // Ensure workEnvironment matches backend enum values (on-site, remote, hybrid)
    const finalWorkEnvironment = searchQuery.locationType; // locationType is now guaranteed to be set by validation

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
        perHour: true, // Assuming perHour is always true for simplicity based on previous context
        perYear: false,
      },
      location: searchQuery.location,
      jobType: searchQuery.jobType,
      workEnvironment: finalWorkEnvironment,
      requiredWorkAuthorization: ["PR Citizen", "Work Permit"], // Hardcoded as per previous context
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

      // FIX: Use c.matchingScore as per GenerateCandidateScore.js output
      const relevantScoredCandidates = scoredCandidates
        .filter((c) => c.matchingScore > 0) // Changed c.score to c.matchingScore
        .sort((a, b) => b.matchingScore - a.matchingScore); // Changed b.score - a.score to b.matchingScore - a.matchingScore
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

      // Only call saveCandidateAppearance if there are candidates to log
      if (arrayOfCandidateIds.length > 0) {
        await employerApi.saveCandidateAppearance({
          employerId: userId,
          skills: searchQuery.skills
            ? searchQuery.skills.split(",").map((s) => s.trim())
            : [],
          candidateIds: arrayOfCandidateIds,
        });
        console.log("Candidate appearance logged successfully.");
      } else {
        console.log("No relevant candidates found, skipping logging candidate appearance.");
      }


      dispatch(setSearchForm(jobToSave));
      dispatch(setCandidates(relevantScoredCandidates));

      navigate(`/employer/searchResults?jobId=${jobId}`);
    } catch (error) {
      console.error("Error during candidate search process:", error);
      if (error.response && error.response.data) {
        console.error("Backend Error Details:", error.response.data);
        setSnackMessage(
          `Error: ${error.response.data.message || "Something went wrong."}`
        );
      } else {
        setSnackMessage(`Error: ${error.message || "Network error."}`);
      }
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
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
                        checked={searchQuery?.locationType === "on-site"}
                        onChange={(e) =>
                          onChangeInputFiels(
                            "on-site",
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
                        checked={searchQuery?.locationType === "remote"}
                        onChange={(e) =>
                          onChangeInputFiels(
                            "remote",
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