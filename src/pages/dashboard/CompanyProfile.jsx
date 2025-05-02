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
import { useAppContext } from "@/context";

export function CompanyProfile() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
const [dialogAction, setDialogAction] = useState(""); 
const [selectedCompany, setSelectedCompany] = useState(null);
  const { searchTerm } = useAppContext();

  const handleOpenDialog = (action, company) => {
    setDialogAction(action);
    setSelectedCompany(company);
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    if (dialogAction === "cancelApproval") {
      await handleCancelApproval(selectedCompany.sMaDoanhNghiep);
    } else if (dialogAction === "lockAccount") {
      await handleLockCompany(selectedCompany.sMaDoanhNghiep);
    }
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
  const fetchCompanies = async () => {
    try {
      const companiesCollection = collection(db, "tblDoanhNghiep");
      const companiesSnapshot = await getDocs(companiesCollection);

      let allCompanies = companiesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        bTrangThai: doc.data().bTrangThai,
      }));

      const taiKhoanCollection = collection(db, "tblTaiKhoan");
      const taiKhoanSnapshot = await getDocs(taiKhoanCollection);

      const taiKhoanMap = taiKhoanSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[data.sMaTaiKhoan] = data.sTrangThai;
        return acc;
      }, {});

      allCompanies = allCompanies.map((company) => ({
        ...company,
        sTrangThai: taiKhoanMap[company.sMaDoanhNghiep] || false,
      }));

      setCompanies(allCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleApproveDocuments = async (companyId) => {
    try {
      const companiesCollection = collection(db, "tblDoanhNghiep");
      const companyQuery = query(companiesCollection, where("sMaDoanhNghiep", "==", companyId));
      const companySnapshot = await getDocs(companyQuery);

      if (!companySnapshot.empty) {
        const companyDocRef = companySnapshot.docs[0].ref;
        await updateDoc(companyDocRef, {
          bTrangThai: true,
        });
        console.log(`Company with sMaDoanhNghiep: ${companyId} has been approved.`);
        fetchCompanies();
      } else {
        console.log(`No company found with sMaDoanhNghiep: ${companyId}`);
      }
    } catch (error) {
      console.error("Error approving documents: ", error);
    }
  };
  const filteredCompanies = companies.filter((company) =>
    company.sTenDoanhNghiep.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        fetchCompanies();
      } else {
        console.log(`No company found with sMaDoanhNghiep: ${companyId}`);
      }
    } catch (error) {
      console.error("Error unlocking company: ", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredCompanies.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCompanies.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleCancelApproval = async (companyId) => {
    try {
      const companiesCollection = collection(db, "tblDoanhNghiep");
      const companyQuery = query(companiesCollection, where("sMaDoanhNghiep", "==", companyId));
      const companySnapshot = await getDocs(companyQuery);
  
      if (!companySnapshot.empty) {
        const companyDocRef = companySnapshot.docs[0].ref;
        await updateDoc(companyDocRef, {
          bTrangThai: false, 
        });
        fetchCompanies(); 
      } else {
        console.log(`No company found with sMaDoanhNghiep: ${companyId}`);
      }
    } catch (error) {
      console.error("Error canceling approval: ", error);
    }
  };

  return (
    <>
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Hồ sơ doanh nghiệp
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
                  "Trạng thái giấy phép",
                  "Thao tác giấy phép",
                  "Thao tác tài khoản"
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
              {currentRecords.map((company, key) => {
                console.log("Company Data:", company.sMaDoanhNghiep);
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
                      {company.bTrangThai ? (
                        <Typography className="text-green-500">Hợp lệ</Typography>
                      ) : (
                        <Typography className="text-yellow-800">Chờ duyệt</Typography>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex gap-2">
                        {company.bTrangThai ? (
                          <Button
                            variant="outlined"
                            color="red"
                            size="sm"
                            onClick={() => handleOpenDialog("cancelApproval", company)}
                          >
                            Hủy duyệt
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="green"
                            size="sm"
                            onClick={() => handleApproveDocuments(company.sMaDoanhNghiep)}
                          >
                            Duyệt giấy tờ
                          </Button>
                        )}
                      </div>
                    </td>
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
                        {company.sTrangThai ? (
                          <Button
                            variant="outlined"
                            color="red"
                            size="sm"
                            onClick={() => handleOpenDialog("lockAccount", company)}
                          >
                            Khóa
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="green"
                            size="sm"
                            onClick={() => handleUnLockCompany(company.sMaDoanhNghiep)}
                          >
                            Mở khóa
                          </Button>
                        )}
                      </div>
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
        Xác nhận hành động
      </Typography>
      <Typography className="mb-4">
        {dialogAction === "cancelApproval"
          ? `Bạn có chắc chắn muốn hủy duyệt giấy phép của doanh nghiệp "${selectedCompany?.sTenDoanhNghiep}" không?`
          : `Bạn có chắc chắn muốn khóa tài khoản của doanh nghiệp "${selectedCompany?.sTenDoanhNghiep}" không?`}
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

export default CompanyProfile;
