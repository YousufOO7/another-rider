
import { jwtDecode } from "jwt-decode";
import { appConfiguration } from "../constant/appConfiguration";
import { AppDispatch } from "@/app/redux/store";
import { setUser } from "@/app/redux/features/user/userSlice";
import Cookies from "js-cookie";

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  address?: string;
  avatar:string;
  phone:string;
  customer_type:string;
}

export const loadUserFromToken = async (dispatch: AppDispatch) => {
  const token = Cookies.get(`${appConfiguration.appCode}token`);

  if (token ) {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      dispatch(
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          address: decoded.address || "",
          avatar: decoded.avatar || "",
          phone: decoded.phone || "",
          customer_type: decoded.customer_type || "",
        })
      );
      return true;
    } catch (error) {
      console.error("Invalid token or error in jwt decoding", error);
      return false;
    }
  } else {
    // Dispatch an empty user object to avoid `null`
    dispatch(
      setUser({
        id: "",
        avatar: "",
        email: "",
        name: "",
        address: "",
        phone: "",
        customer_type: "",
      })
    );
    return false;
  }
};