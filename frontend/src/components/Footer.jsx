import { Box, Typography, Grid, Link as MuiLink } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#fff",
        borderTop: "1px solid #e0e0e0",
        py: 3,
        px: { xs: 2, md: 6 },
        fontFamily: "Figtree, sans-serif",
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        {/* Left: Logo */}
        <Grid item xs={12} md={4}>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#000",
            }}
          >
            FitFound
          </Typography>
        </Grid>

        {/* Center: Copyright */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 1, md: 0 },
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#555" }}>
            © 2025 FitFound All rights reserved.
          </Typography>
        </Grid>

        {/* Right: Links */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            mt: { xs: 1, md: 0 },
          }}
        >
          <MuiLink
            href="#"
            underline="none"
            sx={{ fontSize: 13, color: "#333", mr: 2, cursor: "pointer" }}
          >
            Github
          </MuiLink>
          <MuiLink
            href="#"
            underline="none"
            sx={{ fontSize: 13, color: "#333", cursor: "pointer" }}
          >
            Figma
          </MuiLink>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
