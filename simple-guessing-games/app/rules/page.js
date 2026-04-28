import Link from "next/link";

export default function RulesPage() {
  return (
    <main className="container section">
      <span className="kicker">📜 Rules</span>
      <h1>Game Rules</h1>
      <p>These rules are written for a friendly guessing-game website. You can edit them for your own project.</p>

      <ol className="rules-list">
        <li><strong>Start:</strong> Register or log in, open the Games page, choose a game and level, then press Play.</li>
        <li><strong>Guessing:</strong> Type your answer and press Submit Guess before your attempts run out.</li>
        <li><strong>Hints:</strong> You may use hints during a round. Hints make the game easier but the challenge is more fun when you use fewer hints.</li>
        <li><strong>Levels:</strong> Easy gives more attempts. Medium gives a balanced challenge. Hard gives fewer attempts and higher points.</li>
        <li><strong>Pause and Resume:</strong> You can pause a running round and resume it later in the same browser.</li>
        <li><strong>Continue:</strong> After winning or losing, press Continue to start another round with the same game and level.</li>
        <li><strong>Exit:</strong> Press Exit to leave the current round and clear saved round progress.</li>
        <li><strong>Fair Play:</strong> Do not use browser tools or code changes to reveal hidden answers during normal play.</li>
      </ol>

      <div className="hero-actions">
        <Link className="primary-button" href="/games">Play Games</Link>
        <Link className="secondary-button" href="/terms">View Terms</Link>
      </div>
    </main>
  );
}
