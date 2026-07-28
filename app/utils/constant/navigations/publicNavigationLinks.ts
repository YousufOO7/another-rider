import { IconType } from "react-icons"; 
import { LuListOrdered } from "react-icons/lu";

export interface INavigationLinks {
  icon?: IconType; // Change from string to IconType
  label: string; // Simplify the label to a string
  key: string;
  href: string;
}

// Main navigation links
export const publicNavigationLinks: INavigationLinks[] = [
  // {
  //   icon: LuUsers,
  //   label: "Home",
  //   key: "home",
  //   href: "/",
  // },
  {
    icon: LuListOrdered,
    label: "BOOk A RIDE",
    key: "book-a-ride",
    href: "/book-a-ride",
  },
  {
    icon: LuListOrdered,
    label: "Price Quote",
    key: "price-quote-component",
    href: "/price-quote-component",
  },
  // {
  //   icon: LuListOrdered,
  //   label: "Price Quote",
  //   key: "price-quote",
  //   href: "/price-quote",
  // },
  // {
  //   icon: LuListOrdered,
  //   label: "Quick Receipt",
  //   key: "quick-receipt",
  //   href: "/quick-receipt",
  // },
  // {
  //   icon: LuListOrdered,
  //   label: "Manage Reservation",
  //   key: "manage-reservation",
  //   href: "/manage-reservation",
  // },
  {
    icon: LuListOrdered,
    label: "Customer Profile",
    key: "/profile/my-profile",
    href: "/profile/my-profile",
  },
];
