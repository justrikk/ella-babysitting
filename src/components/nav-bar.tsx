import Link from "next/link";
import { auth, signOut } from "@/auth";
import { MobileMenu } from "@/components/mobile-menu";

export async function NavBar() {
  const session = await auth();

  const linkCls = "hover:text-warm-900";
  const ctaCls =
    "rounded-full bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700 text-center";

  const navItems = (
    <>
      <Link href="/sitters" className={linkCls}>
        Find a sitter
      </Link>
      {session && (
        <Link href="/dashboard" className={linkCls}>
          Dashboard
        </Link>
      )}
      {session?.user.role === "ADMIN" && (
        <Link href="/admin" className={linkCls}>
          Admin
        </Link>
      )}
      {!session && (
        <Link href="/join" className={linkCls}>
          Request access
        </Link>
      )}
      <Link href="/sitters/apply" className={ctaCls}>
        Become a sitter
      </Link>
      {session ? (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className={`${linkCls} w-full text-left`}>
            Sign out
          </button>
        </form>
      ) : (
        <Link href="/signin" className={linkCls}>
          Sign in
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-10 border-b border-warm-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-primary-700">
          Ella&apos;s Babysitting
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-warm-600 sm:flex">
          {navItems}
        </nav>
        <MobileMenu>{navItems}</MobileMenu>
      </div>
    </header>
  );
}
