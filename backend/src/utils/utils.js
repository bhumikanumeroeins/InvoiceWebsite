// utils/utils.js

/* ---------------- STANDARD RESPONSE HELPERS ---------------- */
export const createResult = (data) => {
  return { status: "success", data };
};

export const createError = (error) => {
  return { status: "error", error };
};

/* ---------------- DATE HELPER (DD-MM-YYYY ONLY) ---------------- */
export const parseDDMMYYYY = (value) => {
  if (!value) return null;

  // strict DD-MM-YYYY
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(value)) return null;

  const [day, month, year] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  // validate real calendar date
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};
