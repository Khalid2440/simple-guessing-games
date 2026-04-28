"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GAMES, LEVELS, createRound, normalizeGuess } from "@/lib/games";

const STORAGE_KEY = "guessy_galaxy_progress";

const freshStats = {
  score: 0,
  wins: 0,
  played: 0,
};

export default function GameCenter() {
  const [user, setUser] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(GAMES[0].id);
  const [levelKey, setLevelKey] = useState("easy");
  const [round, setRound] = useState(null);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [usedHints, setUsedHints] = useState([]);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("Choose a game and press Play.");
  const [stats, setStats] = useState(freshStats);

  const selectedGame = useMemo(() => GAMES.find((game) => game.id === selectedGameId) || GAMES[0], [selectedGameId]);
  const isRunning = status === "playing";
  const isPaused = status === "paused";
  const isFinished = status === "won" || status === "lost";

  useEffect(() => {
    const savedUser = localStorage.getItem("gamehub_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    saveProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, attempts, usedHints, status, stats, selectedGameId, levelKey]);

  function saveProgress() {
    if (!round) return;
    const payload = { selectedGameId, levelKey, round, attempts, usedHints, status, stats };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setFeedback("No saved round yet. Press Play to begin.");
      return;
    }
    const data = JSON.parse(saved);
    setSelectedGameId(data.selectedGameId);
    setLevelKey(data.levelKey);
    setRound(data.round);
    setAttempts(data.attempts);
    setUsedHints(data.usedHints || []);
    setStatus(data.status === "paused" ? "paused" : "playing");
    setStats(data.stats || freshStats);
    setGuess("");
    setFeedback("Saved game loaded. You can resume from here.");
  }

  function startGame(nextGameId = selectedGameId, nextLevelKey = levelKey) {
    const newRound = createRound(nextGameId, nextLevelKey);
    setSelectedGameId(nextGameId);
    setLevelKey(nextLevelKey);
    setRound(newRound);
    setAttempts(0);
    setUsedHints([]);
    setGuess("");
    setStatus("playing");
    setFeedback("Game started. Make your first guess!");
  }

  function pauseGame() {
    if (!round || !isRunning) return;
    setStatus("paused");
    setFeedback("Game paused. Press Resume when you are ready.");
  }

  function resumeGame() {
    if (!round) return;
    setStatus("playing");
    setFeedback("Game resumed. Keep guessing!");
  }

  function exitGame() {
    setRound(null);
    setGuess("");
    setAttempts(0);
    setUsedHints([]);
    setStatus("idle");
    setFeedback("You exited the round. Choose a game to play again.");
    localStorage.removeItem(STORAGE_KEY);
  }

  function continueGame() {
    startGame(selectedGameId, levelKey);
  }

  function revealHint() {
    if (!round || !isRunning) return;
    const nextHint = round.hints[usedHints.length];
    if (!nextHint) {
      setFeedback("No more hints available for this round.");
      return;
    }
    setUsedHints((current) => [...current, nextHint]);
    setFeedback("A new hint has appeared.");
  }

  function submitGuess(event) {
    event.preventDefault();
    if (!round || !isRunning) return;

    const cleanGuess = normalizeGuess(guess);
    if (!cleanGuess) {
      setFeedback("Type your guess first.");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const answer = normalizeGuess(round.answer);
    if (cleanGuess === answer) {
      const level = LEVELS[levelKey];
      const bonus = Math.max(0, round.maxAttempts - nextAttempts) * 2;
      const earned = level.points + bonus;
      setStats((current) => ({
        score: current.score + earned,
        wins: current.wins + 1,
        played: current.played + 1,
      }));
      setStatus("won");
      setFeedback(`Correct! You earned ${earned} points. Press Continue for a new round.`);
      setGuess("");
      return;
    }

    if (nextAttempts >= round.maxAttempts) {
      setStats((current) => ({ ...current, played: current.played + 1 }));
      setStatus("lost");
      setFeedback(`Round over. The answer was “${round.answer}”. Press Continue to try again.`);
      setGuess("");
      return;
    }

    if (round.gameId === "number-quest") {
      const guessNumber = Number(cleanGuess);
      const answerNumber = Number(answer);
      setFeedback(guessNumber < answerNumber ? "Too low. Try a bigger number." : "Too high. Try a smaller number.");
    } else {
      setFeedback("Not quite. Use a hint or try another guess.");
    }

    setGuess("");
  }

  if (!user) {
    return (
      <main className="container dashboard">
        <div className="panel">
          <span className="kicker">🔐 Login required</span>
          <h1>Please log in or register first</h1>
          <p>You need a player account to access the game center and save progress.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/login">Log in</Link>
            <Link className="secondary-button" href="/register">Register</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container dashboard">
      <div className="section-heading">
        <div>
          <span className="kicker">🚀 Game center</span>
          <h1>Choose, play, pause, resume, and continue.</h1>
          <p>Pick a game and level. The game will show hints and save your progress in this browser.</p>
        </div>
        <button className="secondary-button" onClick={loadProgress}>Resume Saved Game</button>
      </div>

      <div className="game-shell">
        <aside className="panel sidebar">
          <h2>Games</h2>
          <div className="level-list">
            {GAMES.map((game) => (
              <button
                key={game.id}
                className={`game-pick-button ${selectedGameId === game.id ? "active" : ""}`}
                onClick={() => startGame(game.id, levelKey)}
              >
                <strong>{game.title}</strong>
                <br />
                <span>{game.subtitle}</span>
              </button>
            ))}
          </div>

          <h2 style={{ marginTop: 24 }}>Levels</h2>
          <div className="level-list">
            {Object.entries(LEVELS).map(([key, level]) => (
              <button
                key={key}
                className={`level-button ${levelKey === key ? "active" : ""}`}
                onClick={() => startGame(selectedGameId, key)}
              >
                <strong>{level.name}</strong>
                <br />
                <span>{level.description}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="panel game-stage">
          <div className="stage-top">
            <div>
              <span className="kicker">{selectedGame.title}</span>
              <h2>{round ? round.prompt : "Ready for your first round?"}</h2>
              <p>{feedback}</p>
            </div>
            <img src={selectedGame.image} alt="" style={{ width: 120, height: 120, objectFit: "contain" }} />
          </div>

          <div className="stat-grid">
            <div className="stat"><span>Score</span><strong>{stats.score}</strong></div>
            <div className="stat"><span>Wins</span><strong>{stats.wins}</strong></div>
            <div className="stat"><span>Played</span><strong>{stats.played}</strong></div>
            <div className="stat"><span>Attempts</span><strong>{round ? `${attempts}/${round.maxAttempts}` : "0/0"}</strong></div>
          </div>

          <div className="game-controls">
            <button className="primary-button" onClick={() => startGame()}>{round ? "Play New" : "Play"}</button>
            <button className="secondary-button" onClick={pauseGame} disabled={!isRunning}>Pause</button>
            <button className="secondary-button" onClick={resumeGame} disabled={!isPaused}>Resume</button>
            <button className="secondary-button" onClick={continueGame} disabled={!isFinished}>Continue</button>
            <button className="danger-button" onClick={exitGame} disabled={!round}>Exit</button>
          </div>

          {round && (
            <>
              <div className="challenge-box" style={{ marginTop: 24 }}>
                <span className="badge">Level: {LEVELS[levelKey].name}</span>
                <div className="challenge-display">{round.display}</div>
                <p>Category: {round.category}</p>

                <form onSubmit={submitGuess} className="round-actions">
                  <input
                    className="guess-input"
                    type={selectedGame.inputType}
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    placeholder={selectedGame.inputPlaceholder}
                    disabled={!isRunning}
                    aria-label="Your guess"
                    style={{ maxWidth: 360 }}
                  />
                  <button className="primary-button" type="submit" disabled={!isRunning}>Submit Guess</button>
                  <button className="secondary-button" type="button" onClick={revealHint} disabled={!isRunning}>Show Hint</button>
                </form>
              </div>

              {isPaused && <div className="paused-overlay">⏸️ This round is paused. Your progress is safe.</div>}

              <ul className="hint-list">
                {usedHints.map((hint, index) => (
                  <li key={`${hint}-${index}`}><strong>Hint {index + 1}:</strong> {hint}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
