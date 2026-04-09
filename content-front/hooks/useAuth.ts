import { authService } from "@/service/authService";
import { UserLogin, UserRegister } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

function useAuthAction<T>(action: (data: T) => Promise<{ token: string}>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const execute = async (payload: T, redirectTo = "/dashboard") => {
        setLoading(true);
        setError(null);
        try {
            const { token } = await action(payload);
            document.cookie = `token=${token}; path=/; SameSite=Strict`;
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