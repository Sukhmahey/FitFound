import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Card,
  CardContent,
} from "@mui/material";

const ResumeParserKey = process.env.REACT_APP_ResumeParserKey;

function ResumeParsing({ setStep, setConfirmedData }) {
  const { user } = useAuth();
  const userId = user?.userId;
  const userEmail = user?.email;

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalData, setFinalData] = useState({});
  const [uploadedFile, setUploadedFile] = useState(false);

  const extractEmail = (text) =>
    text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] ||
    userEmail ||
    "";

  const extractPhone = (text) =>
    text.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
    )?.[0] || "";

  const extractName = (text) => {
    const line = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)[0];
    return /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) ? line : "";
  };

  const extractSkills = (text) => {
    const match = text.match(
      /skills[:\-\s]*([\s\S]+?)(experience|education|projects|summary)/i
    );
    return match
      ? match[1]
          .split(/[\n,•\-]+/)
          .map((s) => s.trim())
          .filter((s) => s && !/\d/.test(s))
      : [];
  };

  const extractExperience = (text) => {
    const jobs = text.split(/(?=Company:)/g).map((block) => {
      const company = block.match(/Company:\s*(.*)/i)?.[1]?.trim() || "";
      const role = block.match(/Role:\s*(.*)/i)?.[1]?.trim() || "";
      const [startDate, endDate] =
        block
          .match(/Duration:\s*(.*)/i)?.[1]
          ?.split("to")
          .map((d) => d.trim()) || [];
      const achievements = [...block.matchAll(/-\s*(.+)/g)]
        .map((m) => m[1].trim())
        .filter(
          (line) =>
            !/^\d{4}/.test(line) && !/January|February|...|December/i.test(line)
        );
      return company
        ? {
            companyName: company,
            role,
            startDate,
            endDate,
            achievements,
            technologiesUsed: [],
          }
        : null;
    });
    return jobs.filter(Boolean);
  };

  const extractEducation = (text) => {
    const lines = text.split("\n").map((l) => l.trim());
    const start = lines.findIndex((l) => /education/i.test(l));
    if (start === -1) return [];
    const info = lines.slice(start + 1, start + 10);
    let institution = "",
      degree = "",
      startDate = "",
      endDate = "",
      fieldOfStudy = "";
    for (let line of info) {
      if (!institution && /University|College|Institute/i.test(line))
        institution = line;
      if (!degree && /Degree[:\-]?\s*(.*)/i.test(line))
        degree = line.match(/Degree[:\-]?\s*(.*)/i)?.[1]?.trim() || "";
      else if (!degree && /(Bachelor|Master|BSc|MCA|BCA)/i.test(line))
        degree = line;
      if (!startDate && /Start Date[:\-]?\s*(.*)/i.test(line))
        startDate = line.match(/Start Date[:\-]?\s*(.*)/i)?.[1]?.trim() || "";
      if (!endDate && /End Date[:\-]?\s*(.*)/i.test(line))
        endDate = line.match(/End Date[:\-]?\s*(.*)/i)?.[1]?.trim() || "";
      if (!fieldOfStudy && degree.includes(" in "))
        fieldOfStudy = degree.split(" in ")[1];
    }
    return [
      {
        instituteName: institution,
        credentials: degree,
        startDate,
        endDate,
        fieldOfStudy,
        certificateLink: "",
      },
    ];
  };

  const extractBioSummary = (text) =>
    text
      .match(
        /summary[:\-\s]*([\s\S]+?)(experience|education|skills|projects)/i
      )?.[1]
      ?.trim() || "";

  const extractLanguages = (text) => {
    const match = text.match(
      /languages?[:\-\s]*([\s\S]+?)(experience|education|projects|summary)/i
    );
    return match
      ? match[1]
          .split(/[\n,•\-]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  };

  const extractLinks = (text) => {
    const urls = text.match(/https?:\/\/[^\s]+/g) || [];
    return {
      linkedin: urls.find((link) => link.includes("linkedin")) || "",
      personalPortfolioWebsite:
        urls.find((link) => link.includes("portfolio")) || "",
      additionalLinks: urls.filter(
        (link) => !link.includes("linkedin") && !link.includes("portfolio")
      ),
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setOutput("");
    setUploadedFile(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    try {
      const res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: { apikey: ResumeParserKey },
        body: formData,
      });
      const data = await res.json();
      const text = data.ParsedResults?.[0]?.ParsedText || "";
      const nameParts = extractName(text).split(" ");
      const structuredData = {
        personalInfo: {
          firstName: nameParts[0] || "",
          middleName: "",
          lastName: nameParts[1] || "",
          email: extractEmail(text),
          currentStatus: "",
          specialization: "",
        },
        basicInfo: {
          phoneNumber: extractPhone(text),
          workStatus: "",
          language: extractLanguages(text).join(", "),
          bio: extractBioSummary(text),
          additionalInfo: "",
        },
        skills: extractSkills(text),
        workExperience: extractExperience(text),
        education: extractEducation(text),
        portfolio: { socialLinks: extractLinks(text) },
        jobPreference: {
          desiredJobTitle: [],
          jobType: "",
          salaryExpectation: { min: 0, perHour: false, perYear: false },
        },
      };
      setOutput(JSON.stringify(structuredData, null, 2));
      setFinalData(structuredData);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setUploadedFile(false);
    } finally {
      setLoading(false);
    }
  };

  const confirmNow = () => {
    setConfirmedData(finalData);
    setStep(99);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundColor: "#F9FBFC",
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ borderRadius: 4, p: 3 }}>
          <CardContent>
            <Typography
              variant="h4"
              fontWeight={600}
              color="#0E3A62"
              gutterBottom
            >
              Upload Resume
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We&apos;ll extract your information to help you get started
              faster.
            </Typography>

            <input
              type="file"
              onChange={handleFileChange}
              style={{
                padding: "10px",
                background: "white",
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: "20px",
                width: "100%",
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              {loading && <CircularProgress />}
              {!loading && Object.keys(finalData).length !== 0 && (
                <Alert severity="success" sx={{ flex: 1 }}>
                  <AlertTitle>Success</AlertTitle>
                  Resume parsed successfully. Click next to proceed.
                </Alert>
              )}
              {uploadedFile &&
                !loading &&
                Object.keys(finalData).length === 0 && (
                  <Alert severity="error" sx={{ flex: 1 }}>
                    <AlertTitle>Error</AlertTitle>
                    Couldn&apos;t parse resume. Try another file.
                  </Alert>
                )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                onClick={() => setStep(0)}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                }}
              >
                Back to Home
              </Button>
              <Button
                variant="contained"
                onClick={confirmNow}
                disabled={Object.keys(finalData).length === 0}
                sx={{
                  backgroundColor: "#0E3A62",
                  color: "white",
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#062F54" },
                }}
              >
                Next
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ResumeParsing;
