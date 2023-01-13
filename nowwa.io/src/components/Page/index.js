import React, { useEffect } from "react";
import { withRouter, useLocation } from "react-router-dom";
import { clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./Page.module.sass";
import Header from "../Header";
import Footer from "../Footer";
import Leftbar from "../Leftbar";
import Rightbar from "../Rightbar";
import Box from "@mui/material/Box";

const Page = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    clearAllBodyScrollLocks();
  }, [pathname]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Box
          className={styles.column_left}
          // sx={{ display: { xs: "none", md: "block" } }}
        >
          <Leftbar />
        </Box>
        <div className={styles.column_center}>
          <Header />
          <div className={styles.inner}>{children}</div>
          <Footer />
        </div>
        <Box
          className={styles.column_right}
          // sx={{ display: { xs: "none", md: "block" } }}
        >
          <Rightbar />
        </Box>
      </div>
    </div>
  );
};

export default withRouter(Page);
