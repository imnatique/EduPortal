import { CircularProgress } from "@mui/material";

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
      }}
    >
      <CircularProgress sx={{ color: "#BE123C" }} />
    </div>
  );
}

export default Loading;
