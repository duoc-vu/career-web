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
  
  export function CandidateProfile() {
    const [activeCandidates, setActiveCandidates] = useState([]);
    const [lockedCandidates, setLockedCandidates] = useState([]);
  
    useEffect(() => {
      const fetchCandidates = async () => {
        const activeCandidatesCollection = collection(db, "tblUngVien");
        const activeQuery = query(
            activeCandidatesCollection,
          where("sMaUngVien", "in", await getMaUngVienByStatus(true))
        );
        const activeSnapshot = await getDocs(activeQuery);
        const activeData = activeSnapshot.docs.map(doc => doc.data());
        setActiveCandidates(activeData);
  
        const lockedCandidatesCollection = collection(db, "tblUngVien");
        const lockedQuery = query(
            lockedCandidatesCollection,
          where("sMaUngVien", "in", await getMaUngVienByStatus(false))
        );
        const lockedSnapshot = await getDocs(lockedQuery);
        const lockedData = lockedSnapshot.docs.map(doc => doc.data());
        setLockedCandidates(lockedData);
      };
  
      const getMaUngVienByStatus = async (status) => {
        const taiKhoanCollection = collection(db, "tblTaiKhoan");
        const taiKhoanQuery = query(
          taiKhoanCollection,
          where("sTrangThai", "==", status)
        );
        const taiKhoanSnapshot = await getDocs(taiKhoanQuery);
        return taiKhoanSnapshot.docs.map(doc => doc.data().sMaTaiKhoan);
      };
  
      fetchCandidates();
    }, []);
  
    const handleLockCandidate = async (candidateId) => {
      try {
        const taiKhoanDocRef = doc(db, 'tblTaiKhoan', candidateId);
        await updateDoc(taiKhoanDocRef, {
          sTrangThai: false,  
        });
        console.log(`Candidate with ID: ${candidateId} has been locked.`);
        fetchCandidates(); 
      } catch (error) {
        console.error("Error locking candidate: ", error);
      }
    };
  
    const handleUnLockCandidate = async (candidateId) => {
      try {
        const taiKhoanDocRef = doc(db, 'tblTaiKhoan', candidateId);
        await updateDoc(taiKhoanDocRef, {
          sTrangThai: true,  
        });
        console.log(`Candidate with ID: ${candidateId} has been unlocked.`);
        fetchCandidates(); 
      } catch (error) {
        console.error("Error unlocking candidate: ", error);
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
                    "Mã ứng viên",
                    "Tên ứng viên",
                    "Ảnh đại diện",
                    "Địa chỉ",
                    "Chuyên ngành",
                    "Số điện thoại",
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
                {activeCandidates.map((candidate, key) => (
                  <tr key={key}>
                    <td className="py-3 px-5">{candidate.sMaUngVien}</td>
                    <td className="py-3 px-5">{candidate.sHoVaTen}</td>
                    <td className="py-3 px-5">
                      <img src={candidate.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" />
                    </td>
                    <td className="py-3 px-5">{candidate.sDiaChi}</td>
                    <td className="py-3 px-5">{candidate.sChuyenNganh}</td>
                    <td className="py-3 px-5">{candidate.sSoDienThoai}</td>
                    <td className="py-3 px-5">{candidate.sMoTaChiTiet}</td>
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
                          onClick={() => handleLockCandidate(candidate.sMaUngVien)}
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
                    "Mã ứng viên",
                    "Tên ứng viên",
                    "Ảnh đại diện",
                    "Địa chỉ",
                    "Chuyên ngành",
                    "Số điện thoại",
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
                {lockedCandidates.map((candidate, key) => (
                  <tr key={key}>
                    <td className="py-3 px-5">{candidate.sMaUngVien}</td>
                    <td className="py-3 px-5">{candidate.sHoVaTen}</td>
                    <td className="py-3 px-5">
                      <img src={candidate.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" />
                    </td>
                    <td className="py-3 px-5">{candidate.sDiaChi}</td>
                    <td className="py-3 px-5">{candidate.sChuyenNganh}</td>
                    <td className="py-3 px-5">{candidate.sSoDienThoai}</td>
                    <td className="py-3 px-5">{candidate.sMoTaChiTiet}</td>
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
                          onClick={() => handleUnLockCandidate(candidate.sMaUngVien)}
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
  
  export default CandidateProfile;
  