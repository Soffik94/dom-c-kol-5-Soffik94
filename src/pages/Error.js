import "./Error.css";
import { useTranslation } from "react-i18next";

const Error = () => {
  const { t } = useTranslation();

  return (
    <section>
      <h2>404</h2>
      <p>{t("pageNotFound")}</p>
    </section>
  );
};

export default Error;
