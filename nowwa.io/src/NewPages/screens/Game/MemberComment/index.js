import React, { useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./my.module.sass";

const MemberComment = (props) => {
  const comments = props.data;
  return (
    <div className={styles.box}>
      <div className={styles.box__rating}>
        <StarIcon className={styles.box__rating__fill} />
        <StarIcon className={styles.box__rating__fill} />
        <StarIcon className={styles.box__rating__fill} />
        <StarIcon className={styles.box__rating__fill} />
        <StarIcon className={styles.box__rating__fill} />
      </div>
      <div className={styles.box__title}>{comments.title}</div>
      <div className={styles.box__content}>{comments.content}</div>
      <div className={styles.box__info}>
        <img src="/images/content/avatar-1.jpg" alt="Avatar" />
        <span>{comments.name}</span>
        <span>{"Posted on " + comments.date}</span>
      </div>
      <div className={styles.box__more}>
        <MoreHorizIcon />
      </div>
    </div>
  );
};

export default MemberComment;
