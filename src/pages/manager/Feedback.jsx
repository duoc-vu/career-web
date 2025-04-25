import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, query, updateDoc, doc } from "firebase/firestore";
export function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbacksCollection = collection(db, "tblPhanHoi");
      const q = query(feedbacksCollection);
      const feedbackSnapshot = await getDocs(q);
      const feedbackList = feedbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(feedbackList);
    };

    fetchFeedback();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const feedbackDocRef = doc(db, "tblPhanHoi", id);
      await updateDoc(feedbackDocRef, { bTrangThai: !currentStatus });
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === id ? { ...feedback, bTrangThai: !currentStatus } : feedback
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý phản hồi
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Mã phản hồi",
                  "Tiêu đề",
                  "Email liên hệ",
                  "Tên người gửi phản hồi",
                  "Nội dung",
                  "Trạng thái",
                  "Hành động",
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
              {feedbacks.map((feedback, key) => {
                const className = `py-3 px-5 ${key === feedback.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={key}>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {feedback.sMaPhanHoi}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {feedback.sTieuDe}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {feedback.sHoVaTen}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {feedback.sEmailLienHe}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {feedback.sNoiDung}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        className={`text-xs font-semibold ${feedback.bTrangThai
                            ? "text-green-500"
                            : "text-red-500"
                          }`}
                      >
                        {feedback.bTrangThai ? "Đã xử lý" : "Chưa xử lý"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Button
                        size="sm"
                        variant="outlined"
                        color={feedback.bTrangThai ? "red" : "green"}
                        onClick={() =>
                          handleToggleStatus(feedback.id, feedback.bTrangThai)
                        }
                      >
                        {feedback.bTrangThai ? "Chưa xử lý" : "Đã xử lý"}
                      </Button>
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

export default Feedbacks;
