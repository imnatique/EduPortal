import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

function RefreshButton({ onClick, loading }) {
  return (
    <Button
      style={{
        backgroundColor: "black",
        color: "white",
      }}
      variant="outlined"
      endIcon={<RefreshIcon />}
      onClick={onClick}
      disabled={loading}
    >
      Refresh
    </Button>
  );
}

export default RefreshButton;
