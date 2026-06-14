import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { emailVerificationSchema } from "@my-bahrain/validators";

type EmailVerificationFormProps = {
  email: string;
  onCancel: () => void;
  onVerified?: () => void | Promise<void>;
};

export function EmailVerificationForm({
  email,
  onCancel,
  onVerified,
}: EmailVerificationFormProps) {
  const { signIn } = useAuthActions();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const parsed = emailVerificationSchema.safeParse({ email, code });
    if (!parsed.success) {
      setError("Enter the 8-digit code from your email");
      setLoading(false);
      return;
    }

    try {
      await signIn("password", {
        email: parsed.data.email,
        code: parsed.data.code,
        flow: "email-verification",
      });
      await onVerified?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        We sent an 8-digit verification code to <strong>{email}</strong>.
        Enter it below to continue.
      </p>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      <input
        className="w-full rounded border p-2 text-center text-lg tracking-widest"
        placeholder="12345678"
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={8}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify email"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="w-full rounded border p-2"
      >
        Back
      </button>
    </form>
  );
}
