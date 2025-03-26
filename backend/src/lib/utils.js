import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "120d",
  });

  return token;
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// used this one specifically in cron job
export const getStartOfDayInUserTimezoneUTC = (utcDate, timezone) => {
  const userDate = new Date(
    utcDate.toLocaleString("en-US", { timeZone: timezone })
  );
  return new Date(
    userDate.getFullYear(),
    userDate.getMonth(),
    userDate.getDate()
  );
};

// used this in the controller
export const getStartOfDayInUserTimezone = (date, timezone) => {
  const userDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );
  return new Date(
    userDate.getFullYear(),
    userDate.getMonth(),
    userDate.getDate()
  );
};
