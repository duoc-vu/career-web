import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export function CompanyProfile() {
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [lockedCompanies, setLockedCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const activeCompaniesCollection = collection(db, "tblDoanhNghiep");
      const activeQuery = query(
        activeCompaniesCollection,
        where("sMaDoanhNghiep", "in", await getMaDoanhNghiepByStatus(true))
      );
      const activeSnapshot = await getDocs(activeQuery);
      const activeData = activeSnapshot.docs.map(doc => doc.data());
      setActiveCompanies(activeData);

      const lockedCompaniesCollection = collection(db, "tblDoanhNghiep");
      const lockedQuery = query(
        lockedCompaniesCollection,
        where("sMaDoanhNghiep", "in", await getMaDoanhNghiepByStatus(false))
      );
      const lockedSnapshot = await getDocs(lockedQuery);
      const lockedData = lockedSnapshot.docs.map(doc => doc.data());
      setLockedCompanies(lockedData);
    };

    const getMaDoanhNghiepByStatus = async (status) => {
      const taiKhoanCollection = collection(db, "tblTaiKhoan");
      const taiKhoanQuery = query(
        taiKhoanCollection,
        where("sTrangThai", "==", status)
      );
      const taiKhoanSnapshot = await getDocs(taiKhoanQuery);
      return taiKhoanSnapshot.docs.map(doc => doc.data().sMaTaiKhoan);
    };

    fetchCompanies();
  }, []);

  const handleLockCompany = async (companyId) => {
    try {
      const taiKhoanDocRef = doc(db, 'tblTaiKhoan', companyId);
      await updateDoc(taiKhoanDocRef, {
        sTrangThai: false,  
      });
      console.log(`Company with ID: ${companyId} has been locked.`);
      fetchCompanies(); 
    } catch (error) {
      console.error("Error locking company: ", error);
    }
  };

  const handleUnLockCompany = async (companyId) => {
    try {
      const taiKhoanDocRef = doc(db, 'tblTaiKhoan', companyId);
      await updateDoc(taiKhoanDocRef, {
        sTrangThai: true,  
      });
      console.log(`Company with ID: ${companyId} has been unlocked.`);
      fetchCompanies(); 
    } catch (error) {
      console.error("Error unlocking company: ", error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Hồ sơ hợp lệ
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Mã công ty",
                  "Tên công ty",
                  "Ảnh đại diện",
                  "Địa chỉ",
                  "Lĩnh vực",
                  "Số lượng nhân viên",
                  "Mô tả chi tiết",
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
              {activeCompanies.map((company, key) => (
                <tr key={key}>
                  <td className="py-3 px-5">{company.sMaDoanhNghiep}</td>
                  <td className="py-3 px-5">{company.sTenDoanhNghiep}</td>
                  <td className="py-3 px-5">
                    <img src={company.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="py-3 px-5">{company.sDiaChi}</td>
                  <td className="py-3 px-5">{company.sLinhVuc}</td>
                  <td className="py-3 px-5">{company.sSoLuongNhanVien}</td>
                  <td className="py-3 px-5">{company.sMoTaChiTiet}</td>
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        color="blue"
                        size="sm"
                        onClick={() => handleViewDetails(job.sMaTinTuyenDung)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="outlined"
                        color="red"
                        size="sm"
                        onClick={() => handleLockCompany(company.sMaTaiKhoan)}
                      >
                        Khóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Hồ sơ bị khóa
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Mã công ty",
                  "Tên công ty",
                  "Ảnh đại diện",
                  "Địa chỉ",
                  "Lĩnh vực",
                  "Số lượng nhân viên",
                  "Mô tả chi tiết",
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
              {lockedCompanies.map((company, key) => (
                <tr key={key}>
                  <td className="py-3 px-5">{company.sMaDoanhNghiep}</td>
                  <td className="py-3 px-5">{company.sTenDoanhNghiep}</td>
                  <td className="py-3 px-5">
                    <img src={company.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="py-3 px-5">{company.sDiaChi}</td>
                  <td className="py-3 px-5">{company.sLinhVuc}</td>
                  <td className="py-3 px-5">{company.sSoLuongNhanVien}</td>
                  <td className="py-3 px-5">{company.sMoTaChiTiet}</td>
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        color="blue"
                        size="sm"
                        onClick={() => handleViewDetails(job.sMaTinTuyenDung)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="outlined"
                        color="green"
                        size="sm"
                        onClick={() => handleUnLockCompany(company.sMaDoanhNghiep)}
                      >
                        Mở khóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default CompanyProfile;
