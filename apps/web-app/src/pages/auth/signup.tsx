import { useState } from "react";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { useTrackEvent } from "../../features/analytics/hooks/use-track-event";

type Role = "customer" | "store";

export function SignupPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const createProfile = useMutation(api.users.mutations.createCurrentUserProfile);
  const trackEvent = useTrackEvent();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Signing up...");

      await signIn("password", {
        email,
        password,
        flow: "signUp",
      });

      console.log("Creating profile...");

      const userId = await createProfile({
        name,
        email,
        phone: phone || undefined,
        role,
      });

      await trackEvent("signup_completed", "user", userId, { role });

      navigate(role === "store" ? "/store" : "/customer");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-20 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <input className="w-full rounded border p-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <select className="w-full rounded border p-2" value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="customer">Customer</option>
        <option value="store">Store</option>
      </select>

      <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button type="submit" disabled={loading} className="w-full rounded bg-black p-2 text-white disabled:opacity-50">
        {loading ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}