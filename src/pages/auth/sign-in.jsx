import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config"; 
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      const email = e.target.email.value; 
      const password = e.target.password.value; 
  
      const accountsCollection = collection(db, "tblTaiKhoan");
      const q = query(
        accountsCollection,
        where("sEmailLienHe", "==", email),
        where("sMatKhau", "==", password),
        where("sLoaiTaiKhoan", "==", 3)
      );
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        console.log("Đăng nhập thành công!");
        navigate("/dashboard/home"); 
      } else {
        alert("Email hoặc mật khẩu không đúng, hoặc tài khoản không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Đăng nhập</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Nhập Email và mật khẩu để đăng nhập </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSignIn}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email của bạn
            </Typography>
            <Input
              size="lg"
              name="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Mật khẩu
            </Typography>
            <Input
              type="password"
              name="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                Tôi đồng ý với  
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline ml-1"
                >
                  Điều khoản & Chính sách
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button type="submit" className="mt-6" fullWidth>
            Đăng nhập
          </Button>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
