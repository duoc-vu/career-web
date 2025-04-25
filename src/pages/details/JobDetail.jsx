import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { db } from "../../firebase/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

export function JobDetail() {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const jobQuery = query(
        collection(db, "tblTinTuyenDung"),
        where("sMaTinTuyenDung", "==", jobId)
      );
      const jobSnapshot = await getDocs(jobQuery);

      if (!jobSnapshot.empty) {
        const jobDoc = jobSnapshot.docs[0]; 
        setJobData(jobDoc.data());

        const companyQuery = query(
          collection(db, "tblDoanhNghiep"),
          where("sMaDoanhNghiep", "==", jobDoc.data().sMaDoanhNghiep)
        );
        const companySnapshot = await getDocs(companyQuery);

        if (!companySnapshot.empty) {
          const companyDoc = companySnapshot.docs[0]; 
          setCompanyData(companyDoc.data());
        } else {
          console.log("Không tìm thấy thông tin công ty.");
        }
      } else {
        console.log("Không tìm thấy tin tuyển dụng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết tin tuyển dụng:", error);
    }
  };

  if (!jobData || !companyData) {
    console.log("Job Data:", jobData);
    console.log("Company Data:", companyData);
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <div className="flex items-center -mt-36 justify-center min-h-screen">
        <Card className="w-[80%] mx-auto mb-6 lg:mx-4 border border-blue-gray-100">
          <CardBody className="p-4">
            <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
              <div className="w-screen flex flex-col justify-center items-center gap-6">
                <Avatar
                  src={companyData.sAnhDaiDien}
                  alt={companyData.sTenDoanhNghiep}
                  variant="rounded"
                  className="mx-auto mt-[-200px] h-[300px] w-[300px] rounded-lg shadow-lg shadow-blue-gray-500/40"
                />
                <div>
                  <Typography variant="h5" color="blue-gray" className="mt-[20px] flex justify-center">
                    {jobData.sTenCongViec}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    Công ty: {companyData.sTenDoanhNghiep}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Thông tin công việc
                </Typography>
                <div className="flex flex-col gap-4">
                  <Typography>
                    <strong>Mã công việc:</strong> {jobData.sMaTinTuyenDung}
                  </Typography>
                  <Typography>
                    <strong>Vị trí:</strong> {jobData.sViTriTuyenDung}
                  </Typography>
                  <Typography>
                    <strong>Mức lương:</strong> {jobData.sMucLuongToiThieu} vnd - {jobData.sMucLuongToiThieu} vnd
                  </Typography>
                  <Typography>
                    <strong>Thời hạn:</strong> {jobData.sThoiHanTuyenDung}
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Thông tin công ty
                </Typography>
                <div className="flex flex-col gap-4">
                  <Typography>
                    <strong>Tên công ty:</strong> {companyData.sTenDoanhNghiep}
                  </Typography>
                  <Typography>
                    <strong>Địa chỉ:</strong> {companyData.sDiaChi}
                  </Typography>
                  <Typography>
                    <strong>Số lượng nhân viên:</strong> {companyData.sSoLuongNhanVien}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="w-[80%] mt-[20px] lg:mx-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                <strong>Mô tả công việc:</strong>
              </Typography>
              <Typography className="mb-2 text-blue-gray-600" style={{ whiteSpace: "pre-line" }}>
                {jobData.sMoTaCongViec ? jobData.sMoTaCongViec.split("/n")[0] : "Không có mô tả công việc."}
              </Typography>

              <Typography variant="h6" color="blue-gray" className="mb-3 mt-6">
                <strong>Yêu cầu ứng viên:</strong>
              </Typography>
              <Typography className="mb-2 text-blue-gray-600" style={{ whiteSpace: "pre-line" }}>
                {jobData.sMoTaCongViec ? jobData.sMoTaCongViec.split("/n")[1] : "Không có yêu cầu ứng viên."}
              </Typography>

              <Typography variant="h6" color="blue-gray" className="mb-3 mt-6">
                <strong>Quyền lợi:</strong>
              </Typography>
              <Typography className="mb-2 text-blue-gray-600" style={{ whiteSpace: "pre-line" }}>
                {jobData.sMoTaCongViec ? jobData.sMoTaCongViec.split("/n")[2] : "Không có quyền lợi."}
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default JobDetail;