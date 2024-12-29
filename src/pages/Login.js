import "./Login.css";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  return <div className="layout">{t("login")}</div>;
};

export default Login;
