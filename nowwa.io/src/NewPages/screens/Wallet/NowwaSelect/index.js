import React, { useState, useEffect, useRef } from "react";
import styles from "./select.module.sass";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const NowwaSelect = ({ label, startDecorator, data, type }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (setIsDropdown) setIsDropdown(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div className={styles.box} ref={wrapperRef}>
      {!!label && <div className={styles.box__label}>{label}</div>}
      <div
        className={
          type === "outlined"
            ? styles.box__select
            : styles.box__select__noborder
        }
        onClick={() => {
          setIsDropdown(!isDropdown);
        }}
      >
        {startDecorator && (
          <img
            className={styles.box__startDec}
            alt="avatar"
            src={data[selectedIndex].sd_src}
          />
        )}
        <div className={styles.box__text}>{data[selectedIndex].value}</div>
        {isDropdown ? (
          <ArrowDropUpIcon className={styles.box__endDec}></ArrowDropUpIcon>
        ) : (
          <ArrowDropDownIcon className={styles.box__endDec}></ArrowDropDownIcon>
        )}
      </div>
      {isDropdown && (
        <ul className={styles.box__dropdown}>
          {data.map((item, index) => {
            return (
              <li
                key={index}
                className={styles.box__dropdown__row}
                onClick={() => {
                  setSelectedIndex(index);
                  setIsDropdown(false);
                }}
              >
                {
                  <>
                    <img
                      alt="img"
                      src={item.sd_src}
                      className={styles.box__dropdown__row__img}
                    ></img>
                    <p>{item.value}</p>
                  </>
                }
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NowwaSelect;
