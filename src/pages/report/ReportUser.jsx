import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export function ReportUser() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUserStatistics();
  }, []);

  const fetchUserStatistics = async () => {
    try {
      const accountsCollection = collection(db, "tblTaiKhoan");
      const accountSnapshot = await getDocs(accountsCollection);

      let candidates = 0;
      let recruiters = 0;

      accountSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Dữ liệu tài khoản:", data);
        if (data.sLoaiTaiKhoan === 1) {
          candidates++;
        } else if (data.sLoaiTaiKhoan === 2) {
          recruiters++;
        }
      });

      const totalUsers = candidates + recruiters;
      console.log("Ứng viên:", candidates, "Nhà tuyển dụng:", recruiters, "Tổng:", totalUsers);

      setData([
        { name: "Ứng viên", value:  parseFloat(((candidates / totalUsers) * 100).toFixed(2)) },
        { name: "Nhà tuyển dụng", value: parseFloat(((recruiters / totalUsers) * 100).toFixed(2)) },
      ]);

      setData([
        { name: "Công việc khả dụng", value: parseFloat(((availableJobs / totalJobs) * 100).toFixed(2)) },
        { name: "Công việc hết hạn", value: parseFloat(((expiredJobs / totalJobs) * 100).toFixed(2)) },
        { name: "Công việc bị khóa", value: parseFloat(((lockedJobs / totalJobs) * 100).toFixed(2)) },
      ]);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  const COLORS = ["#0088FE", "#00C49F"]; // Màu sắc cho biểu đồ

  return (
    <div className="mt-12 mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold text-center mb-4">
        Thống kê người dùng (Phần trăm)
      </h2>
      <PieChart width={500} height={600}>
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

export default ReportUser;