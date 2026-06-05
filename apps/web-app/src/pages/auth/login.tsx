import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@convex/_generated/api";
import type { UserRole } from "@my-bahrain/types";

function homeForRole(role: UserRole): string {
  if (role === "backoffice") {
    return "/backoffice";
  }

  if (role === "store") {
    return "/store";
  }

  return "/customer";
}

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const user = useQuery(api.users.queries.me);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role) {
      navigate(homeForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-20 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <input
        className="w-full rounded border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoCapitalize="none"
        type="email"
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Login"}
      </button>

      <p className="text-center text-sm text-gray-600">
        No account?{" "}
        <Link to="/signup" className="underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
