"use client";
import React, {useEffect, useState, useContext} from "react";
import {MyContext} from "../layout";
import Modal from "../../components/Modal";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import {Icon} from "leaflet";
import {Bounce, toast, ToastContainer} from "react-toastify";
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";
import 'react-toastify/dist/ReactToastify.css';

interface Land {
    id: string;
    location: string | { lat: number; lng: number };
    phone: string;
    address: string;
    description: string;
    userId: string; // Include userId for ownership check
}

const Page: React.FC<{ params: { slug: string } }> = ({params}) => {
    const router = useRouter();

    const { id,setId,token,setToken } = useContext(MyContext);

    const [landData, setLandData] = useState<Land | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");


    useEffect(() => {

        const fetchLandData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/lands/${params.slug}`);
                const data = await response.json();
                setLandData(data);
                setLocation({lat: data.location.lat, lng: data.location.lng});
                setPhone(data.phone);
                setAddress(data.address);
                setDescription(data.description);


            } catch (error) {
                console.error("Error fetching land data:", error);
            }
        };
        fetchLandData();

        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setId(storedUserId);
        }

        const id = localStorage.getItem("userId");


        const token = localStorage.getItem("accessToken");

        setId(id);
        setToken(token);

    }, [params.slug, id]);

    if (!landData) {
        return <div>Loading...</div>;
    }

    const handleLocationChange = (e) => {
        setLocation({lat: e.latlng.lat, lng: e.latlng.lng});
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };


    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleEditConf = async () => {
        try {
            const response = await fetch(`http://localhost:8000/lands/${params.slug}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    location,
                    phone,
                    address,
                    description,
                    userId:id
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
                setTimeout(function() {
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


    const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
        iconSize: [38, 38]
    });

    const handleDeleteClickConf = async () => {
        try {
            const response = await fetch(`http://localhost:8000/lands/${params.slug}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const notify = () => {
                    toast.success('Successfully deleted', {
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

                setTimeout(function() {
                    router.push('/');
                }, 3000);
            } else {
                console.error('Failed to delete land:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting land:', error);

        }
    };

    const isCurrentUser = id === landData.userId;

      return (
        <div className="container mx-auto">
            <div className="w-full flex flex-col justify-center items-center my-20">
                <p className="text-[28px] pb-6"><span className="font-semibold text-[28px] ">ID:</span> {landData.id}</p>
                {landData.location && (
                    <p className="text-[28px] pb-6"><span className="font-semibold text-[28px]">Location:</span>{" "}
                    {typeof landData.location === "string"
                        ? landData.location
                        : `${landData.location.lat}, ${landData.location.lng}`}
                </p>
            )}
                <p className="text-[28px] pb-6"><span className="font-semibold text-[28px]">Phone:</span> {landData.phone}</p>
                <p className="text-[28px] pb-6"><span className="font-semibold text-[28px]">Address:</span> {landData.address}
                </p>
                <p className="text-[28px] pb-6"><span
                    className="font-semibold text-[28px]">Description:</span> {landData.description}</p>
                {isCurrentUser && (
                    <button className="bg-red-600 text-white px-[14px] py-[7px] rounded-[10px] mb-4" onClick={handleEditClick}>
                    Delete
                </button>
            )}
            {isEditModalOpen && (

                <Modal open={isEditModalOpen} onClose={closeEditModal}>
                    <div className="text-center w-56">
                        <div className="mx-auto my-4 w-48">
                            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this item?
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="btn btn-light w-full"
                                onClick={closeEditModal}
                            >
                                Cancel
                            </button>
                            <button className="bg-red-600 text-white px-[14px] py-[7px] rounded-[10px] " onClick={handleDeleteClickConf}>Delete</button>

                        </div>
                    </div>
                </Modal>
            )}
                {isCurrentUser && (
                    <button className="border border-[2px] border-black borer-solid px-[14px] py-[7px] rounded-[10px] font-bold" onClick={handleDeleteClick}>
                    edit
                </button>
            )}
            {isDeleteModalOpen && (

                <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
                    <div className="text-center w-full">
                        <div className="mx-auto my-4 w-full">
                            <h3 className="text-lg font-black text-gray-800 mb-[4px]">Edit Item</h3>
                            <label className="my-4 font-bold text-[16px] ">Location:</label>
                            <div className="w-full h-[400px]">
                                <MapContainer center={[35.7, 51.3]} zoom={10} style={{height: "100%"}}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationPicker onLocationChange={handleLocationChange}/>
                                    {location.lat !== 0 && location.lng !== 0 && (
                                        <Marker position={[location.lat, location.lng]} icon={customIcon}>
                                            <Popup>
                                                Latitude: {location.lat}<br/>
                                                Longitude: {location.lng}
                                            </Popup>
                                        </Marker>

                                    )}
                                </MapContainer>
                            </div>
                            <label className="my-4 font-bold text-[16px] ">Phone:</label><input onChange={(e) => setPhone(e.target.value)} value={phone} className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2 w-full" type="text"/>
                            <label className="my-4 font-bold text-[16px] ">Address:</label><input onChange={(e) => setAddress(e.target.value)} value={address} className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2 w-full" type="text"/>
                            <label className="my-4 font-bold text-[16px] ">Description:</label><input value={description} className="p-[15px] rounded-[15px] border border-[#D0D0E3] border-[2px] border-solid mb-2 w-full"
                                                             type="text"/>

                        </div>
                        <div className="flex gap-4">
                            <button
                                className="btn btn-light w-full"
                                onClick={closeEditModal}
                                onChange={(e) => setDescription(e.target.value)}
                            >
                                Cancel
                            </button>
                            <button className=" px-[14px] py-[7px] rounded-[10px] font-bold w-full" onClick={handleEditConf}>Edit</button>
                        </div>
                    </div>
                </Modal>
            )}

            </div>
            <Footer/>
            <ToastContainer/>
        </div>
    );
};

export default Page;

function LocationPicker({onLocationChange}) {
    const map = useMapEvents({
        click(e) {
            onLocationChange(e);
        },
    });
    return null;
}
