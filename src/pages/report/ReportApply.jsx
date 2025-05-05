import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export function ReportApply() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchApplyStatistics();
  }, []);

  const fetchApplyStatistics = async () => {
    try {
      const applyCollection = collection(db, "tblDonUngTuyen");
      const applySnapshot = await getDocs(applyCollection);

      let approved = 0;
      let pending = 0;
      let rejected = 0;

      applySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.sTrangThai === 1) {
          approved++;
        } else if (data.sTrangThai === 2) {
          pending++;
        } else if (data.sTrangThai === 3) {
          rejected++;
        }
      });

      const totalApplications = approved + pending + rejected;

      if (totalApplications === 0) {
        setData([]);
        return;
      }

      setData([
        { name: "Đã được duyệt", value: parseFloat(((approved / totalApplications) * 100).toFixed(2)) },
        { name: "Chờ duyệt", value: parseFloat(((pending / totalApplications) * 100).toFixed(2)) },
        { name: "Bị từ chối", value: parseFloat(((rejected / totalApplications) * 100).toFixed(2)) },
      ]);
    } catch (error) {
      console.error("Error fetching apply statistics:", error);
    }
  };

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

  return (
    <div className="mt-12 mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold text-center mb-4">
        Thống kê đơn ứng tuyển (Phần trăm)
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

export default ReportApply;