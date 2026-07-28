import { useGetConfigQuery } from "@/app/redux/features/settings/config/configApi";


export const useAppConfig = () => {
  const { data, isLoading, refetch } = useGetConfigQuery([]);

  // Correct path
  const config = data?.data?.config || {};
  const companyLogo = data?.data?.company_logo || "";

  // console.log("App Config:", config?.platform_name);

  return {
    isLoading,
    refetch,

    platformName: config?.platform_name || "",
    platformLogo: companyLogo,
    primaryColor: config?.primary_brand_color || "",
    secondaryColor: config?.secondary_brand_color || "",
  };
};