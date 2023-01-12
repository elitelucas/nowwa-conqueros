import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
import Icon from "../Icon";
import Image from "../Image";
import Notification from "./Notification";
import User from "./User";

const nav = [
  {
    url: "/profile",
    title: "Profile",
  },
  {
    url: "/game",
    title: "Game",
  },
  {
    url: "/chat",
    title: "Chat",
  },
  {
    url: "/mint",
    title: "NFT Mint",
  },
  {
    url: "/gallery",
    title: "NFT Gallery",
  },
  {
    url: "/wallet",
    title: "Wallet",
  },
];

const Headers = () => {
  const [visibleNav, setVisibleNav] = useState(false);
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    alert("search");
  };

  const handleNews = (e) => {
    alert("news");
  };

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link className={styles.logo} to="/">
          <Image
            className={styles.pic}
            src="/images/logo-icon.png"
            srcDark="/images/logo-icon.png"
            alt="Nowwa"
          />
        </Link>
        <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>
          <nav className={styles.nav}>
            {nav.map((x, index) => (
              <Link
                className={styles.link}
                to={x.url}
                key={index}
                onClick={() => setVisibleNav(false)}
              >
                {x.title}
              </Link>
            ))}
          </nav>
          <form
            className={styles.search}
            action=""
            onSubmit={() => handleSubmit()}
          >
            <Icon className="searchicon" name="search" size="28" />
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search"
              required
            />
            <button className={styles.result}>Search</button>
          </form>
          <form className={styles.news} action="" onSubmit={() => handleNews()}>
            <div className={styles.newsicon}>
              <Icon className="searchicon" name="bulb" size="28" />
            </div>

            <button>News for you</button>
          </form>
        </div>
        <Notification className={styles.notification} />
        {/* <Link
          className={cn("button-small", styles.button)}
          to="/upload-variants"
        >
          Upload
        </Link> */}
        {/* <Link
          className={cn("button-stroke button-small", styles.button)}
          to="/connect-wallet"
        >
          Connect Wallet
        </Link> */}
        <User className={styles.user} />
        <button
          className={cn(styles.burger, { [styles.active]: visibleNav })}
          onClick={() => setVisibleNav(!visibleNav)}
        ></button>
      </div>
    </header>
  );
};

export default Headers;
