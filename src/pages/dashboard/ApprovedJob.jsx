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
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context";

export function ApprovedJob() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const navigate = useNavigate();
  const { searchTerm } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleOpenDialog = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  useEffect(() => {
    const fetchJobsAndCompanies = async () => {
      const jobsCollection = collection(db, "tblTinTuyenDung");
      const q = query(jobsCollection, where("sCoKhoa", "==", 1));
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

  const handleConfirmCloseJob = async () => {
    if (!selectedJob) return;

    try {
      const jobsCollection = collection(db, "tblTinTuyenDung");
      const q = query(jobsCollection, where("sMaTinTuyenDung", "==", selectedJob.sMaTinTuyenDung));
      const jobSnapshot = await getDocs(q);

      if (jobSnapshot.empty) {
        console.log("No such document with sMaTinTuyenDung:", selectedJob.sMaTinTuyenDung);
        return;
      }

      const jobDocRef = doc(db, "tblTinTuyenDung", jobSnapshot.docs[0].id);

      await updateDoc(jobDocRef, {
        sCoKhoa: 3,
      });

      console.log(`Job with ID: ${selectedJob.sMaTinTuyenDung} has been closed.`);
      setOpenDialog(false);

      const updatedJobs = jobs.filter((job) => job.sMaTinTuyenDung !== selectedJob.sMaTinTuyenDung);
      setJobs(updatedJobs);
    } catch (error) {
      console.error("Error closing job: ", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredJobs.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <>
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
                        <div className="flex gap-2">
                          <Button
                            variant="outlined"
                            color="blue"
                            size="sm"
                            onClick={() => navigate(`/job_detail/${job.sMaTinTuyenDung}`)}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            variant="outlined"
                            color="red"
                            size="sm"
                            onClick={() => handleOpenDialog(job)}
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
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <Typography variant="h6" className="mb-4">
              Xác nhận đóng bài viết
            </Typography>
            <Typography className="mb-4">
              Bạn có chắc chắn muốn đóng bài viết "{selectedJob?.sViTriTuyenDung}" không?
            </Typography>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outlined"
                color="red"
                onClick={() => setOpenDialog(false)}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                variant="gradient"
                color="green"
                onClick={handleConfirmCloseJob}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApprovedJob;
