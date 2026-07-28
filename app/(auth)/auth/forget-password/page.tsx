import ForgetPassword from "@/app/components/main/auth/ForgetPassword";
import { Suspense } from "react";


const ForgetPasswordForm = () => {
    return (
        <div>
            <Suspense fallback={<div className="p-10">Loading...</div>}> 
            <ForgetPassword />
            </Suspense>
        </div>
    );
};

export default ForgetPasswordForm;