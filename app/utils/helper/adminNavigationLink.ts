import { ComponentType } from "react";
import { IconType } from "react-icons/lib";
import { LuContact } from "react-icons/lu";
import {
  MdListAlt,
  MdLocationCity,
  MdLocationOn,
  MdPeople,
} from "react-icons/md";

type Language = "en";

export interface INavigationLink {
  icon?: IconType | ComponentType<{ className?: string }>;
  label: Record<Language, string>;
  key: string;
  href?: string;
  subLinks?: INavigationLink[];
  subSubLinks?: INavigationLink[];
}

const admindashboardRootLinks: INavigationLink = {
  icon: LuContact,
  label: {
    en: "Dashboard",
  },
  key: "/rider-admin-portal",
  href: "/rider-admin-portal",
};

const admindashboardCustomer: INavigationLink = {
      icon: MdLocationCity, 
      label: {
        en: "Customer (CMS)",
      },
      key: "customer-management",
      href: "/rider-admin-portal/customer-management",
    
};

const admindashboardAffiliate: INavigationLink = {
      icon: MdLocationCity, 
      label: {
        en: "Affiliate & Partners",
      },
      key: "affiliate",
      href: "/rider-admin-portal/affiliate",
    
};

const adminDashboardFleet: INavigationLink = {
  icon: MdLocationOn, // Changed from MdCategory to MdLocationOn for locations
  label: {
    en: "Fleet & Staff",
  },
  key: "fleet",
  href: "/rider-admin-portal/fleet",
  subLinks: [
    {
      icon: MdLocationCity, 
      label: {
        en: "Drivers",
      },
      key: "driver-management",
      href: "/rider-admin-portal/driver-management",
    },
    {
      icon: MdListAlt, // Icon for lists
      label: {
        en: "Vehicle Classes",
      },
      key: "vehicle-classes",
      href: "/rider-admin-portal/vehicle-classes",
    },
    {
      icon: MdListAlt, // Icon for lists
      label: {
        en: "Vehicles",
      },
      key: "vehicles",
      href: "/rider-admin-portal/vehicles",
    },
    
  ],
};

const adminDashboardCompany: INavigationLink = {
  icon: MdPeople, // Changed from MdCategory to MdPeople for sellers
  label: {
    en: "Company",
  },
  key: "company",
  href: "/rider-admin-portal/company",
  subLinks: [
    {
      icon: MdListAlt, // Icon for lists
      label: {
        en: "Company List",
      },
      key: "company-management",
      href: "/rider-admin-portal/company-management",
    },
    
  ],
};



// const adminDashboardGeneralSettings: INavigationLink = {
//   icon: List,
//   label: {
//     en: "General Settings",
//   },
//   key: "general-settings",
//   href: "/rider-admin-portal",
//   subLinks: [
//     {
//       icon: List,
//       label: {
//         en: "SMS",
//       },
//       key: "otp-message",
//       href: "/rider-admin-portal/otp-message",
//       subSubLinks: [
//         {
//           icon: List,
//           label: {
//             en: "Custom Message",
//           },
//           key: "custom-message",
//           href: "/rider-admin-portal/custom-message",
//         },
//       ],
//     },
//     {
//       icon: List,
//       label: {
//         en: "Maintenance Settings",
//       },
//       key: "maintenance-settings",
//       href: "/rider-admin-portal/maintenance-settings",
//     },
//   ],
// };

const admindashboardSettings: INavigationLink = {
  icon: LuContact,
  label: {
    en: "Setting",
  },
  key: "/setting-management",
  href: "/rider-admin-portal/setting-management/setting-overview",
};

const adminDashboardPaymentAndInvoice: INavigationLink = {
  icon: MdLocationOn, 
  label: {
    en: "Finance",
  },
  key: "FINANCE",
  href: "/rider-admin-portal/FINANCE",
  subLinks: [
    {
      icon: MdLocationCity, 
      label: {
        en: "Payment & Invoice",
      },
      key: "payment-and-invoice",
      href: "/rider-admin-portal/payment-and-invoice",
    },
    {
      icon: MdLocationCity, 
      label: {
        en: "Reports & Analytics",
      },
      key: "reports-and-analytics",
      href: "/rider-admin-portal/reports-and-analytics",
    },
  ],
};


const adminDashboardBookingManagement: INavigationLink = {
  icon: MdLocationOn, 
  label: {
    en: "Bookings",
  },
  key: "booking-management",
  href: "/rider-admin-portal/booking-management",
};


export const adminNavigationLinks: INavigationLink[] = [
  { ...admindashboardRootLinks },
  { ...admindashboardCustomer },
  { ...admindashboardAffiliate },
  { ...adminDashboardBookingManagement },
  {...adminDashboardCompany},
  { ...adminDashboardFleet },
  { ...adminDashboardPaymentAndInvoice },
  { ...admindashboardSettings },
];
