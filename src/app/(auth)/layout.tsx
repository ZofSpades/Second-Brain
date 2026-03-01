import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Second Brain",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      {children}
    </div>
  );
}
