import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Europe/Madrid';

export const formatToLocalDateTime = (date) => {
  return dayjs(date).tz(TIMEZONE).format('YYYY-MM-DDTHH:mm');
};

export const formatToUTC = (date) => {
  return dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss');
};

export const parseUTCtoLocal = (utcDate) => {
  return dayjs.utc(utcDate).tz(TIMEZONE);
};