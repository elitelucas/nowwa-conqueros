import React from "react";

const Image = ({ className, src, srcDark, srcSet, srcSetDark, alt }) => {

  return (
    <img
      className={className}
      srcSet={srcSetDark}
      src={srcDark}
      alt={alt}
    />
  );
};

export default Image;
