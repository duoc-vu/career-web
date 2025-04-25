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

export function CandidateDetail() {
  const { candidateId } = useParams();
  const [candidateData, setCandidateData] = useState(null);

  useEffect(() => {
    if (candidateId) {
      fetchCandidateDetails();
    }
  }, [candidateId]);

  const fetchCandidateDetails = async () => {
    try {
      const candidateQuery = query(
        collection(db, "tblUngVien"),
        where("sMaUngVien", "==", candidateId)
      );
      const candidateSnapshot = await getDocs(candidateQuery);

      if (!candidateSnapshot.empty) {
        const candidateDoc = candidateSnapshot.docs[0];
        setCandidateData(candidateDoc.data());
      } else {
        console.log("Không tìm thấy ứng viên.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết ứng viên:", error);
    }
  };

  if (!candidateData) {
    console.log("Candidate Data:", candidateData);
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
                  src={candidateData.sAnhDaiDien}
                  alt={candidateData.sHoVaTen}
                  variant="rounded"
                  className="mx-auto mt-[-200px] h-[300px] w-[300px] rounded-lg shadow-lg shadow-blue-gray-500/40"
                />
                <div>
                  <Typography variant="h5" color="blue-gray" className="mt-[20px] flex justify-center">
                    {candidateData.sHoVaTen}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    Chuyên ngành: {candidateData.sChuyenNganh}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Thông tin ứng viên
                </Typography>
                <div className="flex flex-col gap-4">
                  <Typography>
                    <strong>Mã ứng viên:</strong> {candidateData.sMaUngVien}
                  </Typography>
                  <Typography>
                    <strong>Địa chỉ:</strong> {candidateData.sDiaChi}
                  </Typography>
                  <Typography>
                    <strong>Số điện thoại:</strong> {candidateData.sSoDienThoai}
                  </Typography>
                  <Typography>
                    <strong>Lĩnh vực:</strong> {candidateData.sLinhVuc}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="w-[80%] mt-[20px] lg:mx-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                <strong>Mô tả chi tiết:</strong>
              </Typography>
              {candidateData.sMoTaChiTiet.split("-").map((paragraph, index) => (
                <Typography key={index} className="mb-2 text-blue-gray-600">
                  {paragraph.trim()}
                </Typography>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default CandidateDetail;