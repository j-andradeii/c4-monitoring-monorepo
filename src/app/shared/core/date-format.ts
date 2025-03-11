import { DatePipe } from "@angular/common";


export class GWCFormatDate {

  static getCurrentFormattedDateTime(): string {
    const date = new Date();
    const pad = (n: number) => n < 10 ? '0' + n : n;

    const month = pad(date.getMonth() + 1); // getMonth() is zero-based
    const day = pad(date.getDate());
    const year = date.getFullYear();
    const hours = pad(date.getHours()); // 24-hour format
    const minutes = pad(date.getMinutes());

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  static currentDatePlus1Year(): string {
    const _currentDate = new Date();
    return GWCFormatDate.formatYear(new Date(_currentDate.setFullYear(_currentDate.getFullYear() + 1)));
  }

  static parseAUSDate(dateStr: string):Date {
    const parts = dateStr.split('/');
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Expected dd/mm/yyyy');
    }
    
    // Note: months are 0-indexed in JavaScript Date (0 = January, 1 = February, ...)
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(`${month}/${day}/${year}`);
  }

  static parseAUSDateTime(dateStr: string, timeStr: string):Date {
      // Split date and time components
      const dateTimeStr = `${dateStr} ${timeStr}`
      const [datePart, timePart] = dateTimeStr.split(' ');
      if (!datePart || !timePart) {
        throw new Error('Invalid date-time format. Expected dd/mm/yyyy hh:mmAM/PM');
      }

      // Parse the date part
      const [day, month, year] = datePart.split('/').map(num => parseInt(num, 10));
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error('Invalid date format. Expected dd/mm/yyyy');
      }

      // Parse the time part
      const [time, modifier] = timePart.split(/(AM|PM)/i);
      let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error('Invalid time format. Expected hh:mmAM/PM');
      }

      // Adjust hours for 12-hour clock
      if (modifier.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }

      // Create the date object
      return new Date(year, month - 1, day, hours, minutes);
  }

  static formatUTC_TO_CURRENT_DateTime(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();
    let seconds = '' + date.getSeconds();
  
    // Add leading zeros if needed
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;
  
    // Combine date and time parts
    return [year, month, day].join('-') + ' ' + [hours, minutes].join(':');
  }

  static formatYear(date: Date): string {
    return  date.getFullYear().toString();
  }

  static formatDate(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  static formatSlashDateWithTime(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();

    let hours = date.getHours();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    let minutes = date.getMinutes();
    const year = date.getFullYear();

    // Add leading zero to month and day if necessary
    month = month.length < 2 ? '0' + month : month;
    day = day.length < 2 ? '0' + day : day;

    // Ensure hours and minutes are formatted as strings with leading zeros for final display
    const formattedHours = hours < 10 ? '0' + hours : '' + hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : '' + minutes;

    return [day, month, year].join('/') + ' ' + [formattedHours, formattedMinutes].join(':') + ' ' + amOrPm;
  }

  static formatTime(date: Date): string {
    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    return [hours, minutes].join(':');
  }

  static formatUSDateFormat(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();

    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();

    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    const amOrPm = date.getHours() >= 12 ? 'PM' : 'AM';

    return [month, day, year].join('/');
  }

  static formatAUSDateFormat(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();

    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();

    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    const amOrPm = date.getHours() >= 12 ? 'PM' : 'AM';

    return [day, month, year].join('/');
  }

  static formatDateMonthYear(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const shortYear = year.toString().substring(2);
    return [month, shortYear].join('/');
  }

  static formatDateFromString(dateString: string): string {
    if (dateString) {
      const date = new Date(dateString);
      return GWCFormatDate.formatDate(date);
    } else {
      return '';
    }
  }

  static generateMaximumDate(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return this.formatDate(d);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getSeconds(dateTime: any): number {
    const date = new Date(new Date(dateTime).getTime());
    return ((date.getHours() * 60 * 60) + (date.getMinutes() * 60));
  }

  static fromSecondsToDate(seconds: number): Date {
    return new Date((seconds * 1000) + (new Date().getTimezoneOffset() * 60 * 1000));
  }

  // static fromSecondsToHhMMString(seconds: number): string {
  //   const utcDate = new Date(seconds * 1000).toISOString();
  //   const utcTime = utcDate.split('T');
  //   return Time.fromString(utcTime[1].slice(0, -5)).convertToHhMmString();
  // }

  static diffInMonths(startDate: Date, endDate: Date): number {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    const days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    return totalMonths === 0 ? 1 : totalMonths;
  }

  static getUTCTime(): string {
    const now = new Date();
    const utcDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(utcDate, 'dd/MM/yyyy HH:mm') || '';
  }

  static getUtcMillis(): number {
    const now = new Date();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
  }
  // static diffInDays(startDate: Date, endDate: Date): number {
  //   const momentStartDate = moment(startDate);
  //   const mommentEndDate = moment(endDate);
  //   return mommentEndDate.diff(momentStartDate, 'days');
  // }
}
