import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteButton from "./DeleteButton";
import UpdateButton from "./UpdateButton";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import api from "../utils/api";
import AnalyticsButton from "./AnalyticsButton";
import { useAuth } from "../hooks/useAuth";

function Table({ modelName }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [modelName]);

  const selectedFieldsMap = {
    student: [
      "name",
      "gender",
      "dob",
      "email",
      "feesPaid",
      "class.name",
      "_id",
    ],
    teacher: [
      "email",
      "name",
      "gender",
      "dob",
      "salary",
      "assignedClass.name",
      "_id",
    ],
    class: [
      "name",
      "year",
      "teacher.name",
      "currentCapacity",
      "maxCapacity",
      "_id",
    ],
  };

  const handleDelete = async (lowerCaseModelName, id) => {
    try {
      await api.delete(`/api/${lowerCaseModelName}/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.status === 401) handleUnauthorized();
    }
  };

  const handleUpdate = (lowerCaseModelName, id) => {
    navigate(`/${lowerCaseModelName}/update/${id}`);
  };

  const handleUnauthorized = async () => {
    await signOut();
    navigate("/sign-in");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const lowerCaseModelName = modelName.toLowerCase();
      const response = await api.get(`/api/${lowerCaseModelName}/get`);
      const data = response.data;

      const selectedFields = selectedFieldsMap[lowerCaseModelName];
      const rowsWithSelectedFields = data.map((row, index) => {
        const selectedValues = selectedFields.reduce((acc, key) => {
          const keys = key.split(".");
          let value = row;
          for (let k of keys) value = value?.[k] ?? "";
          if (key === "dob" && value) value = value.slice(0, 10);
          acc[key] = value;
          return acc;
        }, {});
        return { id: index + 1, ...selectedValues, _id: row._id };
      });

      const firstRow = rowsWithSelectedFields[0];
      const gridColumns = Object.keys(firstRow || {}).map((col) => ({
        field: col,
        headerName: getHeaderTitle(col),
        width: 125,
        flex: col === "name" || col === "email" ? 1 : undefined,
      }));

      gridColumns.push({
        field: "actions",
        headerName: "Actions",
        width: 200,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <UpdateButton
              onClick={() => handleUpdate(lowerCaseModelName, params.row._id)}
            />
            <DeleteButton
              onClick={() => handleDelete(lowerCaseModelName, params.row._id)}
            />
          </div>
        ),
      });

      if (lowerCaseModelName === "class") {
        gridColumns.push({
          field: "analytics",
          headerName: "Analytics",
          width: 150,
          renderCell: (params) => (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AnalyticsButton classNameValue={params.row["name"]} />
            </div>
          ),
        });
      }

      setRows(rowsWithSelectedFields);
      setColumns(gridColumns);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      if (error.response?.status === 401) {
        setError("Authentication required. Redirecting to login...");
        handleUnauthorized();
      } else {
        setError(
          `Failed to load ${modelName} data: ${error.response?.data?.message || error.message}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getHeaderTitle = (columnName) => {
    const headerMap = {
      dob: "Date of Birth",
      "assignedClass.name": "Assigned Class",
      currentCapacity: "Current Capacity",
      maxCapacity: "Max Capacity",
      "teacher.name": "Assigned Teacher",
      "class.name": "Class Name",
      feesPaid: "Fees Paid",
      id: "ID",
      _id: "User ID",
    };
    return (
      headerMap[columnName] ||
      columnName.charAt(0).toUpperCase() + columnName.slice(1)
    );
  };

  useEffect(() => {
    const handleRefresh = () => fetchData();
    window.addEventListener("refresh-table", handleRefresh);
    return () => window.removeEventListener("refresh-table", handleRefresh);
  }, []);

  return (
    <div style={{ height: 500, width: "100%" }}>
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "16px",
            padding: "8px",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Loading />
        </div>
      ) : (
        <DataGrid
          sx={{
            mt: 2,
            boxShadow: 1,
            fontSize: 14,
            "& .MuiDataGrid-cell": { padding: "8px", alignItems: "center" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5" },
          }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      )}
    </div>
  );
}

export default Table;
