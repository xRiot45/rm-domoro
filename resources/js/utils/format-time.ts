export const formatTime = (time: Date | string, format: string = 'hh:mm:ss A'): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');

  let hours: number, minutes: string, seconds: string, period: string;

  if (typeof time === 'string') {
    const [h, m, s] = time.split(':').map(Number);
    hours = h;
    minutes = pad(m);
    seconds = pad(s || 0);
  } else {
    hours = time.getHours();
    minutes = pad(time.getMinutes());
    seconds = pad(time.getSeconds());
  }

  // eslint-disable-next-line prefer-const
  period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return format
    .replace('hh', pad(hours))
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('A', period);
};
