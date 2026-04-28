<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['message' => 'Method not allowed.'], 405);
}

$data = read_json_body();
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
    respond(['message' => 'Invalid email or password.'], 422);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    respond(['message' => 'Invalid email or password.'], 401);
}

$token = create_token($pdo, $user['id']);

respond([
    'message' => 'Login successful.',
    'token' => $token,
    'user' => public_user($user),
]);
?>
