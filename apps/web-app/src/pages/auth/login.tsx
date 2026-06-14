import { useEffect, useState } from "react";
import { useConvex, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { getAuthErrorMessage } from "../../features/auth/utils/get-auth-error-message";
import { homeForRole } from "../../features/auth/utils/home-for-role";

export function LoginPage() {
  const navigate = useNavigate();
  const convex = useConvex();
  const { signIn } = useAuthActions();
  const user = useQuery(api.users.queries.me);
  const demoAccess = useQuery(api.demo.queries.getPublicDemoAccess);

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
      setError(getAuthErrorMessage(err, "Login failed"));
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
        <Link to="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </p>

      <p className="text-center text-sm text-gray-600">
        No account?{" "}
        <Link to="/signup" className="underline">
          Sign up
        </Link>
      </p>

      {demoAccess?.enabled ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Demo store:</strong> {demoAccess.email} / {demoAccess.password}
          <div className="mt-1 text-xs">Changes may be reset periodically.</div>
        </div>
      ) : null}
    </form>
  );
}
