import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChartExample } from "../components/Chart";
import Loading from "../components/Loading";
import api from "../utils/api"; 

function ClassAnalytics() {
  const { name } = useParams();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get(`/api/class/getByName/${name}`);
      setClassData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!classData) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="lg:px-[10%] px-[5%] lg:mt-20 my-10 flex flex-col lg:flex-row gap-10 overflow-x-hidden">
      <div className="bg-white flex-1 text-xl">
        <h1 className="text-3xl font-bold mb-4 text-black">Class Analytics</h1>

        <p className="mb-2">
          <span className="text-red font-semibold">Name:</span> {classData.name}
        </p>
        <p className="mb-2">
          <span className="text-red font-semibold">Year:</span> {classData.year}
        </p>
        <p className="mb-2">
          <span className="text-red font-semibold">Max Capacity:</span>{" "}
          {classData.maxCapacity}
        </p>
        <p className="mb-2">
          <span className="text-red font-semibold">Teacher Name:</span>{" "}
          {classData.teacher.name}
        </p>

        <p className="mt-4 mb-2 text-red font-semibold">Students:</p>
        <ul className="ml-4">
          {classData.students.map((student, index) => (
            <li key={student._id} className="mb-2">
              {index + 1}. {student.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <ChartExample data={classData} />
      </div>
    </div>
  );
}

export default ClassAnalytics;
