import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-teal-800/20 bg-teal-700">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500">
            <Heart className="h-4 w-4 text-white" fill="white" />
          </div>
          <span className="font-fraunces text-xl font-semibold text-white">Small Fighters</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#campaigns" className="text-sm text-teal-100 transition-colors hover:text-white">
            Campaigns
          </Link>
          <Link href="#how-it-works" className="text-sm text-teal-100 transition-colors hover:text-white">
            How It Works
          </Link>
          <Link href="#about" className="text-sm text-teal-100 transition-colors hover:text-white">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-teal-100 transition-colors hover:text-white">
            Sign In
          </Link>
          <Button variant="coral" size="sm" asChild>
            <Link href="/fundraiser/new">Start a Fundraiser</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
