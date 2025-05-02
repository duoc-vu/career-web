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
import { useAppContext } from "@/context";
export function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const { searchTerm } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const handleOpenDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenDialog(true);
  };

  const sendEmail = async (feedback) => {
    try {
      const response = await fetch("http://localhost:3000/api/reply-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: feedback.sEmailLienHe,
          subject: "Phản hồi của bạn đã được xử lý",
          title: feedback.sTieuDe,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
  
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedFeedback) return;
  
    try {
      await handleToggleStatus(selectedFeedback.id, selectedFeedback.bTrangThai);
  
      await sendEmail(selectedFeedback);
  
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi xử lý phản hồi:", error);
    }
  };

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

  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.sTieuDe.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredFeedbacks.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredFeedbacks.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <>
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
                  // "Trạng thái",
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
              {currentRecords.map((feedback, key) => {
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
                    {/* <td className={className}>
                      <Typography
                        className={`text-xs font-normal ${feedback.bTrangThai
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {feedback.bTrangThai ? "Đã xử lý" : "Chưa xử lý"}
                      </Typography>
                    </td> */}
                    <td className={className}>
                      <Button
                        size="sm"
                        variant="outlined"
                        color={feedback.bTrangThai ? "green" : "red"}
                        disabled={feedback.bTrangThai ? true : false}
                        onClick={() =>
                          handleOpenDialog(feedback)
                        }
                      >
                        {feedback.bTrangThai ? "Đã xử lý" : "Xác nhận"}
                      </Button>
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
        Xác nhận xử lý phản hồi
      </Typography>
      <Typography className="mb-4">
        Bạn có chắc chắn muốn đánh dấu phản hồi với tiêu đề "
        {selectedFeedback?.sTieuDe}" là đã xử lý không?
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
          onClick={handleConfirmAction}
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

export default Feedbacks;
