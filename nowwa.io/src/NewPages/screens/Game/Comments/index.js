import React, { useState, useEffect } from "react";
import CommentIcon from "@mui/icons-material/Comment";
import styles from "./my.module.sass";
import cn from "classnames";
import MemberComment from "../MemberComment";

const navLinks = ["Newest", "Friends", "TopPlayers"];
const comments = [
  {
    startCount: 5,
    title: "Nearly Perfect Gameplay",
    content:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis ",
    avatar: "/images/content/avatar-4.jpg",
    name: "Smith99",
    date: "26/09/2022",
  },
  {
    startCount: 5,
    title: "Nearly Perfect Gameplay",
    content:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis ",
    avatar: "/images/content/avatar-4.jpg",
    name: "Smith99",
    date: "26/09/2022",
  },
  {
    startCount: 5,
    title: "Nearly Perfect Gameplay",
    content:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis ",
    avatar: "/images/content/avatar-4.jpg",
    name: "Smith99",
    date: "26/09/2022",
  },
];

const Comments = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.subtitle}>MEMBER COMMENTS</p>
      <div className={styles.heading_wrapper}>
        <h1 className={styles.heading}>#ClashofClans</h1>
        {isMobile ? (
          <div className={styles.leavebutton}>
            <CommentIcon></CommentIcon>
          </div>
        ) : (
          <div className={styles.leavebutton}>Leave a Comment</div>
        )}
      </div>
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          {navLinks.map((x, index) => (
            <button
              className={cn(styles.link, {
                [styles.active]: index === activeIndex,
              })}
              key={index}
              onClick={() => setActiveIndex(index)}
            >
              {x}
            </button>
          ))}
        </div>
        {comments.map((comment, index) => {
          return <MemberComment key={index} data={comment} />;
        })}
      </div>
    </div>
  );
};

export default Comments;
