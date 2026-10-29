import { Banner } from "@/components/Banner";
import { Navbar } from "@/components/Navbar";

// Home page — composes the Navbar (top nav + theme toggle) and the Banner
// (hero section). Layout is dark by default (see root layout + globals.css).
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <Banner />
    </div>
  );
}
