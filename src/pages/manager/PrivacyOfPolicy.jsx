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
export function PrivacyOfPolicy() {
  const [privacys, setPrivacys] = useState([]);

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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý chính sách
          </Typography>
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
              {privacys.map((privacy, key) => {
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
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {privacy.sNoiDung}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {privacy.sNgayTao}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        className={`text-xs font-semibold ${privacy.bTrangThai
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

export default PrivacyOfPolicy;
