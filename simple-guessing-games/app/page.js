import Link from "next/link";
import { GAMES } from "@/lib/games";

export default function Home() {
  return (
    <main>
      <section className="container hero">
        <div>
          <span className="kicker">✨ Friendly guessing games for everyone</span>
          <h1>Play, pause, resume, and solve fun guessing challenges.</h1>
          <p>
            Guessy Galaxy is a simple game website with number puzzles, word challenges, emoji riddles, useful hints, levels, saved progress, login, registration, rules, and terms.
          </p>
          <div className="hero-actions">
            <Link href="/games" className="primary-button">Play Now</Link>
            <Link href="/rules" className="secondary-button">Read Rules</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <img src="/images/mascot.svg" alt="Friendly game mascot" />
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="kicker">🎮 More than one game</span>
            <h2>Choose your guessing adventure</h2>
            <p>Every game includes hints and levels so both beginners and confident players can enjoy it.</p>
          </div>
        </div>
        <div className="game-grid">
          {GAMES.map((game) => (
            <article className="game-card" key={game.id}>
              <img src={game.image} alt="" />
              <h3>{game.title}</h3>
              <p>{game.subtitle}</p>
              <div className="badge-row">
                {game.tags.map((tag) => <span className="badge" key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
