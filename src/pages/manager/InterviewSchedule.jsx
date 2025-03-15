import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
  import React, { useState, useEffect } from "react";
  import { db } from '../../firebase/firebase-config';
  import { collection, getDocs, query } from 'firebase/firestore';
  
  export function InterviewSchedule() {
    const [interviews, setInterviews] = useState([]);
  
    useEffect(() => {
      const fetchInterviews = async () => {
        const interviewsCollection = collection(db, "tblLichHenPhongVan");
        const q = query(interviewsCollection); 
        const interviewSnapshot = await getDocs(q);
        const interviewList = interviewSnapshot.docs.map(doc => doc.data());
        setInterviews(interviewList);
      };
  
      fetchInterviews();
    }, []);
  
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Quản lý lịch hẹn phỏng vấn
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Mã lịch hẹn phỏng vấn",
                    "Mã doanh nghiệp",
                    "Mã ứng viên",
                    "Địa điểm",
                    "Thời gian phỏng vấn",
                    "Tiêu đề",
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
                {interviews.map((interview, key) => {
                  const className = `py-3 px-5 ${key === interviews.length - 1 ? "" : "border-b border-blue-gray-50"}`;
  
                  return (
                    <tr key={key}>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {interview.sMaLichHenPhongVan}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {interview.sMaDoanhNghiep}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {interview.sMaUngVien}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {interview.sDiaDiem}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {interview.sThoiGianPhongVan}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {interview.sTieuDe}
                        </Typography>
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
  
  export default InterviewSchedule;
  