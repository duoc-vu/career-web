import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, updateDoc, doc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/firebase-config";
import { useAppContext } from "@/context";
export function PrivacyOfPolicy() {
  const [privacys, setPrivacys] = useState([]);
  const { searchTerm } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    sTieuDe: "",
    sFilePDF: null,
    bTrangThai: false,
  });

  useEffect(() => {
    const fetchPrivacy = async () => {
      const privacysCollection = collection(db, "tblChinhSach");
      const q = query(privacysCollection);
      const privacySnapshot = await getDocs(q);
      const privacyList = privacySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPrivacys(privacyList);
    };

    fetchPrivacy();
  }, []);

  const filteredPrivacys = privacys.filter((privacy) =>
    privacy.sTieuDe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const privacyDocRef = doc(db, "tblChinhSach", id);
      await updateDoc(privacyDocRef, { bTrangThai: !currentStatus });
      setPrivacys((prevPrivacys) =>
        prevPrivacys.map((privacy) =>
          privacy.id === id ? { ...privacy, bTrangThai: !currentStatus } : privacy
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const handleAddPolicy = async () => {
    try {
      if (!newPolicy.sTieuDe || !newPolicy.sFilePDF) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      const currentUserId = "TK200";

      const storageRef = ref(storage, `tblChinhSach/${newPolicy.sFilePDF.name}`);
      await uploadBytes(storageRef, newPolicy.sFilePDF);
      const fileURL = await getDownloadURL(storageRef);

      const currentDate = new Date().toISOString().split("T")[0];

      const privacysCollection = collection(db, "tblChinhSach");
      await addDoc(privacysCollection, {
        sMaChinhSach: `CS${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        sMaTaiKhoan: currentUserId,
        sTieuDe: newPolicy.sTieuDe,
        sNoiDung: fileURL,
        bTrangThai: newPolicy.bTrangThai,
        sNgayTao: currentDate,
      });

      const updatedPrivacys = await getDocs(privacysCollection);
      setPrivacys(
        updatedPrivacys.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      setOpenDialog(false);
      setNewPolicy({ sTieuDe: "", sFilePDF: null, bTrangThai: false });
    } catch (error) {
      console.error("Lỗi khi thêm chính sách:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredPrivacys.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPrivacys.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="flex justify-between mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý chính sách
          </Typography>
          <Button
            size="sm"
            variant="gradient"
            color="green"
            className=""
            onClick={() => setOpenDialog(true)}
          >
            +
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Mã chính sách",
                  "Mã quản trị viên",
                  "Tiêu đề",
                  "Nội dung",
                  "Ngày đăng tải",
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
              {currentRecords.map((privacy, key) => {
                const className = `py-3 px-5 ${key === privacy.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={key}>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {privacy.sMaChinhSach}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {privacy.sMaTaiKhoan}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {privacy.sTieuDe}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {decodeURIComponent(privacy.sNoiDung.split("?")[0]).split("/").pop()}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {privacy.sNgayTao}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        className={`text-xs font-normal ${privacy.bTrangThai
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {privacy.bTrangThai
                          ? "Đang được áp dụng"
                          : "Không được áp dụng"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Button
                        size="sm"
                        variant="outlined"
                        color={privacy.bTrangThai ? "red" : "green"}
                        onClick={() =>
                          handleToggleStatus(privacy.id, privacy.bTrangThai)
                        }
                      >
                        {privacy.bTrangThai ? "Hủy áp dụng" : "Áp dụng"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outlined"
                        color="gray"
                        onClick={() => window.open(privacy.sNoiDung, "_blank")}
                      >
                        Xem chi tiết
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
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <Typography variant="h6" className="mb-4">
              Thêm chính sách mới
            </Typography>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nhập tiêu đề"
                className="border border-gray-300 p-2 rounded"
                value={newPolicy.sTieuDe}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, sTieuDe: e.target.value })
                }
              />
              <input
                type="file"
                accept=".pdf"
                className="border border-gray-300 p-2 rounded"
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, sFilePDF: e.target.files[0] })
                }
              />
              <select
                className="border border-gray-300 p-2 rounded"
                value={newPolicy.bTrangThai}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, bTrangThai: e.target.value === "true" })
                }
              >
                <option value="false">Không áp dụng</option>
                <option value="true">Áp dụng</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
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
                onClick={handleAddPolicy}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default PrivacyOfPolicy;
