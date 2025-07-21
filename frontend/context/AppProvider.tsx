"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import axios from "axios";
import toast from "react-hot-toast"; // Uncomment and adjust if you intend to use a toast notification library
import Cookies from "js-cookie"; // Uncomment if you need to manage cookies
import { useRouter } from "next/navigation";

interface AppProviderType {
    isLoading: boolean;
    authToken: string | null;
    login: (email:string, password:string) => Promise<void>;
    register: (name:string, email:string, password:string, password_confirmation:string) => Promise<void>;
    logout: () => void;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AppProvider =({
  children,
}: {
  children: React.ReactNode;
}) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("authToken");
        if (token) {
            setAuthToken(token);
        } else {
            router.push("/auth"); // Redirect to auth page if no token
        }
        setLoading(false); // Set loading to false after checking token
    })

    const login = async (email: string, password: string) => {
        // Implement login logic here
        console.log("Logging in with", email, password);
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { 
                email, 
                password 
            });
            if(response.data.status) {
                Cookies.set("authToken", response.data.token, { expires : 7 }); // Store token in cookies for 7 days
                toast.success("Login successful!"); // Adjust based on your toast library
                setAuthToken(response.data.token);
                router.push("/dashboard"); // Redirect to dashboard after successful login
            } else {
                toast.error("Invalid login credentials"); // Show error message
            }
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        // Implement registration logic here
        console.log("Registering with", name, email, password, password_confirmation);
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, { 
                name, 
                email, 
                password, 
                password_confirmation 
            });
            toast.success("Registration successful!"); // Adjust based on your toast library
            console.log("Registration response:", response);
        } catch (error) {
            console.error("Registration failed", error);
        } finally {
            setLoading(false);
        }
        
    };

    const logout = () => {
        setAuthToken(null);
        Cookies.remove("authToken"); // Remove token from cookies
        setLoading(false);
        toast.success("Logged out successfully!"); // Show success message
        router.push("/auth"); // Redirect to auth page after logout
    }

    return (
        <AppContext.Provider value={{ login, register, isLoading, authToken, logout }}>
            { isLoading ? <Loader /> : children }
        </AppContext.Provider>
    );
}

export const myAppHook = () => {
    const context = useContext(AppContext);

    if(!context) {
        throw new Error("myAppHook must be used within an AppProvider");
    }

    return context;
}
