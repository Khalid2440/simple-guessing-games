import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="container section">
      <span className="kicker">⚖️ Terms & Conditions</span>
      <h1>Terms and Conditions</h1>
      <p>This is a starter template for a simple game website. Review it with a legal professional before using it for a public business.</p>

      <ol className="terms-list">
        <li><strong>Purpose:</strong> Guessy Galaxy is a casual entertainment and learning game website.</li>
        <li><strong>Accounts:</strong> Players should provide accurate registration information and keep their password private.</li>
        <li><strong>Age:</strong> Young players should use the website with permission from a parent, guardian, or teacher.</li>
        <li><strong>Data:</strong> This starter project stores basic account information and hashed passwords in a local SQLite database.</li>
        <li><strong>Game Progress:</strong> Scores and saved rounds may be stored in the browser. Clearing browser data may remove progress.</li>
        <li><strong>Acceptable Use:</strong> Players must not attack, copy, damage, or misuse the website or its backend API.</li>
        <li><strong>No Guarantee:</strong> This template is provided as-is. You should test, secure, and customize it before production use.</li>
        <li><strong>Changes:</strong> The website owner may update rules, features, and terms when needed.</li>
      </ol>

      <div className="hero-actions">
        <Link className="primary-button" href="/register">Register</Link>
        <Link className="secondary-button" href="/games">Back to Games</Link>
      </div>
    </main>
  );
}
