import clsx, { ClassValue } from "clsx";
import { ClassNameValue, twMerge } from "tailwind-merge";
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
