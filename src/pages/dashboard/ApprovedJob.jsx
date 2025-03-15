import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

export function ApprovedJob() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});

  useEffect(() => {
    const fetchJobsAndCompanies = async () => {
      // Fetch Jobs with status "Không" (open status)
      const jobsCollection = collection(db, "tblTinTuyenDung");
      const q = query(jobsCollection, where("sCoKhoa", "==", 1)); // sCoKhoa = 1 for open status
      const jobSnapshot = await getDocs(q);
      const jobList = jobSnapshot.docs.map(doc => doc.data());
      setJobs(jobList);

      // Fetch companies based on sMaDoanhNghiep in the jobs
      const companiesCollection = collection(db, "tblDoanhNghiep");
      const companiesSnapshot = await getDocs(companiesCollection);
      let companiesData = {};
      companiesSnapshot.forEach(doc => {
        companiesData[doc.data().sMaDoanhNghiep] = doc.data();
      });
      setCompanies(companiesData);
    };

    fetchJobsAndCompanies();
  }, []);

  const handleCloseJob = async (jobId) => {
    try {
      const jobsCollection = collection(db, 'tblTinTuyenDung');
      const q = query(jobsCollection, where("sMaTinTuyenDung", "==", jobId));

      const jobSnapshot = await getDocs(q);

      if (jobSnapshot.empty) {
        console.log("No such document with sMaTinTuyenDung:", jobId);
        return;
      }

      const jobDocRef = doc(db, 'tblTinTuyenDung', jobSnapshot.docs[0].id);

      await updateDoc(jobDocRef, {
        sCoKhoa: 3,
      });
      console.log(`Job with ID: ${jobId} has been closed and sCoKhoa is set to "Có"`);
    } catch (error) {
      console.error("Error closing job: ", error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý tin tuyển dụng được duyệt
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Công việc",
                  "Vị trí tuyển dụng",
                  "Ảnh đại diện",
                  "Tên công ty",
                  "Thời gian đăng bài",
                  "Thời hạn tuyển dụng",
                  "Thao tác"
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, key) => {
                const company = companies[job.sMaDoanhNghiep];  // Lấy thông tin công ty từ companies
                const className = `py-3 px-5 ${key === jobs.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={key}>
                    <td className={className}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {job.sMaTinTuyenDung}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {job.sViTriTuyenDung}
                      </Typography>
                    </td>
                    <td className={className}>
                      {/* Hiển thị ảnh đại diện công ty nếu có */}
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {company ? <img src={company.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" /> : "No Avatar"}
                      </Typography>
                    </td>
                    <td className={className}>
                      {/* Hiển thị tên công ty nếu có */}
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {company ? company.sTenDoanhNghiep : "No Company Name"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {job.sThoiGianDangBai}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {job.sThoiHanTuyenDung}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          color="blue"
                          size="sm"
                          onClick={() => handleViewDetails(job.sMaTinTuyenDung)}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="outlined"
                          color="red"
                          size="sm"
                          onClick={() => handleCloseJob(job.sMaTinTuyenDung)}
                        >
                          Đóng bài viết
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default ApprovedJob;
