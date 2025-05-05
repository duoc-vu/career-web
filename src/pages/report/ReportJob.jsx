import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export function ReportJob() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchJobStatistics();
  }, []);

  const fetchJobStatistics = async () => {
    try {
      const jobsCollection = collection(db, "tblTinTuyenDung");
      const jobSnapshot = await getDocs(jobsCollection);

      let availableJobs = 0;
      let expiredJobs = 0;
      let lockedJobs = 0;

      jobSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.sCoKhoa === 1) {
          availableJobs++;
        } else if (data.sCoKhoa === 4) {
          expiredJobs++;
        } else if (data.sCoKhoa === 3) {
          lockedJobs++;
        }
      });

      const totalJobs = availableJobs + expiredJobs + lockedJobs;

      if (totalJobs === 0) {
        setData([]);
        return;
      }

      setData([
        { name: "Công việc khả dụng", value: parseFloat(((availableJobs / totalJobs) * 100).toFixed(2)) },
        { name: "Công việc hết hạn", value: parseFloat(((expiredJobs / totalJobs) * 100).toFixed(2)) },
        { name: "Công việc bị khóa", value: parseFloat(((lockedJobs / totalJobs) * 100).toFixed(2)) },
      ]);
    } catch (error) {
      console.error("Error fetching job statistics:", error);
    }
  };

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"]; 

  return (
    <div className="mt-12 mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold text-center mb-4">
        Thống kê công việc (Phần trăm)
      </h2>
      <PieChart width={800} height={600}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default ReportJob;