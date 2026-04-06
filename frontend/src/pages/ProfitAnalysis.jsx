import { useState, useEffect } from "react";
import ToggleGroup from "../components/ToggleGroup";
import MonthlyBarChart from "../components/MonthlyBarChart";
import YearlyBarChart from "../components/YearlyBarChart";
import Loading from "../components/Loading";
import api from "../utils/api"; 

function ProfitAnalysis() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [chartType, setChartType] = useState("month");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await api.get(`/api/teacher/getTeacherSalariesSum`);
      const res2 = await api.get(`/api/student/getStudentFeesSum`);

      setData(res1.data.sum);
      setData2(res2.data.sum);
      setLoading(false);
    } catch (error) {
      console.error("❌ Fetch error:", error.message);
      setLoading(false);
    }
  };

  const handleChartTypeChange = (event, newChartType) => {
    setChartType(newChartType);
  };

  if (loading) {
    return <Loading />; 
  }

  return (
    <div className="lg:px-[10%] px-[5%] mt-10">
      <ToggleGroup value={chartType} onChange={handleChartTypeChange} />
      {chartType === "month" ? (
        <MonthlyBarChart sum={data} fees={data2} />
      ) : (
        <YearlyBarChart sum={data} fees={data2} />
      )}
    </div>
  );
}

export default ProfitAnalysis;
