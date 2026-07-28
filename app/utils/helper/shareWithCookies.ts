import Cookies from "js-cookie";
import { appConfiguration } from "../constant/appConfiguration";

type CookieOptions = {
  expires?: number; // in minutes
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
};

export const shareWithCookies = (
  option: "set" | "get" | "remove",
  key: string,
  options?: CookieOptions,
  value?: string // Only allow string values for cookies
): string | undefined => {
  try {
    const defaultOptions: CookieOptions = {
      path: "/",
      secure: appConfiguration.NODE_ENV === "production",
      sameSite: "lax",
      ...options
    };

    switch (option) {
      case "set":
        if (!value) throw new Error("Value is required for set operation");
        
        const expires = options?.expires 
          ? new Date(Date.now() + options.expires * 60 * 1000)
          : undefined;

        Cookies.set(key, value, { 
          ...defaultOptions,
          expires: expires ? expires.getDate() : undefined
        });
        return value;

      case "get":
        return Cookies.get(key) || undefined;

      case "remove":
        Cookies.remove(key, { path: defaultOptions.path });
        return undefined;

      default:
        throw new Error("Invalid cookie operation");
    }
  } catch (error) {
    console.error("Cookie operation failed:", error);
    return undefined;
  }
};