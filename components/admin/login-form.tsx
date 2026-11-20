"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DotButton } from "@/components/site/dot-button";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });
    setPending(false);
    if (!response.ok) {
      setError(response.status === 429 ? "Trop de tentatives." : response.status === 503 ? "Base de données indisponible." : "Identifiants incorrects.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="email">
        E-mail
        <input id="email" name="email" type="email" required autoComplete="username" />
      </label>
      <label htmlFor="password">
        Mot de passe
        <input id="password" name="password" type="password" required minLength={8} autoComplete="current-password" />
      </label>
      {error ? <p className="err">{error}</p> : null}
      <DotButton type="submit" disabled={pending}>
        {pending ? "Connexion…" : "Entrer"}
      </DotButton>
    </form>
  );
}
