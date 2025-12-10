// src/app/not-found.tsx
/*
 * Not Found Page
 * This component renders a user-friendly 404 error page
 * when a requested resource cannot be found within the application.
 */
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-bold tracking-tight">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button className="font-bold px-8">Go Home</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
