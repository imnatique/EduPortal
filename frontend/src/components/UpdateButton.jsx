import { Button } from "@mui/material";

function UpdateButton({ onClick }) {
  return (
    <div>
      <Button
        style={{
          backgroundColor: "#FA5252",
          color: "white",
        }}
        variant="contained"
        onClick={onClick}
      >
        Update
      </Button>
    </div>
  );
}

export default UpdateButton;
