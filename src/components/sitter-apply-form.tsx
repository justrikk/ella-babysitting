"use client";

import { useState } from "react";
import Link from "next/link";
import { applyAsSitter } from "@/lib/actions";

const PARENT_CONSENT_AGE_YEARS = 16;
const WWCC_REQUIRED_AGE_YEARS = 18;

function ageFrom(dobValue: string): number | null {
  if (!dobValue) return null;
  const dob = new Date(dobValue);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDay = now.getMonth() - dob.getMonth() || now.getDate() - dob.getDate();
  if (monthDay < 0) age--;
  return age;
}

const inputCls =
  "mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm";
const labelCls = "block text-sm font-medium text-warm-700";

export function SitterApplyForm() {
  const [dob, setDob] = useState("");
  const age = ageFrom(dob);
  const needsParentConsent = age !== null && age < PARENT_CONSENT_AGE_YEARS;
  const needsWwcc = age !== null && age >= WWCC_REQUIRED_AGE_YEARS;

  return (
    <form action={applyAsSitter} className="mt-6 space-y-4">
      <div>
        <label className={labelCls}>Full name</label>
        <input type="text" name="name" required className={inputCls} placeholder="Jane Smith" />
      </div>
      <div>
        <label className={labelCls}>Email</label>
        <input type="email" name="email" required className={inputCls} placeholder="jane@example.com" />
      </div>
      <div>
        <label className={labelCls}>Phone</label>
        <input type="tel" name="phone" required className={inputCls} placeholder="04xx xxx xxx" />
      </div>
      <div>
        <label className={labelCls}>Date of birth</label>
        <input
          type="date"
          name="dateOfBirth"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Suburb</label>
        <select name="suburb" className={inputCls}>
          <option>Bundeena</option>
          <option>Maianbar</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>How does Ella know you?</label>
        <input
          type="text"
          name="note"
          className={inputCls}
          placeholder="e.g. neighbour, friend of Maya T., school parent"
        />
      </div>

      <div className="rounded-md border border-warm-200 p-3">
        <p className="text-sm font-medium text-warm-800">Emergency contact 1</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Name</label>
            <input type="text" name="emergencyContact1Name" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="tel" name="emergencyContact1Phone" required className={inputCls} />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-warm-200 p-3">
        <p className="text-sm font-medium text-warm-800">Emergency contact 2</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Name</label>
            <input type="text" name="emergencyContact2Name" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="tel" name="emergencyContact2Phone" required className={inputCls} />
          </div>
        </div>
      </div>

      {needsParentConsent && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-800">
            Parent/guardian consent (required under 16)
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name</label>
              <input
                type="text"
                name="parentGuardianName"
                required={needsParentConsent}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input
                type="tel"
                name="parentGuardianPhone"
                required={needsParentConsent}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}

      {needsWwcc && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-800">
            Working with Children Check (WWCC) — required for sitters 18+
          </p>
          <p className="mt-1 text-xs text-amber-800">
            A WWCC is mandatory in NSW for anyone 18 or over doing
            child-related work. You won&apos;t be approved until a valid
            WWCC is confirmed.{" "}
            <a
              href="https://www.service.nsw.gov.au/transaction/apply-for-a-working-with-children-check"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Apply for a WWCC
            </a>{" "}
            ·{" "}
            <a
              href="https://ocg.nsw.gov.au/working-children-check/who-needs-check"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Learn more
            </a>
          </p>
          <label className="mt-3 flex items-start gap-2 text-sm text-warm-700">
            <input
              type="checkbox"
              name="wwccConfirmed"
              required={needsWwcc}
              className="mt-1"
            />
            <span>I hold a valid Working with Children Check (WWCC).</span>
          </label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>WWCC number (optional)</label>
              <input type="text" name="wwccNumber" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Expiry date (optional)</label>
              <input type="date" name="wwccExpiry" className={inputCls} />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border border-warm-200 p-3">
        <label className="flex items-start gap-2 text-sm text-warm-700">
          <input type="checkbox" name="firstAidCertified" className="mt-1" />
          <span>
            I hold Nationally Recognised First Aid — HLTAID011 Provide First
            Aid.
          </span>
        </label>
        <div className="mt-3">
          <label className={labelCls}>Other certificates (optional)</label>
          <textarea
            name="otherCertifications"
            rows={2}
            className={inputCls}
            placeholder="Certificate name and expiry date, e.g. CPR — HLTAID009, exp. 06/2027"
          />
        </div>
      </div>

      <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
        Your bio, rate, photo, and availability aren&apos;t collected here —
        you&apos;ll set those up yourself once Ella approves your
        application.
      </div>

      <label className="flex items-start gap-2 text-sm text-warm-700">
        <input type="checkbox" name="termsAccepted" required className="mt-1" />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="text-primary-700 underline" target="_blank">
            Terms &amp; Conditions
          </Link>
          , agree to offer sitting to local Bundeena/Maianbar customers, and
          understand I can decline any specific booking.
        </span>
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        Submit application
      </button>
    </form>
  );
}
