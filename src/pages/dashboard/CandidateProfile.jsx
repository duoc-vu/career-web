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

export function CandidateProfile() {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();
  const { searchTerm } = useAppContext();
  useEffect(() => {
    fetchCandidates();
  }, []);
  const fetchCandidates = async () => {
    const activeCandidatesCollection = collection(db, "tblUngVien");
    const activeQuery = query(
      activeCandidatesCollection,
      where("sMaUngVien", "in", await getMaUngVienByStatus(true))
    );
    const activeSnapshot = await getDocs(activeQuery);
    const activeData = activeSnapshot.docs.map((doc) => ({
      ...doc.data(),
      bTrangThai: true,
    }));

    const lockedCandidatesCollection = collection(db, "tblUngVien");
    const lockedQuery = query(
      lockedCandidatesCollection,
      where("sMaUngVien", "in", await getMaUngVienByStatus(false))
    );
    const lockedSnapshot = await getDocs(lockedQuery);
    const lockedData = lockedSnapshot.docs.map((doc) => ({
      ...doc.data(),
      bTrangThai: false,
    }));
    setCandidates([...activeData, ...lockedData]);
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.sHoVaTen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMaUngVienByStatus = async (status) => {
    const taiKhoanCollection = collection(db, "tblTaiKhoan");
    const taiKhoanQuery = query(
      taiKhoanCollection,
      where("sTrangThai", "==", status)
    );
    const taiKhoanSnapshot = await getDocs(taiKhoanQuery);
    return taiKhoanSnapshot.docs.map(doc => doc.data().sMaTaiKhoan);
  };

  const handleLockCandidate = async (candidateId) => {
    try {
      const taiKhoanCollection = collection(db, "tblTaiKhoan");
      const taiKhoanQuery = query(taiKhoanCollection, where("sMaTaiKhoan", "==", candidateId));
      const taiKhoanSnapshot = await getDocs(taiKhoanQuery);

      if (!taiKhoanSnapshot.empty) {
        const taiKhoanDocRef = taiKhoanSnapshot.docs[0].ref;
        await updateDoc(taiKhoanDocRef, {
          sTrangThai: false,
        });
        console.log(`Candidate with sMaUngVien: ${candidateId} has been locked.`);
        fetchCandidates();
      } else {
        console.log(`No candidate found with sMaUngVien: ${candidateId}`);
      }
    } catch (error) {
      console.error("Error locking candidate: ", error);
    }
  };

  const handleUnLockCandidate = async (candidateId) => {
    try {
      const taiKhoanCollection = collection(db, "tblTaiKhoan");
      const taiKhoanQuery = query(taiKhoanCollection, where("sMaTaiKhoan", "==", candidateId));
      const taiKhoanSnapshot = await getDocs(taiKhoanQuery);

      if (!taiKhoanSnapshot.empty) {
        const taiKhoanDocRef = taiKhoanSnapshot.docs[0].ref;
        await updateDoc(taiKhoanDocRef, {
          sTrangThai: true,
        });
        console.log(`Candidate with sMaUngVien: ${candidateId} has been unlocked.`);
        fetchCandidates();
      } else {
        console.log(`No candidate found with sMaUngVien: ${candidateId}`);
      }
    } catch (error) {
      console.error("Error unlocking candidate: ", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredCandidates.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCandidates.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Hồ sơ ứng viên
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
              {currentRecords.map((candidate, key) => (
                <tr key={key}>
                  <td className="py-3 px-5">{candidate.sMaUngVien}</td>
                  <td className="py-3 px-5">{candidate.sHoVaTen}</td>
                  <td className="py-3 px-5">
                    <img src={candidate.sAnhDaiDien} alt="Avatar" className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="py-3 px-5">{candidate.sDiaChi}</td>
                  <td className="py-3 px-5">{candidate.sChuyenNganh}</td>
                  <td className="py-3 px-5">{candidate.sSoDienThoai}</td>
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        color="blue"
                        size="sm"
                        onClick={() =>
                          navigate(`/candidate_detail/${candidate.sMaUngVien}`)
                        }
                      >
                        Xem chi tiết
                      </Button>
                      {candidate.bTrangThai ? (
                        <Button
                          variant="outlined"
                          color="red"
                          size="sm"
                          onClick={() => handleLockCandidate(candidate.sMaUngVien)}
                        >
                          Khóa
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="green"
                          size="sm"
                          onClick={() => handleUnLockCandidate(candidate.sMaUngVien)}
                        >
                          Mở khóa
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
  );
}

export default CandidateProfile;
