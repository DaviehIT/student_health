import React, { useState, useEffect } from "react";
import ImmunizationGrid from "../datagrid/ImmunizationGrid";
import { Typography } from "@mui/material";
import axios from "axios";

const Immunization = () => {
  const [immunizationData, setImmunizationData] = useState([]);

  // Fetch immunization data
  const fetchImmunizationData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/immunization");
      setImmunizationData(response.data);
    } catch (error) {
      console.error("Error fetching immunization data:", error);
    }
  };

  useEffect(() => {
    fetchImmunizationData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <div className="bg-black h-24 flex items-center">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2rem", md: "2.25rem" },
              fontWeight: "bold",
              color: "white",
              py: { xs: 3, md: 6 },
              pl: 2,
            }}
          >
            Immunization
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <ImmunizationGrid immunizationData={immunizationData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Immunization;