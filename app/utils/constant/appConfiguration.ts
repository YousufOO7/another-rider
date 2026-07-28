interface IConfigurationProps {
  appName: string;
  appCode: string;
  baseUrl: string;
  favicon: string;
  logo: string;
  seoLogo?: string;
  progressMessage: string;
  version: string;
  invoiceBanner:string;
  PUBLIC_SITE_URL:string;
  NODE_ENV:string
}

const version = "V1.0.0";

//////////// BETA VERSION ////////////

export const appConfiguration: IConfigurationProps = {
  appName: "Ride System",
  NODE_ENV:"development",
  appCode: "__t_beta__",
  baseUrl: "https://dev.squarelimousine.com/api/", 
  PUBLIC_SITE_URL: "http://localhost:3000",
  favicon: "/devs.png",
  invoiceBanner:"/",
  logo: "/",
  version,
  progressMessage:
    "Thank you for your interest! 🚀 We're currently working on implementing this feature. Stay tuned, as we'll be activating it very soon!",
};

//////////// PRODUCTION VERSION ////////////
// export const appConfiguration: IConfigurationProps = {
//   appName: "Ride System",
//   NODE_ENV:"production",
//   appCode: "__Ride_production__",
//   baseUrl: "https://api.squarelimo.com/api/",
//   PUBLIC_SITE_URL: "https://kryinternational.com",
//   favicon: "/devs.png",
//   invoiceBanner:"/",
//   logo: "/",
//   version,
//   progressMessage:
//     "Thank you for your interest! 🚀 We're currently working on implementing this feature. Stay tuned, as we'll be activating it very soon!",
// };