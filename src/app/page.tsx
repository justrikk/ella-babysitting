import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getAllSitters, getAvailableDaysOfWeek } from "@/lib/sitters";
import { SitterCard } from "@/components/sitter-card";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import {
  IconSearch,
  IconShieldCheck,
  IconCalendarHeart,
  IconLeaf,
  IconClock,
  IconLock,
} from "@/components/icons";

const steps = [
  {
    icon: IconSearch,
    title: "Search Availability",
    body: "To get started, search availability for a Sitter Sister.",
  },
  {
    icon: IconCalendarHeart,
    title: "Connect",
    body: "Get connected with our team and confirm availability.",
  },
  {
    icon: IconShieldCheck,
    title: "Confirm",
    body: "Check references, and hire the Sitter Sister that works for you.",
  },
];

const trustPoints = [
  {
    icon: IconShieldCheck,
    title: "Approved by a real person",
    body: "Every account is personally reviewed by our team before it can book or message — not an algorithm.",
  },
  {
    icon: IconLeaf,
    title: "Kept genuinely local",
    body: "Bundeena & Maianbar only. Sitters and families are people our team already knows, or who are vouched for.",
  },
  {
    icon: IconClock,
    title: "No lock-in, ever",
    body: "Browse and request access any time. Nothing to sign up for just to see who's around.",
  },
  {
    icon: IconSearch,
    title: "You choose, always",
    body: "We never assign a sitter to you. Browse profiles, compare availability, and pick who feels right for your family.",
  },
];

const approvalStandard = [
  {
    icon: IconShieldCheck,
    title: "Personally reviewed",
    body: "Every sitter's application is reviewed by our team before they're listed — not an automated approval.",
  },
  {
    icon: IconSearch,
    title: "Safety details on every profile",
    body: "Working with Children Check and First Aid status are shown on each sitter's profile, so you can check before you choose.",
  },
  {
    icon: IconCalendarHeart,
    title: "You decide, not us",
    body: "We don't rank or push specific sitters — every approved profile is presented the same way. The choice is entirely yours.",
  },
];

const goodToKnow = [
  {
    icon: IconSearch,
    title: "Search by date & time",
    body: "See who's actually free before you request — availability is based on each sitter's real weekly schedule, not just a listing.",
  },
  {
    icon: IconShieldCheck,
    title: "WWCC & First Aid on file",
    body: "Sitters 18 and over hold a valid Working with Children Check, and many are Nationally Recognised First Aid certified — visible on their profile.",
  },
  {
    icon: IconLock,
    title: "A small booking fee, paid directly to your sitter",
    body: "At the time of booking, a small non-refundable $4.95 booking fee is charged — this helps bring Sitter Sisters to the local community. Payment for your sitter's time is then made directly to them on the day.",
  },
  {
    icon: IconCalendarHeart,
    title: "Meet first, book with confidence",
    body: "A short meet-and-greet before the first booking helps kids feel comfortable with a new sitter from day one.",
  },
];

