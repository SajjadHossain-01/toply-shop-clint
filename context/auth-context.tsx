"use client"

import useAxiosPublic from "@/hooks/AxiosPublic"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

export interface User {
    name: string;
    email: string;
    role: string;
    phone: string;
    address?: string;
    bio?: string;
    profilePic?: string;
}

interface AuthContextType {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    isLoading: boolean
    isAdmin: boolean
    login: (email: string, password: string) => Promise<User | null>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {

    const axiosPublic = useAxiosPublic()
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

   
    const logout = useCallback(() => {
        setUser(null)
        setIsAdmin(false)
        localStorage.removeItem("token")
    }, [])

   // Load user from server safely
const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token")

    if (!token) {
        setIsLoading(false)
        return
    }

    try {
        const res = await axiosPublic.get("/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (res.data) {
            setUser(res.data)
            setIsAdmin(res.data.role === "admin")
        }
    } catch (err: any) {
        console.error("Fetch user error:", err);
        // শুধুমাত্র টোকেন এক্সপায়ার বা ইনভ্যালিড (401/403) হলে লগআউট করাবে
        if (err?.response?.status === 401 || err?.response?.status === 403) {
            logout();
        }
    } finally {
        setIsLoading(false)
    }
}, [axiosPublic, logout])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const login = async (email: string, password: string) => {
        try {
            const res = await axiosPublic.post("/login", { email, password });
            const token = res.data.token;
            localStorage.setItem("token", token);

            const userRes = await axiosPublic.get("/me", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const user = userRes.data;
            setUser(user);
            setIsAdmin(user.role === "admin");

            return user;
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAdmin,
                login,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}