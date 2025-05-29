export const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return {
    local: date.toLocaleString(),
    utc: date.toUTCString()
  };
};