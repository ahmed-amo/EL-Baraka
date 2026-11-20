"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "sans-serif", background: "#060B2B", color: "white", padding: "4rem" }}>
        <h1>EL BARAKA CONSEIL</h1>
        <p>Une erreur est survenue.</p>
        <button type="button" onClick={reset}>
          Réessayer
        </button>
      </body>
    </html>
  );
}
