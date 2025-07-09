"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "../context/authContext";

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <AntdRegistry>
      <AuthProvider>{children}</AuthProvider>
    </AntdRegistry>
  );
} 