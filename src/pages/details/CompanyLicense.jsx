import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";

export function CompanyLicense() {
  const location = useLocation();
  const navigate = useNavigate();
  const { licenseUrl } = location.state || {};
  console.log("License URL:", licenseUrl);
  if (!licenseUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Typography variant="h5" color="red">
          Không tìm thấy giấy phép kinh doanh.
        </Typography>
        <Button
          variant="outlined"
          color="blue"
          size="sm"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h5" className="mb-4">
        Giấy phép kinh doanh
      </Typography>
      <div className="w-full h-[80vh] flex justify-center">
        {licenseUrl.endsWith(".pdf") ? (
          <iframe
            src={licenseUrl}
            title="Giấy phép kinh doanh"
            className="w-full h-full"
          />
        ) : (
          <img
            src={licenseUrl}
            alt="Giấy phép kinh doanh"
            className="max-w-full max-h-full"
          />
        )}
      </div>
      <Button
        variant="outlined"
        color="blue"
        size="sm"
        className="mt-4"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>
    </div>
  );
}

export default CompanyLicense;