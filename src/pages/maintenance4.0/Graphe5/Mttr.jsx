import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Mttr = () => {
  const [data, setData] = useState([]); // Data for tickets
  const [filteredData, setFilteredData] = useState([]); // Filtered data for a specific site
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error handling
  const [siteFilter, setSiteFilter] = useState(""); // Site filter

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/ticketMaintenance?isClosed"
      );
      const tickets = response.data;

      // Set the fetched data
      setData(tickets);
      setFilteredData(tickets);
    } catch (err) {
      setError("Error fetching data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate MTTR
  const calculateMTTR = (tickets) => {
    if (tickets.length === 0) return 0;

    const totalRepairTime = tickets.reduce((acc, ticket) => {
      const repairTime =
        (new Date(ticket.repairEnd) - new Date(ticket.repairStart)) /
        (1000 * 60 * 60); // Convert to hours
      return acc + repairTime;
    }, 0);

    return (totalRepairTime / tickets.length).toFixed(2); // Return MTTR in hours
  };

  // Filter by site
  const handleSiteFilterChange = (event) => {
    const site = event.target.value;
    setSiteFilter(site);

    if (site === "") {
      setFilteredData(data); // No filter, show all
    } else {
      const filtered = data.filter((ticket) => ticket.site === site);
      setFilteredData(filtered);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <CircularProgress />; // Show loading indicator
  if (error) return <div>{error}</div>; // Show error if there is one

  // Calculate the MTTR for the filtered tickets
  const mttr = calculateMTTR(filteredData);

  // Get unique sites for the filter dropdown
  const sites = [...new Set(data.map((ticket) => ticket.site))];

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Card sx={{ maxWidth: 345, margin: "0 auto" }}>
        <CardContent>
          {/* Title */}
          <Typography variant="h5" component="div" gutterBottom>
            Mean Time To Repair (MTTR)
          </Typography>

          {/* MTTR value */}
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Cumulative MTTR: {mttr} hours
          </Typography>

          {/* Site Filter */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Filter by Site</InputLabel>
            <Select
              value={siteFilter}
              onChange={handleSiteFilterChange}
              label="Filter by Site"
            >
              <MenuItem value="">
                <em>All Sites</em>
              </MenuItem>
              {sites.map((site) => (
                <MenuItem key={site} value={site}>
                  {site}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Mttr;
