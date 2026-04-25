import { authService } from "@/service/authService";
import { UserLogin, UserRegister } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

function useAuthAction<T>(action: (data: T) => Promise<{ access_token: string }>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const execute = async (payload: T, redirectTo = "/dashboard") => {
        setLoading(true);
        setError(null);
        try {
            const { access_token } = await action(payload);
            
            // Save token in both localStorage and cookies
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", access_token);
                document.cookie = `auth_token=${access_token}; path=/; max-age=86400`;
            }
            router.push(redirectTo);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };
    return { execute, loading, error };
}

export const useLogin = () => useAuthAction<UserLogin>(authService.login);
export const useRegister = () => useAuthAction<UserRegister>(authService.register);