export default async function Home() {
  // Anyone can browse — approval only gates booking/messaging, not viewing.
  const [session, sitters, availableDaysOfWeek] = await Promise.all([
    auth(),
    getAllSitters(),
    getAvailableDaysOfWeek(),
  ]);
  const approved = sitters.filter((s) => s.approvalStatus === "APPROVED");
  // Sitters and admins already have a listing — the "become a sitter" pitch
  // is only relevant to guests and parent accounts.
  const showBecomeSitterCta = !session || session.user.role === "PARENT";

  return (
    <div className="flex flex-col flex-1">
      <section className="relative flex min-h-[560px] items-center overflow-hidden sm:min-h-[680px]">
        <Image
          src="/images/hero-beach.jpg"
          alt="A child looking out at the water in Bundeena"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/92 via-primary-900/55 to-primary-900/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-5xl px-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-white uppercase backdrop-blur-sm">
              Bundeena &amp; Maianbar
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Choose the sitter who feels right for your family.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">
              Browse personally approved local babysitters, learn about their
              experience and availability, and choose who you&apos;d feel
              comfortable welcoming into your home.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sitters"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg shadow-black/20 transition hover:bg-primary-50"
              >
                Browse Sitters
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                How Sitter Sisters Works
              </Link>
            </div>
            <p className="mt-6 text-xs font-medium tracking-wide text-white/75 sm:text-sm">
              Personally approved &middot; Local sitters &middot; You choose
              &middot; Private &amp; secure
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-warm-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center">
          <h2 className="text-2xl font-semibold text-warm-900">
            Your family. Your choice.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-warm-600">
            We don&apos;t assign you a babysitter. Browse our approved local
            sitters, compare their profiles and availability, and choose the
            person who feels right for your family.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12">
        <h2 className="mb-4 text-lg font-semibold text-warm-900">
          Featured local sitters
        </h2>
        {approved.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((sitter) => (
              <SitterCard key={sitter.id} sitter={sitter} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-warm-300 bg-warm-50 p-6 text-center text-sm text-warm-500">
            No approved sitters yet — check back soon, or{" "}
            <Link href="/sitters/apply" className="text-primary-700 underline">
              apply to be one
            </Link>
            .
          </p>
        )}
      </section>

      <section className="border-t border-warm-200 bg-warm-50">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-lg font-semibold text-warm-900">
            Why families choose Sitter Sisters
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-warm-200 bg-white p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <point.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-medium text-warm-900">{point.title}</p>
                <p className="mt-1 text-sm text-warm-600">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-warm-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-lg font-semibold text-warm-900">
            The Sitter Sisters approval standard
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-warm-600">
            Sitter Sisters builds the trusted pool. You make the final choice.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {approvalStandard.map((point) => (
              <div key={point.title} className="text-center sm:text-left">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700 sm:mx-0">
                  <point.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-medium text-warm-900">{point.title}</p>
                <p className="mt-1 text-sm text-warm-600">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-warm-200 bg-warm-50">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-lg font-semibold text-warm-900">
            Find a Sitter in 3 easy steps
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center sm:text-left">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700 sm:mx-0">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-semibold text-primary-600">
                  Step {i + 1}
                </p>
                <p className="mt-1 font-medium text-warm-900">{step.title}</p>
                <p className="mt-1 text-sm text-warm-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-warm-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-center text-lg font-semibold text-warm-900">
            Check availability at a glance
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-warm-600">
            See which dates over the next two months have a Sitter Sister
            free, and jump straight into a search.
          </p>
          <div className="mt-8">
            <AvailabilityCalendar availableDaysOfWeek={availableDaysOfWeek} />
          </div>
        </div>
      </section>

      <section className="border-t border-warm-200 bg-warm-50">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-14 sm:grid-cols-2">
          <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72">
            <Image
              src="/images/local-waves.jpg"
              alt="Waves rolling onto the beach at sunrise"
              fill
              className="object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-warm-900">Good to know</h2>
            <div className="mt-6 grid gap-4">
              {goodToKnow.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-warm-900">{item.title}</p>
                    <p className="mt-0.5 text-sm text-warm-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex h-72 items-center overflow-hidden sm:h-80">
        <Image
          src="/images/local-bay.jpg"
          alt="Golden-hour view over the bay at Bundeena"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary-900/60" />
        <div className="relative mx-auto w-full max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Ready to choose your Sitter Sister?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/85 sm:text-base">
            Browse approved local sitters and find the right fit for your
            family.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            <Link
              href="/sitters"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 shadow-lg shadow-black/20 transition hover:bg-primary-50"
            >
              Find Your Sitter
            </Link>
            {showBecomeSitterCta && (
              <Link
                href="/sitters/apply"
                className="text-xs text-white/80 underline underline-offset-2 hover:text-white"
              >
                Are you a local sitter? Apply to join our team.
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
