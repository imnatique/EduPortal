import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Loading from "./Loading";
import api from "../utils/api"; 

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function UpdateForm({ modelName, id }) {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelSchema();
    fetchExistingData();
  }, []);

  const fetchModelSchema = async () => {
    try {
      const res = await api.get(`/api/${modelName.toLowerCase()}/get/${id}`);
      const data = res.data;

      if (!data) {
        console.error("Schema fetch error: No data returned");
        return;
      }

      const regularFields = [];

      Object.entries(data).forEach(([fieldName]) => {
        if (
          fieldName !== "assignedClass" &&
          fieldName !== "class" &&
          fieldName !== "_id" &&
          fieldName !== "__v" &&
          fieldName !== "students" &&
          fieldName !== "numMaleStudents" &&
          fieldName !== "numFemaleStudents" &&
          fieldName !== "createdAt" &&
          fieldName !== "updatedAt"
        ) {
          regularFields.push([fieldName]);
        }
      });

      setFields(regularFields);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching model schema:", error);
    }
  };

  const fetchExistingData = async () => {
    try {
      const res = await api.get(`/api/${modelName.toLowerCase()}/get/${id}`);
      setFormData(res.data);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/${modelName.toLowerCase()}/update/${id}`, formData);

      if (res.status === 200) {
        setSuccessMessage(`${modelName} updated successfully.`);
        setErrorMessage(null);
      } else {
        setErrorMessage(`Failed to update ${modelName}`);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error updating", modelName, ":", error.message);
      setErrorMessage(`Error updating ${modelName}: ${error.message}`);
      setSuccessMessage(null);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  if (loading) {
    return <Loading />; 
  }

  return (
    <>
      <Box
        sx={{
          boxShadow: 1,
          p: 3,
          borderRadius: 2,
          maxWidth: "768px",
          margin: "auto",
          mt: 3,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{ textTransform: "uppercase", fontWeight: 600 }}
          variant="h6"
          gutterBottom
        >
          Update {modelName}
        </Typography>
        <form onSubmit={handleSubmit}>
          {fields.map(
            ([fieldName]) =>
              fieldName !== "assignedClass" &&
              fieldName !== "class" && (
                <TextField
                  key={fieldName}
                  label={`* ${capitalizeFirstLetter(fieldName)}${
                    fieldName === "dob" ? " (YYYY-MM-DD)" : ""
                  }${fieldName === "gender" ? " (Male/Female)" : ""}`}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,1)",
                        borderWidth: "1.5px",
                      },
                    },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: "black !important",
                    },
                    "& .MuiInputBase-input": {
                      color: "black",
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0,0,0,0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "red",
                    },
                  }}
                  SelectProps={{
                    native: true,
                  }}
                  InputProps={
                    fieldName === "email"
                      ? {
                          inputMode: "email",
                          pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                        }
                      : {}
                  }
                  onChange={handleChange}
                  id={fieldName}
                  value={formData[fieldName] || ""}
                />
              )
          )}
          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "black",
              color: "white",
            }}
          >
            Update
          </Button>
        </form>
      </Box>
      {errorMessage && (
        <div className="flex items-center justify-center">
          <Typography variant="body1" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center justify-center">
          <Typography variant="body1" color="#8bc34a" gutterBottom>
            {successMessage}
          </Typography>
        </div>
      )}
    </>
  );
}

export default UpdateForm;
