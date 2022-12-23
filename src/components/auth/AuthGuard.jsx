import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Api from "../../resource/api";

function AuthGuard() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  Api.$axios.interceptors.response.use(
    (res) => {
      setIsLogin(true);
      return res;
    },
    (err) => {
      err.response?.status === 401 && setIsLogin(false);
      throw err;
    }
  );

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  return <Outlet />;
}

export default AuthGuard;
