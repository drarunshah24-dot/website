import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 mx-auto">
        <SearchX className="w-12 h-12" />
      </div>

      <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
        Page Not Found
      </h1>

      <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
        We couldn&apos;t find the page you&apos;re looking for. It might have
        been moved or doesn&apos;t exist.
      </p>

      <Button
        asChild
        size="lg"
        className="rounded-full flex items-center gap-2"
      >
        <Link href="/">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
