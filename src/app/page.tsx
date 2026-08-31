import Link from "next/link";
import Image from "next/image";
import { getAllSitters } from "@/lib/sitters";
import { SitterCard } from "@/components/sitter-card";
import {
  IconSearch,
  IconShieldCheck,
  IconCalendarHeart,
  IconLeaf,
  IconClock,
  IconWaves,
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
];

const goodToKnow = [
  {
    icon: IconWaves,
    title: "Right on the National Park",
    body: "Bundeena & Maianbar sit at the edge of Royal National Park — plenty of beach and bush for sitters to explore with kids.",
  },
  {
    icon: IconCalendarHeart,
    title: "Meet first, book second",
    body: "A short meet-and-greet before the first booking helps kids feel comfortable faster with a new sitter.",
  },
  {
    icon: IconShieldCheck,
    title: "Hand over the essentials",
    body: "Allergies, bedtime routine and an emergency contact — sharing these upfront makes every booking smoother.",
  },
  {
    icon: IconLeaf,
    title: "Ferry-only living",
    body: "Maianbar has no road access — it's ferry or a walk through the park, which is part of why everyone here tends to know everyone.",
  },
];

export default async function Home() {
  // Anyone can browse — approval only gates booking/messaging, not viewing.
  const sitters = await getAllSitters();
  const approved = sitters.filter((s) => s.approvalStatus === "APPROVED");

  return (
    <div className="flex flex-col flex-1">
      <section className="border-b border-warm-200 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold tracking-wide text-primary-700 uppercase">
              Bundeena &amp; Maianbar
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-warm-900 sm:text-4xl">
              Local Babysitting you can trust
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-warm-600 sm:mx-0">
              Every parent and sitter is personally approved by the Sitter
              Sisters Team before they can book or message. Browse
              who&apos;s available, then request to book — easy.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
              <Link
                href="/sitters"
                className="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
              >
                Find a sitter
              </Link>
              <Link
                href="/sitters/apply"
                className="rounded-full border border-warm-300 px-5 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-50"
              >
                Become a sitter
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm overflow-hidden rounded-full bg-primary-100 sm:block">
            <Image
              src="/images/hero-beach.jpg"
              alt="A child looking out at the water in Bundeena"
              fill
              className="object-cover"
              sizes="(min-width: 640px) 384px, 0px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="border-b border-warm-200">
        <div className="relative h-56 w-full sm:h-72">
          <Image
            src="/images/local-bay.jpg"
            alt="Golden-hour view over the bay at Bundeena"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-warm-800 uppercase">
            Bundeena &amp; Maianbar
          </span>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12">
        <h2 className="mb-4 text-lg font-semibold text-warm-900">
          Meet Sitter Sister near you
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

      <section className="border-t border-warm-200 bg-white">
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

      <section className="border-t border-warm-200 bg-warm-50">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-lg font-semibold text-warm-900">
            Why families trust Sitter Sisters
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
    </div>
  );
}
