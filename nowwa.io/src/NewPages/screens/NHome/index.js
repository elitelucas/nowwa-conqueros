import React, { useEffect } from "react";
import styles from "./NHome.module.sass";
import cn from "classnames";
import { Link, NavLink } from "react-router-dom";
import Image from "../../components/Image";
import Hero from "./Hero";
import Trending from "./Trending";

const NHome = ({ }) => {
  return (
    <div className={styles.container}>
      <Hero />
      <Trending />
    </div>
  );
};

export default NHome;
