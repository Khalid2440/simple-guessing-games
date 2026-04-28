<?php
// Shared setup for all PHP API files.
// Run with: php -S localhost:8000 -t backend/api

$allowed_origin = 'http://localhost:3000';
header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function db() {
    $dir = __DIR__ . '/../data';
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $pdo = new PDO('sqlite:' . $dir . '/gamehub.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS tokens (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )');
    return $pdo;
}

function create_token($pdo, $user_id) {
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare('INSERT INTO tokens (token, user_id, created_at) VALUES (?, ?, ?)');
    $stmt->execute([$token, $user_id, date('c')]);
    return $token;
}

function public_user($user) {
    return [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
    ];
}

function get_bearer_token() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
        return trim($matches[1]);
    }
    return null;
}

function require_user() {
    $token = get_bearer_token();
    if (!$token) {
        respond(['message' => 'Missing login token.'], 401);
    }

    $pdo = db();
    $stmt = $pdo->prepare('SELECT users.id, users.name, users.email FROM tokens JOIN users ON users.id = tokens.user_id WHERE tokens.token = ?');
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        respond(['message' => 'Invalid or expired login token.'], 401);
    }

    return [$pdo, $user, $token];
}
?>
