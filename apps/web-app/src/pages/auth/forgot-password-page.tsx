import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@convex/_generated/api";
import {
  passwordResetRequestSchema,
  passwordResetVerifySchema,
} from "@my-bahrain/validators";
import { homeForRole } from "../../features/auth/utils/home-for-role";

type Step = "request" | { email: string };

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const user = useQuery(api.users.queries.me);

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role) {
      navigate(homeForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  async function onRequestReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const parsed = passwordResetRequestSchema.safeParse({ email });
    if (!parsed.success) {
      setError("Enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await signIn("password", {
        email: parsed.data.email,
        flow: "reset",
      });
      setStep({ email: parsed.data.email });
      setMessage("If an account exists for that email, we sent a reset code.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset code");
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (step === "request") {
      setLoading(false);
      return;
    }

    const parsed = passwordResetVerifySchema.safeParse({
      email: step.email,
      code,
      newPassword,
    });

    if (!parsed.success) {
      setError("Enter the code and a new password of at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      await signIn("password", {
        email: parsed.data.email,
        code: parsed.data.code,
        newPassword: parsed.data.newPassword,
        flow: "reset-verification",
      });
      setMessage("Password updated. Signing you in...");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid code or password requirements not met",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Reset password</h1>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-green-700">
          {message}
        </div>
      ) : null}

      {step === "request" ? (
        <form onSubmit={onRequestReset} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter your account email and we&apos;ll send you an 8-digit reset
            code.
          </p>

          <input
            className="w-full rounded border p-2"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoCapitalize="none"
            type="email"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset code"}
          </button>
        </form>
      ) : (
        <form onSubmit={onVerifyReset} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the code sent to <strong>{step.email}</strong> and choose a
            new password.
          </p>

          <input
            className="w-full rounded border p-2"
            placeholder="8-digit code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
          />

          <input
            className="w-full rounded border p-2"
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update password"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("request");
              setCode("");
              setNewPassword("");
              setError("");
              setMessage("");
            }}
            className="w-full rounded border p-2"
          >
            Start over
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600">
        <Link to="/login" className="underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
