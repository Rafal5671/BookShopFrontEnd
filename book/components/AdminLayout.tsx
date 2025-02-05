import { NextUIProvider } from "@nextui-org/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <div className="flex min-h-screen">
        {children}
      </div>
    </NextUIProvider>
  );
}
