import dayjs from "dayjs";

export const formatFirestoreDate = (firestoreDate) => {
  if (firestoreDate?._seconds) {
    return dayjs(firestoreDate._seconds * 1000).format("DD/MM/YYYY");
  }
  if (typeof firestoreDate === "string") {
    return dayjs(firestoreDate).format("DD/MM/YYYY");
  }
  return firestoreDate || "-";
};

export const isFirestoreDateOverdue = (firestoreDate) => {
  if (firestoreDate?._seconds) {
    return dayjs(firestoreDate._seconds * 1000).isBefore(dayjs(), "day");
  }
  return false;
};
