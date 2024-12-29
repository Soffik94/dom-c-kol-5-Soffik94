import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../images/logo.png";
import { useTranslation } from "react-i18next";
import { useTheme } from "../ThemeContext";
import { FaGlobe, FaSun, FaMoon } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header>
      <a href="/">
        <img src={logo} alt="" className="logo" />
      </a>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active-link" : "non-active-link"
          }
        >
          {t("shoppingLists")}
        </NavLink>
        <NavLink
          to="/archive"
          className={({ isActive }) =>
            isActive ? "active-link" : "non-active-link"
          }
        >
          {t("archive")}
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "active-link" : "non-active-link"
          }
        >
          {t("login")}
        </NavLink>

        <div className="dropdown">
          <button className="dropdown-btn">
            <FaGlobe /> <IoMdArrowDropdown />
          </button>
          <div className="dropdown-content">
            <button onClick={() => changeLanguage("en")}>English</button>
            <button onClick={() => changeLanguage("cs")}>Čeština</button>
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}{" "}
          {theme === "light" ? t("darkMode") : t("lightMode")}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
