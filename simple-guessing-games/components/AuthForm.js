"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const data = await apiFetch(isRegister ? "/api/register" : "/api/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem("gamehub_token", data.token);
      localStorage.setItem("gamehub_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));
      router.push("/games");
    } catch (error) {
      setMessage({ type: "bad", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap container">
      <form className="auth-card" onSubmit={submit}>
        <span className="kicker">🔐 Player access</span>
        <h1>{isRegister ? "Create your player account" : "Welcome back, player"}</h1>
        <p>
          {isRegister
            ? "Register to save your game progress and continue guessing later."
            : "Log in to resume your saved game and keep your score."}
        </p>

        {isRegister && (
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={updateField} placeholder="Your player name" required minLength={2} />
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={updateField} placeholder="At least 6 characters" required minLength={6} />
        </div>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register & Play" : "Log in & Play"}
          </button>
          <Link className="ghost-button" href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Already have an account?" : "Need an account?"}
          </Link>
        </div>
      </form>
    </div>
  );
}
