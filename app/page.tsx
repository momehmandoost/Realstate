"use client"
import React, {useEffect, useState} from "react";
import Link from 'next/link';
import Logo from '../public/Logo.svg';
import Image from "next/image";
import {useRouter} from 'next/navigation';
import Footer from "@/components/Footer";
import 'react-toastify/dist/ReactToastify.css';


interface Land {
    id: string;
    location: string | { lat: number; lng: number };
    phone: string;
    address: string;
    description: string;
}

const Home: React.FC = () => {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState<boolean>(false);

    const [dynamicData, setDynamicData] = useState<Land[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Adjust as needed

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/lands`, {cache: 'no-store'});
                const data = await response.json();
                setDynamicData(data);
            } catch (error) {
                console.error("Error fetching dynamic data:", error);
            }
        };
        fetchData();
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsLogin(true);
        }
    }, []);

    // Calculate indexes for current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dynamicData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto">
            <div className='flex justify-between mt-11 mb-10'>
                <Image src={Logo} alt="logo"/>
                <div>
                    {!isLogin ? (
                        <>
                            <Link href='/login'>
                                <button className="font-semibold py-2 px-10">Login</button>
                            </Link>
                            <Link href='/register'>
                                <button className="font-semibold py-2 px-10">Register</button>
                            </Link>
                        </>
                    ) : (
                        <Link href='/create'>
                            <button
                                className="border border-[#1DAEFF] border-[2px] border-solid text-[#1DAEFF] font-semibold border rounded-[14px] py-2 px-10">
                                Create
                            </button>
                        </Link>
                    )}


                </div>

            </div>

            <div className="main-banner relative mb-[103px]">
                <h1 className="absolute top-[92px] left-[89px] text-[56px] font-semibold text-[#110229] w-[490px]">Easy
                    way to find a perfect property</h1>
                <div className="absolute top-[307px] left-[89px] text-[22px] font-normal text-[#585981] w-[470px]">We
                    provide a complete service for the sale, purchase or rental of real estate.
                </div>
            </div>

            <div className="text-[38px] font-medium text-[#110229] mb-9">Recently Added</div>
            <div className="grid grid-cols-2 gap-2">
                {currentItems.length > 0 ? (
                    currentItems.map((item: Land) => (
                        <Link key={item.id} href={`/${item.id}`}>
                            <div className="col-span-1 flex w-full justify-center mb-[30px]">
                                <div
                                    className="border border-[#1DAEFF] border-[1px] border-solid p-[29px] rounded-[30px] shadow-xl w-3/4">
                                    <p><span className="font-bold">ID:</span> {item.id}</p>
                                    <p><span className="font-bold">Location:</span> {typeof item.location === 'string' ? item.location : `${item.location.lat}, ${item.location.lng}`}</p>
                                    <p><span className="font-bold">Phone:</span> {item.phone}</p>
                                    <p><span className="font-bold">Address:</span> {item.address}</p>
                                    <p className="mb-5"><span className="font-bold">Description:</span> {item.description}</p>
                                    <div className="bg-[#1DAEFF] text-white py-[7px] px-[42px] w-fit rounded-[14px] font-semibold">Show</div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="mb-8 font-bold text-[18px]">No data available.</p>
                )}
            </div>

            <ul className="flex justify-center">
                {dynamicData.length > itemsPerPage && (
                    Array.from({length: Math.ceil(dynamicData.length / itemsPerPage)}, (_, index) => (
                        <li key={index} className="bg-[#1DAEFF] text-white py-2 px-3 rounded-[14px] m-3 font-bold">
                            <button onClick={() => paginate(index + 1)} className="page-link">
                                {index + 1}
                            </button>
                        </li>
                    ))
                )}
            </ul>

            <Footer/>
        </div>
    );
};

export default Home;

