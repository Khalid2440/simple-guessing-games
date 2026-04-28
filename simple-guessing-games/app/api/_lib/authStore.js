import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "backend", "data");
const dataFile = path.join(dataDir, "gamehub.json");

function emptyStore() {
  return {
    users: [],
    tokens: [],
    lastUserId: 0,
  };
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(emptyStore(), null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      tokens: Array.isArray(parsed.tokens) ? parsed.tokens : [],
      lastUserId: Number.isInteger(parsed.lastUserId) ? parsed.lastUserId : 0,
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store) {
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash).split(":");
  if (!salt || !hash) return false;

  const derived = scryptSync(password, salt, 64);
  const saved = Buffer.from(hash, "hex");
  if (saved.length !== derived.length) return false;
  return timingSafeEqual(saved, derived);
}

function publicUser(user) {
  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
  };
}

export async function registerUser({ name, email, password }) {
  const store = await readStore();
  const normalizedEmail = String(email).toLowerCase().trim();

  const exists = store.users.some((user) => user.email === normalizedEmail);
  if (exists) {
    return { ok: false, status: 409, message: "This email is already registered." };
  }

  const nextId = store.lastUserId + 1;
  const user = {
    id: nextId,
    name,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const token = randomBytes(32).toString("hex");
  store.users.push(user);
  store.tokens.push({ token, userId: nextId, createdAt: new Date().toISOString() });
  store.lastUserId = nextId;

  await writeStore(store);

  return { ok: true, status: 201, user: publicUser(user), token };
}

export async function loginUser({ email, password }) {
  const store = await readStore();
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = store.users.find((candidate) => candidate.email === normalizedEmail);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, status: 401, message: "Invalid email or password." };
  }

  const token = randomBytes(32).toString("hex");
  store.tokens.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  await writeStore(store);

  return { ok: true, status: 200, user: publicUser(user), token };
}

export async function getUserByToken(token) {
  if (!token) {
    return { ok: false, status: 401, message: "Missing login token." };
  }

  const store = await readStore();
  const session = store.tokens.find((item) => item.token === token);
  if (!session) {
    return { ok: false, status: 401, message: "Invalid or expired login token." };
  }

  const user = store.users.find((item) => Number(item.id) === Number(session.userId));
  if (!user) {
    return { ok: false, status: 401, message: "Invalid or expired login token." };
  }

  return { ok: true, status: 200, user: publicUser(user) };
}

export async function logoutByToken(token) {
  if (!token) {
    return { ok: false, status: 401, message: "Missing login token." };
  }

  const store = await readStore();
  const before = store.tokens.length;
  store.tokens = store.tokens.filter((item) => item.token !== token);

  if (store.tokens.length === before) {
    return { ok: false, status: 401, message: "Invalid or expired login token." };
  }

  await writeStore(store);
  return { ok: true, status: 200, message: "Logged out successfully." };
}

export function bearerTokenFromRequest(request) {
  const auth = request.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
