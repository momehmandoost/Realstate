"use client"
import React, {createContext, useState} from "react";
import "./globals.css";


export const MyContext = createContext({});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);

  return (
      <html lang="en">
      <body><MyContext.Provider
          value={{id, setId, token, setToken}}>{children}</MyContext.Provider></body>
      </html>
  );
}
