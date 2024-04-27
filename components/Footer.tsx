import Image from "next/image";
import Logo from "@/public/Logo.svg";
import React from "react";

const Footer = () => {
    return (
        <div className="flex flex-col">
            <Image className="mb-[27px]" src={Logo} alt="logo" />
            <div className="w-[410px] text-[14px] font-normal text-[#8F90A6] mb-[27px]">
                Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
            </div>
            <div className="mb-[27px] text-[14px] font-normal text-[#8F90A6] mb-[27px]">
                © 2023 . All rights reserved.
            </div>
        </div>
    );
}

export default Footer;
