import Button from "@mui/material/Button";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";
function AnalyticsButton({ classNameValue }) {
  const navigate = useNavigate();

  const handleViewAnalytics = () => {
    navigate(`/class-analytics/${classNameValue}`);
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: "#000",
          color: "white",
        }}
        variant="contained"
        endIcon={<BarChartIcon />}
        onClick={handleViewAnalytics}
      >
        Analytics
      </Button>
    </div>
  );
}

export default AnalyticsButton;
