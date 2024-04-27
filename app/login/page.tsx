"use client"
import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import { MyContext } from '../layout';
import { useRouter } from 'next/navigation';
import Logo from '@/public/Logo.svg';
import Image from "next/image";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
    const router = useRouter();
    const { setId, setToken } = useContext(MyContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setId(data.user.id);
            setToken(data.accessToken);

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('userId', data.user.id);

            const notify = () => {
                toast.success('Logged in successfully.', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            };

            notify();
            setTimeout(function () {
                router.push('/');
            }, 3000);
        } catch (error) {
            const notify = () => {
                toast.warn(`${error}`, {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            };

            notify();
            console.error('There was a problem with the login:', error);
        }
    };

    return (
        <div className="container mx-auto h-lvh">
            <div className="flex flex-col justify-center items-center h-lvh">
                <div><Image className="mb-5" src={Logo} alt="Logo" /></div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col w-full">
                        <div className="w-full grid">
                            <label className="mb-2">Email</label>
                            <input
                                className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2 w-full"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Email"
                            />
                        </div>
                        <div className="w-full grid">
                            <label className="mb-2">Password</label>
                            <input
                                className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Password"
                            />
                        </div>
                        <input type="submit"
                               className="bg-[#1DAEFF] roounded-[14px] p-[14px] rounded-[14px] text-center mt-3 text-white font-bold"
                               value="Login"/>
                    </div>
                </form>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Login;
