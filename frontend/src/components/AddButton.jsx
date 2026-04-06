import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function AddButton({ ModelName }) {
  const navigate = useNavigate();

  const handleAddButtonClick = () => {
    navigate(`/${ModelName.toLowerCase()}/add-${ModelName.toLowerCase()}`);
  };

  return (
    <Button
      style={{
        backgroundColor: "black",
        color: "white",
      }}
      variant="contained"
      endIcon={<AddIcon />}
      onClick={handleAddButtonClick}
    >
      {ModelName}
    </Button>
  );
}

export default AddButton;
