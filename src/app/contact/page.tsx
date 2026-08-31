import { submitContactMessage } from "@/lib/actions";
import { TurnstileWidget } from "@/components/turnstile-widget";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please fill in your name, email, and a message.",
  captcha: "Please complete the verification check and try again.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold text-warm-900">Contact us</h1>
      <p className="mt-2 text-sm text-warm-600">
        Questions, feedback, or need a hand with something? Send our team a
        message and we&apos;ll get back to you.
      </p>

      {success && (
        <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Message sent — our team will get back to you soon.
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {ERROR_MESSAGES[error] ?? "Something went wrong — please try again."}
        </div>
      )}

      <form action={submitContactMessage} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Full name
          </label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Subject (optional)
          </label>
          <input
            type="text"
            name="subject"
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="What's this about?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            required
            className="mt-1 w-full rounded-md border border-warm-300 px-3 py-2 text-sm"
            placeholder="How can we help?"
          />
        </div>
        <TurnstileWidget />
        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
