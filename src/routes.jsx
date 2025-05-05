import {
  TableCellsIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, ApprovedJob, CompanyProfile, CandidateProfile } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { InterviewSchedule } from "./pages/manager/InterviewSchedule";
import LockedJob from "./pages/dashboard/LockedJob";
import ExpiredJob from "./pages/dashboard/ExpiredJob";
import { Feedbacks } from "./pages/manager";
import { PrivacyOfPolicy } from "./pages/manager/PrivacyOfPolicy";
import { CompanyDetail } from "@/pages/details/CompanyDetail";
import JobDetail from "./pages/details/JobDetail";
import CandidateDetail from "./pages/details/CandidateDetail";
import { ReportApply, ReportJob, ReportUser } from "./pages/report";
import CompanyLicense from "./pages/details/CompanyLicense";
import { ServerStackIcon } from "@heroicons/react/24/outline";
import ProtectedRoute from "./components/ProtectedRoute";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  // {
  //   title: "auth pages",
  //   layout: "auth", // Layout riêng cho trang đăng nhập
  //   pages: [
  //     {
  //       icon: <UserCircleIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //   ],
  // },
  {
    title: "Quản lý hồ sơ",
    layout: "dashboard",
    pages: [
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "dashboard",
      //   path: "/home",
      //   element: <Home />,
      // },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Hồ sơ doanh nghiệp",
        path: "/company_profile",
        element: (
            <CompanyProfile />
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Hồ sơ ứng viên",
        path: "/candidate_profile",
        element: (
            <CandidateProfile />
        ),
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
    ],
  },
  {
    title: "Quản lý tin tuyển dụng",
    layout: "dashboard",
    pages: [
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Tin đã duyệt",
        path: "/job_approved",
        element: (
            <ApprovedJob />
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Tin Bị Khóa",
        path: "/job_locked",
        element: (
            <LockedJob />
        )
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Tin Đã Đóng",
        path: "/job_expired",
        element: (
            <ExpiredJob />
        )
      },
    ],
  },
  {
    title: "Quản lý lịch hẹn phỏng vấn",
    layout: "manager",
    pages: [
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Lịch hẹn phỏng vấn",
        path: "/interview_schedule",
        element: (
            <InterviewSchedule />
        )
      },
    ],
  },
  {
    title: "Quản lý phản hồi",
    layout: "manager",
    pages: [
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Phản hồi",
        path: "/feedback",
        element: (
            <Feedbacks />
        )
      },
    ],
  },
  {
    title: "Quản lý chính sách",
    layout: "manager",
    pages: [
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Chính sách",
        path: "/privacy",
        element: (
            <PrivacyOfPolicy />
        )
      },
    ],
  },
  {
    title: "Quản lý thống kê",
    layout: "manager",
    pages: [
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Thống kê người dùng",
        path: "/report_user",
        element: (
            <ReportUser />
        )
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Thống kê tin tuyển dụng",
        path: "/report_job",
        element: (
            <ReportJob />
        )
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Thống kê đơn ứng tuyển",
        path: "/report_apply",
        element: (
            <ReportApply />
        )
      },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <UserCircleIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     // {
  //     //   icon: <UserCircleIcon {...icon} />,
  //     //   name: "sign up",
  //     //   path: "/sign-up",
  //     //   element: <SignUp />,
  //     // },
  //   ],
  // },
];

export const additionalRoutes = [
  {
    name: "Chi tiết doanh nghiệp",
    path: "/company_profile/:companyId",
    element: <CompanyDetail />,
  },
  {
    name: "Chi tiết công việc",
    path: "/job_detail/:jobId",
    element: <JobDetail />,
  },
  {
    name: "Chi tiết ứng viên",
    path: "/candidate_detail/:candidateId",
    element: <CandidateDetail />,
  },
  {
    name: "Giấy phép kinh doanh",
    path: "/company_license",
    element: <CompanyLicense />,
  },
        {
        name: "sign in",
        path: "/auth/sign-in",
        element: <SignIn />,
      },
];
export default routes;
