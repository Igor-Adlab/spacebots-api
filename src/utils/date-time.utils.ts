import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);

export class DateTimeUtils {
  public static secondsToDurationString(seconds: number) {
    return dayjs().startOf('day').add(seconds, 'second').format('mm:ss');
  }

  public static getDayStart(date?: Date) {
    return dayjs(date).utc().startOf('day');
  }

  static getDayEnd(date?: Date) {
    return dayjs(date).utc().endOf('day');
  }
}
