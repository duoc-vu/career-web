import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { db } from "../../firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

export function CompanyDetail() {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const navigate = useNavigate();

  const handleViewLicense = (licenseUrl) => {
    if (!licenseUrl) {
      alert("Không có giấy phép kinh doanh để hiển thị.");
      return;
    }
    navigate("/company_license", { state: { licenseUrl } });
  };
  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    try {
      const companyQuery = query(
        collection(db, "tblDoanhNghiep"),
        where("sMaDoanhNghiep", "==", companyId)
      );
      const companySnapshot = await getDocs(companyQuery);

      if (!companySnapshot.empty) {
        const companyDoc = companySnapshot.docs[0];
        setCompanyData(companyDoc.data());

        const accountQuery = query(
          collection(db, "tblTaiKhoan"),
          where("sMaTaiKhoan", "==", companyId)
        );
        const accountSnapshot = await getDocs(accountQuery);

        if (!accountSnapshot.empty) {
          const accountDoc = accountSnapshot.docs[0];
          setAccountData(accountDoc.data());
        } else {
          console.log("Không tìm thấy tài khoản liên quan.");
        }
      } else {
        console.log("Không tìm thấy công ty.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết công ty:", error);
    }
  };

  if (!companyData || !accountData) {
    console.log("Company Data:", companyData);
    console.log("Account Data:", accountData);
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <div className="flex items-center -mt-36 justify-center min-h-screen">
        <Card className="w-[80%] mx-auto  mb-6 lg:mx-4 border border-blue-gray-100">
          <CardBody className="p-4">
            <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
              <div className="w-screen flex flex-col justify-center items-center gap-6">
                <Avatar
                  src={companyData.sAnhDaiDien}
                  alt={companyData.sTenDoanhNghiep}
                  variant="rounded"
                  className="mx-auto mt-[-200px] h-[300px] w-[300px] rounded-lg shadow-lg shadow-blue-gray-500/40" />
                <div>
                  <Typography variant="h5" color="blue-gray" className="mt-[20px] flex justify-center">
                    {companyData.sTenDoanhNghiep}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    Lĩnh vực kinh doanh:  {companyData.sLinhVuc}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Thông tin công ty
                </Typography>
                <div className="flex flex-col gap-4">
                  <Typography>
                    <strong>Mã công ty:</strong> {companyData.sMaDoanhNghiep}
                  </Typography>
                  <Typography>
                    <strong>Địa chỉ:</strong> {companyData.sDiaChi}
                  </Typography>
                  <Typography>
                    <strong>Số lượng nhân viên:</strong> {companyData.sSoLuongNhanVien}
                  </Typography>
                  {/* <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleViewLicense(companyData.sGiayPhepKinhDoanh)}
                  >
                    Xem giấy phép kinh doanh
                  </button> */}
                </div>
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Thông tin tài khoản
                </Typography>
                <div className="flex flex-col gap-4">
                  <Typography>
                    <strong>Email liên hệ:</strong> {accountData.sEmailLienHe}
                  </Typography>
                  <Typography>
                    <strong>Loại tài khoản:</strong> {accountData.sLoaiTaiKhoan}
                  </Typography>
                  <Typography>
                    <strong>Trạng thái:</strong>{" "}
                    {accountData.sTrangThai ? "Hoạt động" : "Bị khóa"}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="w-[80%] mt-[20px] lg:mx-4 ">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                <strong>Mô tả:</strong>
              </Typography>
              {companyData.sMoTaChiTiet.split("\\n").map((paragraph, index) => (
                <Typography key={index} className="mb-2 text-blue-gray-600" style={{ whiteSpace: "pre-line" }}>
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

export default CompanyDetail;