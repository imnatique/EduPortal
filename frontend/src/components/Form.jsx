import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function DynamicForm({ modelName }) {
  const navigate = useNavigate();
  const lowerModel = modelName.toLowerCase();

  const [formData, setFormData] = useState({});
  const [classes, setClasses] = useState([]); // for teacher/class dropdowns
  const [loading, setLoading] = useState(false);

  // Fetch dropdown data if needed (for Teacher → classes)
  useEffect(() => {
    const fetchDropdownData = async () => {
      if (modelName === "Teacher" || modelName === "Student") {
        try {
          const res = await api.get("/api/class/get");
          setClasses(res.data);
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      }
    };
    fetchDropdownData();
  }, [modelName]);

  // Define fields based on model
  const getFields = () => {
    switch (modelName) {
      case "Teacher":
        return [
          { name: "name", label: "Full Name", type: "text" },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            options: ["Male", "Female"],
          },
          { name: "dob", label: "Date of Birth", type: "date" },
          { name: "email", label: "Email", type: "email" },
          { name: "salary", label: "Salary", type: "number" },
          {
            name: "assignedClass",
            label: "Assigned Class",
            type: "dropdown",
            options: classes.map((c) => c.name),
          },
        ];

      case "Class":
        return [
          { name: "name", label: "Class Name", type: "text" },
          { name: "year", label: "Year", type: "number" },
          {
            name: "curCapacity",
            label: "Cur Capacity",
            type: "number",
          },
          { name: "maxCapacity", label: "Max Capacity", type: "number" },
          {
            name: "teacher",
            label: "Assign Teacher (optional)",
            type: "dropdown",
            options: classes.map((c) => c.teacher?.name || "None"),
          },
        ];

      case "Student":
        return [
          { name: "name", label: "Full Name", type: "text" },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            options: ["Male", "Female"],
          },
          { name: "dob", label: "Date of Birth", type: "date" },
          { name: "email", label: "Email", type: "email" },
          { name: "feesPaid", label: "Fees Paid", type: "number" },
          {
            name: "class",
            label: "Class",
            type: "dropdown",
            options: classes.map((c) => c.name),
          },
        ];

      default:
        return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/api/${lowerModel}/create`, formData);
      alert(`${modelName} created successfully!`);
      navigate(`/${lowerModel}`);
    } catch (error) {
      console.error("Error creating:", error);
      alert("Failed to create " + modelName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:px-[10%] px-[5%] max-w-3xl mx-auto my-10">
      <h2 className="text-2xl font-semibold mb-5 uppercase text-center">
        Add {modelName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {getFields().map((field) => (
          <div key={field.name}>
            <label className="block font-medium mb-1">{field.label}</label>

            {field.type === "select" ? (
              <select
                name={field.name}
                className="border border-black rounded p-2 w-full"
                onChange={handleChange}
                required
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "dropdown" ? (
              <select
                name={field.name}
                className="border border-black rounded p-2 w-full"
                onChange={handleChange}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                className="border border-black rounded p-2 w-full"
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="max-w-lg mx-auto p-3 px-4 bg-black text-white shadow-lg rounded-lg mt-10 hover:opacity-80"
          disabled={loading}
        >
          {loading ? "Saving..." : `Add ${modelName}`}
        </button>
      </form>
    </div>
  );
}

export default DynamicForm;
