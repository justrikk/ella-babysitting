export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">
        Privacy Policy
      </h1>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <strong>Draft — not reviewed legal advice.</strong> This page is a
        placeholder written for a closed, local sitting network. It has not
        been reviewed by a lawyer. Get it reviewed by a qualified
        professional before relying on it for a real launch.
      </div>

      <div className="mt-6 space-y-6 text-sm text-warm-700">
        <section>
          <h2 className="text-base font-semibold text-warm-900">
            What we collect
          </h2>
          <p className="mt-2">
            To run a safety-conscious local sitting network, we collect what
            it takes for parents and sitters to trust and reach each other:
            name, email, phone, suburb, date of birth, emergency contacts,
            and — where relevant — Working with Children Check and First Aid
            details. Sitters can also add a profile photo, bio, hourly rate,
            and weekly availability once approved.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-warm-900">
            How we use it
          </h2>
          <p className="mt-2">
            Your details are used to run the approval process, display your
            public sitter listing (where applicable), match bookings, and —
            for a sitter&apos;s emergency contacts specifically — share them
            with the parent who booked that sitter, only after the booking
            fee is paid. Emergency contacts are never shown publicly or to
            anyone else.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-warm-900">
            Payment information
          </h2>
          <p className="mt-2">
            Booking fees are processed by Square. We never see or store your
            full card details — Square handles that directly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-warm-900">
            The Sitter List Club emails
          </h2>
          <p className="mt-2">
            If you subscribe to The Sitter List Club, we&apos;ll use your
            email to send occasional news, reviews, and content. You can
            unsubscribe at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-warm-900">
            Who can see what
          </h2>
          <p className="mt-2">
            This is a closed, local network — every account is personally
            reviewed by our team before it can book or message. As noted
            above, this is a draft policy — a real data-handling and privacy
            policy for a service collecting the kind of information above
            (including information about minors) should be drafted and
            reviewed by a qualified professional before this app is relied
            upon for real bookings.
          </p>
        </section>
      </div>
    </div>
  );
}
