import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context";

export function ExpiredJob() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const navigate = useNavigate();
  const { searchTerm } = useAppContext();

  useEffect(() => {
    const fetchJobsAndCompanies = async () => {
      const jobsCollection = collection(db, "tblTinTuyenDung");
      const q = query(jobsCollection, where("sCoKhoa", "==", 4));
      const jobSnapshot = await getDocs(q);
      const jobList = jobSnapshot.docs.map(doc => doc.data());
      setJobs(jobList);

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

  const filteredJobs = jobs.filter((job) =>
    job.sViTriTuyenDung.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredJobs.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý tin tuyển dụng đã đóng
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
                  "Trạng Thái",
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
              {currentRecords.map((job, key) => {
                const company = companies[job.sMaDoanhNghiep];
                const className = `py-3 px-5 ${key === jobs.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

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
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {company ? <img src={company.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" /> : "No Avatar"}
                      </Typography>
                    </td>
                    <td className={className}>
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
                      <Chip
                        variant="gradient"
                        color={job.sTrangThai === "Đang tuyển" ? "green" : "red"}
                        value={job.sTrangThai}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          color="blue"
                          size="sm"
                          onClick={() => navigate(`/job_detail/${job.sMaTinTuyenDung}`)}
                        >
                          Xem chi tiết
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
      <div className="flex justify-between items-center mt-4">
        <Button
          size="sm"
          variant="outlined"
          color="blue"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Trang trước
        </Button>
        <Typography variant="small" className="text-blue-gray-500">
          Trang {currentPage} / {totalPages}
        </Typography>
        <Button
          size="sm"
          variant="outlined"
          color="blue"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}

export default ExpiredJob;
