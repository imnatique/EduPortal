import { useParams } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";
function UpdateFormPage() {
  const { model, id } = useParams();
  return (
    <div>
      <UpdateForm modelName={model} id={id} />
    </div>
  );
}

export default UpdateFormPage;
