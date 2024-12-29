import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./SharedLayout.css";
import { useTheme } from "../ThemeContext";

const SharedLayout = () => {
  const { theme } = useTheme();

  return (
    <>
      <Navbar />
      <main className={`main ${theme}-mode`}>
        <Outlet />
      </main>
    </>
  );
};

export default SharedLayout;
