import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <button onClick={handleLogout} className="rounded border px-3 py-2">
      Logout
    </button>
  );
}