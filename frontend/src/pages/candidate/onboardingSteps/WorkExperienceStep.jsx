import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { candidateApi } from "../../../services/api";
import useNotify from "../../../utils/notificationService";

export default function WorkExperienceStep({
  data = [],
  onUpdate,
  verificationCompany = [],
  errors = {},
}) {
  // const handleChange = (index, field, value) => {
  //   const updated = [...data];
  //   updated[index][field] = value;
  //   onUpdate(updated);
  // };
  const { user } = useAuth();
  const notify = useNotify();
  const profileId = user?.profileId;
  const [hiredCompany, setHiredCompany] = React.useState([]);
  // const handleChange = (index, field, value) => {
  //   const updated = [...data];
  //   updated[index][field] = value;

  //   if (field === 'role') {
  //     updated[index]['jobTitle'] = value;
  //   }

  //   onUpdate(updated);
  // };

  const handleChange = (index, field, value) => {
    const updated = [...data];

    if (field === "startDate" || field === "endDate") {
      const [year, month] = value.split("-");
      value = `${month}-${year}`;
    }

    updated[index][field] = value;

    if (field === "role") {
      updated[index]["jobTitle"] = value;
    }

    onUpdate(updated);
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts[0].length === 4) return dateStr;
    return `${parts[1]}-${parts[0]}`;
  };

  const handleAchievementChange = (index, i, value) => {
    const updated = [...data];
    updated[index].achievements[i] = value;
    onUpdate(updated);
  };

  const addAchievement = (index) => {
    const updated = [...data];
    updated[index].achievements.push("");
    onUpdate(updated);
  };

  const addExperience = () => {
    onUpdate([
      ...data,
      {
        companyName: "",
        jobTitle: "",
        achievements: [""],
        startDate: "",
        endDate: "",
        role: "",
        experienceLevel: "",
        remarkFromEmployer: "",
      },
    ]);
  };

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await candidateApi.fetchInteractions(profileId);
        // console.log(response.data);
        const unfiltered = response.data;

        const filtered = response.data
          .filter((obj) => obj.finalStatus === "hired")
          .map((obj) => ({
            invitationId: obj._id,
            employerId: obj.employerId?._id || null,
            contactPerson: obj.employerId?.contactInfo?.firstName || "Unknown",
            employerName: obj.employerId?.companyName || "Unknown Company",
            job: obj.jobId,
            finalStatus: obj.finalStatus,
            date: (() => {
              const d = new Date(obj.updatedAt);
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const year = d.getFullYear();
              return `${month}-${year}`;
            })(),
          }));
        console.log(unfiltered);
        setHiredCompany(filtered);
      } catch (error) {
        console.error(error);
      }
    };
    if (profileId) fetchInvitations();
  }, [profileId]);

  useEffect(() => {
    if (hiredCompany.length === 0) return;

    const hiredWorkHistory = hiredCompany.map((item) => ({
      companyName: item.employerName,
      jobTitle: item.job?.jobTitle || "Developer",
      role: item.job?.jobTitle || "Developer",
      startDate: item.date || "2024-01",
      endDate: item.date || "2024-01",
      achievements: [],
      experienceLevel: "",
      remarkFromEmployer: "",
      fromHiredCompany: true,
    }));

    const existingCompanies = data.map((d) => d.companyName.toLowerCase());
    const newEntries = hiredWorkHistory.filter(
      (h) => !existingCompanies.includes(h.companyName.toLowerCase())
    );

    if (newEntries.length === 0) return;

    const updatedData = [...data, ...newEntries];
    notify.success(
      "You have been hired by a new company! kindly update it in profile"
    );

    onUpdate(updatedData);
  }, [hiredCompany]);

  const removeExperience = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  const getVerificationStatus = (companyName) => {
    if (!companyName) return null;
    const match = verificationCompany.find(
      (v) =>
        v.company &&
        v.company.trim().toLowerCase() === companyName.trim().toLowerCase()
    );
    return match?.status || null;
  };

  return (
    <div className="d-flex justify-content-center w-80 flex-column mx-auto">
      <div className="d-flex flex-column w-75 mx-auto gap-4">
        {data.map((exp, index) => {
          const status =
            data.length > 0 && verificationCompany.length > 0
              ? getVerificationStatus(exp.companyName)
              : null;
          const isVerified = status === "verified";

          return (
            <Box
              key={index}
              sx={{
                border: exp.fromHiredCompany
                  ? "2px solid #fbc02d"
                  : "1px solid #ccc",
                backgroundColor: exp.fromHiredCompany ? "#fffde7" : "#fff",
                borderRadius: 2,
                p: 3,
              }}
              className="d-flex flex-column gap-3"
            >
              {exp.fromHiredCompany && (
                <Typography
                  variant="body2"
                  sx={{ color: "#f57f17", fontWeight: "bold", mb: 1 }}
                >
                  ⓘ This work experience was added based on your recent hiring.
                  Kindly ensure all relevant details are accurate and up to
                  date.
                </Typography>
              )}
              <TextField
                label="Company Name"
                variant="outlined"
                value={exp.companyName}
                onChange={(e) =>
                  handleChange(index, "companyName", e.target.value)
                }
                disabled={isVerified}
                error={!!errors.companyName}
                helperText={errors.companyName}
              />

              {status && (
                <Typography
                  variant="subtitle2"
                  sx={{ color: status === "verified" ? "green" : "orange" }}
                >
                  Verification Status:{" "}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Typography>
              )}

              <TextField
                label="Role"
                variant="outlined"
                value={exp.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                disabled={isVerified}
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
              />
              {/* <TextField
                label="Job Title"
                variant="outlined"
                value={exp.role}
                onChange={(e) => handleChange(index, 'role', e.target.value)}
                disabled={isVerified} hidden
              /> */}

              <TextField
                type="month"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={normalizeDate(exp.startDate) || ""}
                onChange={(e) =>
                  handleChange(index, "startDate", e.target.value)
                }
                disabled={isVerified}
                error={!!errors.startDate}
                helperText={errors.startDate}
              />

              <TextField
                type="month"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={normalizeDate(exp.endDate) || ""}
                onChange={(e) => handleChange(index, "endDate", e.target.value)}
                disabled={isVerified}
                error={!!errors.endDate}
                helperText={errors.endDate}
              />

              <FormControl fullWidth>
                <InputLabel id={`exp-level-label`}>Experience Level</InputLabel>
                <Select
                  labelId={`exp-level-input`}
                  value={exp.experienceLevel}
                  label="Experience Level"
                  disabled={isVerified}
                  onChange={(e) =>
                    handleChange(index, "experienceLevel", e.target.value)
                  }
                  error={!!errors.experienceLevel}
                  helperText={errors.experienceLevel}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="junior">Junior</MenuItem>
                  <MenuItem value="middle">Middle</MenuItem>
                  <MenuItem value="senior">Senior</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <h6 className="text-decoration-underline">Achievements</h6>
                <Stack spacing={2} mt={4}>
                  {exp.achievements.map((a, i) => (
                    <TextField
                      key={i}
                      disabled={isVerified}
                      label={`Achievement ${i + 1}`}
                      variant="outlined"
                      value={a}
                      onChange={(e) =>
                        handleAchievementChange(index, i, e.target.value)
                      }
                    />
                  ))}
                </Stack>
                <Button
                  variant="outlined"
                  color="secondary"
                  disabled={isVerified}
                  onClick={() => addAchievement(index)}
                  sx={{ mt: 2 }}
                >
                  + Add Achievement
                </Button>
              </Box>

              <Button
                variant="outlined"
                color="error"
                disabled={isVerified}
                onClick={() => removeExperience(index)}
                sx={{ mt: 2 }}
              >
                Remove Entry
              </Button>
            </Box>
          );
        })}

        <Button variant="contained" color="primary" onClick={addExperience}>
          + Add Work Experience
        </Button>
      </div>
    </div>
  );
}
