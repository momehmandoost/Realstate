"use client"
import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { MyContext } from '../layout';
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import 'react-toastify/dist/ReactToastify.css';

interface Location {
    lat: number;
    lng: number;
}

const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [38, 38]
});

export default function Create(): JSX.Element {
    const router = useRouter();

    const { id, setId, token, setToken } = useContext(MyContext);

    const [isLogin, setIsLogin] = useState<boolean>(false);

    const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        // Retrieve userId and token from local storage
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("accessToken");

        setId(id);
        setToken(token);

        if (token) {
            setIsLogin(true);
        }
    }, []);

    const handleLocationChange = (e: any) => {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:8000/lands", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    location,
                    phone,
                    address,
                    description,
                    userId: id
                }),
            });
            if (response.ok) {
                console.log("Data sent successfully");
                const notify = () => {
                    toast.success('Data sent successfully.', {
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

            } else {
                console.error("Failed to send data");
                toast.warn('Failed to send data', {
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
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    return (
        isLogin ? (

                <div className="container mx-auto ">
                    <div className="grid grid-cols-2 gap-[30px] ">
                        <div className="col-span-1 d-flex w-full ">

                            <div>
                                <label className="mb-2">Location</label>
                                <div className="w-full h-[400px]">
                                    <MapContainer center={[35.7, 51.3]} zoom={10} style={{ height: "100%" }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <LocationPicker onLocationChange={handleLocationChange} />
                                        {location.lat !== 0 && location.lng !== 0 && (
                                            <Marker position={[location.lat, location.lng]} icon={customIcon}>
                                                <Popup>
                                                    Latitude: {location.lat}<br />
                                                    Longitude: {location.lng}
                                                </Popup>
                                            </Marker>

                                        )}
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 d-flex w-full">
                            <label>Phone</label>
                            <input
                                className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2 w-full"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="col-span-1 d-flex w-full">
                            <label>Address</label>
                            <input
                                className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2 w-full"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="col-span-1 d-flex w-full">
                            <label>Description</label>
                            <input
                                className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2 w-full"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <ToastContainer />


                    <button
                        className="bg-[#1DAEFF] roounded-[14px] p-[14px] rounded-[14px] text-center mt-3 text-white font-bold mb-10"
                        onClick={handleSubmit}>Submit
                    </button>

                    <Footer />

                </div>
            ) :
            (<p className="text-center mt-20 font-bold text-[30px]">You must login first</p>)
    );
}

function LocationPicker({ onLocationChange }: { onLocationChange: (e: any) => void }): null {
    const map = useMapEvents({
        click(e) {
            onLocationChange(e);
        },
    });
    return null;
}
