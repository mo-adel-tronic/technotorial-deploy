import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getArabicExamDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let hoursText = "";
  if (hours === 0) {
    hoursText = "";
  } else if (hours === 1) {
    hoursText = "ساعة واحدة";
  } else if (hours === 2) {
    hoursText = "ساعتان";
  } else if (hours === 3) {
    hoursText = "ثلاث ساعات";
  } else if (hours === 4) {
    hoursText = "أربع ساعات";
  } else if (hours > 4) {
    hoursText = `${hours} ساعات`;
  }

  let minutesText = "";
  if (remainingMinutes === 0) {
    minutesText = "";
  } else if (remainingMinutes === 30) {
    minutesText = "نصف";
  } else {
    minutesText = `${remainingMinutes} دقيقة`;
  }

  if (hoursText && minutesText) {
    // Special case for half hour
    if (minutesText === "نصف") {
      return `${hoursText} ونصف`;
    }
    return `${hoursText} و${minutesText}`;
  } else if (hoursText) {
    return hoursText;
  } else if (minutesText) {
    if (minutesText === "نصف") return "نصف ساعة";
    return minutesText;
  } else {
    return "٠ دقيقة";
  }
}
