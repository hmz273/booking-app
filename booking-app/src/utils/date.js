import moment from 'moment';

export const formatDate = (date, format = 'YYYY-MM-DD') =>
  moment(date).format(format);
