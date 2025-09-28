import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Shop Admin</h1>
            <p className="text-muted-foreground">
              Welcome to your admin dashboard
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <p className="text-muted-foreground mb-4">
              Manage your product catalog
            </p>
            <div className="text-2xl font-bold">0</div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Orders</h3>
            <p className="text-muted-foreground mb-4">Track customer orders</p>
            <div className="text-2xl font-bold">0</div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-muted-foreground mb-4">Manage user accounts</p>
            <div className="text-2xl font-bold">1</div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Not signed in?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
