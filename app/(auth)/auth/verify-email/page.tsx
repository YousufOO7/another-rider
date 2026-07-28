import VerifyEmail from "@/app/components/main/auth/VerifyEmail";
import { Suspense } from "react";


const VerifyEmailPage = () => {
    return (
        <div>
        <Suspense fallback={<div className="p-10">Loading...</div>}> 
            <VerifyEmail />
        </Suspense>
        </div>
    );
};

export default VerifyEmailPage;