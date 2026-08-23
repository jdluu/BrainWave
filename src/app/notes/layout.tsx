import NavBar from "./NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <NavBar />
      <main className="container flex-1 py-8 pb-24 sm:pb-8">{children}</main>
    </div>
  );
}
