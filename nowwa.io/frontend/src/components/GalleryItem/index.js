import React, { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./GalleryItem.module.sass";
import Icon from "../Icon";

const GalleryItem = ({ className, item, open }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className={cn(styles.card, className)} onClick={() => open()}>
      <div className={styles.preview}>
        <img 
          srcSet={`https://ipfs.io/ipfs/QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/${ Number(item.token_id) + 1 }.gif 2x`} 
          src={`https://ipfs.io/ipfs/QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/${ Number(item.token_id) + 1 }.gif`} 
          alt="Card" 
        />
        <div className={styles.control}>
          <div
            className={cn(
              { "status-green": true },
              styles.category
            )}
          >
            Token ID: {item.token_id}
          </div>
          {/* <button
            className={cn(styles.favorite, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            <Icon name="heart" size="20" />
          </button> */}
          {/* <button className={cn("button-small", styles.button)}>
            <span>Place a bid</span>
            <Icon name="scatter-up" size="16" />
          </button> */}
        </div>
      </div>
      {/* <Link className={styles.link} to={item.url}>
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.price}>{item.price}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.users}>
              {item.users.map((x, index) => (
                <div className={styles.avatar} key={index}>
                  <img src={x.avatar} alt="Avatar" />
                </div>
              ))}
            </div>
            <div className={styles.counter}>{item.counter}</div>
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.status}>
            <Icon name="candlesticks-up" size="20" />
            Highest bid <span>{item.highestBid}</span>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item.bid }}
          />
        </div>
      </Link> */}
    </div>
  );
};

export default GalleryItem;
