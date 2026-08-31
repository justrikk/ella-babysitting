export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-warm-900">
        Terms &amp; Conditions
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
            Service description
          </h2>
          <p className="mt-2">
            Sitter Sisters connects parents and sitters who are part
            of a small, local network — everyone who joins is known to Ella
            or vouched for by someone she knows. It is not an open
            marketplace, and it does not run formal background checks; trust
            is based on Ella&apos;s personal approval of every account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-warm-900">
            Local-only commitment
          </h2>
          <p className="mt-2">
            Sitters who sign up agree to offer their services to families in
            Bundeena and Maianbar through this app.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-warm-900">
            Right to decline
          </h2>
          <p className="mt-2">
            Sitters are never obligated to accept any specific booking
            request. Accepting a booking is always the sitter&apos;s choice.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-warm-900">
            Liability
          </h2>
          <p className="mt-2">
            Sitter Sisters facilitates introductions between parents
            and sitters but is not itself a childcare provider or employer of
            sitters. As noted above, this is a draft disclaimer — a real
            liability policy for a service handling childcare and payments
            should be drafted and reviewed by a qualified professional
            before this app is relied upon for real bookings.
          </p>
        </section>
      </div>
    </div>
  );
}
