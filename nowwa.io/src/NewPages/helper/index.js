export const shortenString = (string, count = 10) => {
  if (string.length > count)
    return string.slice(0, count) + "...";
  else
    return string;
};

export const shortenAddress = (address, count = 4) => {
  return address.slice(0, count) + "..." + address.slice(-count);
};

export const getNameFromEmail = (username) => {
  return username.slice(0, username.search("@"));
};
