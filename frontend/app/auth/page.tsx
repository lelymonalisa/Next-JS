"use client";
import React, { useState } from "react";

interface formData {
    name?: string,
    email?: string,
    password?: string,
    password_confirmation?: string
}

const Auth: React.FC = () => {

    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [formData, setFormData] = useState<formData> ({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4" style={{ width: "400px" }}>
                    {/* Login Form */}
                    <h3 className="text-center">{ isLogin ? "Login" : "Register" }</h3>
                    {/* EDITING THIS 1:30:29  */}

                    <form>

                        {
                            !isLogin && 
                            (<input 
                                className="form-control mb-2" 
                                name="name" 
                                type="text" 
                                value={ formData.name }
                                onChange={ handleOnChangeInput }
                                placeholder="Name" 
                                required />
                            )
                        }
                        
                        <input 
                            className="form-control mb-2" 
                            name="email" 
                            type="email" 
                            value={ formData.email }
                            onChange={ handleOnChangeInput }
                            placeholder="Email" 
                            required />
                        {
                            !isLogin && (<input 
                                className="form-control mb-2" 
                                name="password" 
                                type="password" 
                                value={ formData.password}
                                onChange={ handleOnChangeInput }
                                placeholder="Password" 
                                required />
                            )
                        }
                        
                        <input 
                            className="form-control mb-2" 
                            name="password_confirmation" 
                            type="password" 
                            value={ formData.password_confirmation}
                            placeholder="Confirm Password" 
                            required />
                        <button className="btn btn-primary w-100" type="submit">{ isLogin ? "Login" : "Register" }</button>
                    </form>

                    <p className="mt-3 text-center" onClick={() => setIsLogin(!isLogin)} style ={{ cursor: "pointer" }}>{ isLogin ? "Don't have an account? Register" : "Already have an account? Login" }</p>

                </div>
            </div>
        </>
    )
}

export default Auth;