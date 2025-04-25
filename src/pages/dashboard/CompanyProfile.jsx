import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { db } from '../../firebase/firebase-config';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

export function CompanyProfile() {
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [lockedCompanies, setLockedCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);
  const fetchCompanies = async () => {
    const activeMaDoanhNghiep = await getMaDoanhNghiepByStatus(true);
    if (activeMaDoanhNghiep.length > 0) {
      const activeCompaniesCollection = collection(db, "tblDoanhNghiep");
      const activeQuery = query(
        activeCompaniesCollection,
        where("sMaDoanhNghiep", "in", activeMaDoanhNghiep)
      );
      const activeSnapshot = await getDocs(activeQuery);
      const activeData = activeSnapshot.docs.map(doc => doc.data());
      console.log("Active Companies Data:", activeData);
      setActiveCompanies(activeData);
    } else {
      console.log("No active companies found.");
    }

    const lockedMaDoanhNghiep = await getMaDoanhNghiepByStatus(false);
    if (lockedMaDoanhNghiep.length > 0) {
      const lockedCompaniesCollection = collection(db, "tblDoanhNghiep");
      const lockedQuery = query(
        lockedCompaniesCollection,
        where("sMaDoanhNghiep", "in", lockedMaDoanhNghiep)
      );
      const lockedSnapshot = await getDocs(lockedQuery);
      const lockedData = lockedSnapshot.docs.map(doc => doc.data());
      console.log("Locked Companies Data:", lockedData);
      setLockedCompanies(lockedData);
    } else {
      console.log("No locked companies found.");
    }
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


  const handleViewDetails = (companyId) => {
    console.log(`check ${companyId}`)
    navigate(`/company_profile/${companyId}`);
  };

  const handleLockCompany = async (companyId) => {
    try {
      const taiKhoanCollection = collection(db, "tblTaiKhoan");
      const taiKhoanQuery = query(taiKhoanCollection, where("sMaTaiKhoan", "==", companyId));
      const taiKhoanSnapshot = await getDocs(taiKhoanQuery);

      if (!taiKhoanSnapshot.empty) {
        const taiKhoanDocRef = taiKhoanSnapshot.docs[0].ref;
        await updateDoc(taiKhoanDocRef, {
          sTrangThai: false,
        });
        console.log(`Company with sMaDoanhNghiep: ${companyId} has been locked.`);
        fetchCompanies();
      } else {
        console.log(`No company found with sMaDoanhNghiep: ${companyId}`);
      }
    } catch (error) {
      console.error("Error locking company: ", error);
    }
  };

  const handleUnLockCompany = async (companyId) => {
    try {
      const taiKhoanCollection = collection(db, "tblTaiKhoan");
      const taiKhoanQuery = query(taiKhoanCollection, where("sMaTaiKhoan", "==", companyId));
      const taiKhoanSnapshot = await getDocs(taiKhoanQuery);

      if (!taiKhoanSnapshot.empty) {
        const taiKhoanDocRef = taiKhoanSnapshot.docs[0].ref;
        await updateDoc(taiKhoanDocRef, {
          sTrangThai: true,
        });
        console.log(`Company with sMaDoanhNghiep: ${companyId} has been unlocked.`);
        fetchCompanies();
      } else {
        console.log(`No company found with sMaDoanhNghiep: ${companyId}`);
      }
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
              {activeCompanies.map((company, key) => {
                console.log("Company Data:", company.sMaDoanhNghiep); // Kiểm tra dữ liệu từng công ty
                return (
                  <tr key={key}>
                    <td className="py-3 px-5">{company.sMaDoanhNghiep}</td>
                    <td className="py-3 px-5">{company.sTenDoanhNghiep}</td>
                    <td className="py-3 px-5">
                      <img src={company.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" />
                    </td>
                    <td className="py-3 px-5">{company.sDiaChi}</td>
                    <td className="py-3 px-5">{company.sLinhVuc}</td>
                    <td className="py-3 px-5">{company.sSoLuongNhanVien}</td>
                    <td className="py-3 px-5">
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          color="blue"
                          size="sm"
                          onClick={() => handleViewDetails(company.sMaDoanhNghiep)}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="outlined"
                          color="red"
                          size="sm"
                          onClick={() => handleLockCompany(company.sMaDoanhNghiep)}
                        >
                          Khóa
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
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        color="blue"
                        size="sm"
                        onClick={() => handleViewDetails(company.sMaDoanhNghiep)}
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
