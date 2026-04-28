"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("gamehub_user");
    if (saved) setUser(JSON.parse(saved));

    const onStorage = () => {
      const nextUser = localStorage.getItem("gamehub_user");
      setUser(nextUser ? JSON.parse(nextUser) : null);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-change", onStorage);
    };
  }, []);

  function logout() {
    localStorage.removeItem("gamehub_token");
    localStorage.removeItem("gamehub_user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Guessy Galaxy home">
          <span className="logo-badge">?</span>
          <span>Guessy Galaxy</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <Link href="/games">Games</Link>
          <Link href="/rules">Rules</Link>
          <Link href="/terms">Terms</Link>
          {user ? (
            <>
              <span className="badge">Hi, {user.name}</span>
              <button onClick={logout}>Exit</button>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/register" className="primary-button">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
