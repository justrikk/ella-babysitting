import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function NavBar() {
  const session = await auth();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-violet-700">
          Ella&apos;s Babysitting
        </Link>
        <nav className="flex items-center gap-4 text-sm text-neutral-600">
          <Link href="/sitters" className="hover:text-neutral-900">
            Find a sitter
          </Link>
          {session && (
            <Link href="/dashboard" className="hover:text-neutral-900">
              Dashboard
            </Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-neutral-900">
              Admin
            </Link>
          )}
          {!session && (
            <Link href="/join" className="hover:text-neutral-900">
              Request access
            </Link>
          )}
          <Link
            href="/sitters/apply"
            className="rounded-md bg-violet-600 px-3 py-1.5 text-white hover:bg-violet-700"
          >
            Become a sitter
          </Link>
          {session ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="hover:text-neutral-900">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/signin" className="hover:text-neutral-900">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
