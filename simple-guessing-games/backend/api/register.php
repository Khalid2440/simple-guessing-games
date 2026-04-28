<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['message' => 'Method not allowed.'], 405);
}

$data = read_json_body();
$name = trim($data['name'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if (strlen($name) < 2) {
    respond(['message' => 'Name must be at least 2 characters.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(['message' => 'Please enter a valid email address.'], 422);
}

if (strlen($password) < 6) {
    respond(['message' => 'Password must be at least 6 characters.'], 422);
}

$pdo = db();
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, $hash, date('c')]);
    $user_id = $pdo->lastInsertId();
    $token = create_token($pdo, $user_id);

    respond([
        'message' => 'Registration successful.',
        'token' => $token,
        'user' => ['id' => (int) $user_id, 'name' => $name, 'email' => $email],
    ], 201);
} catch (PDOException $error) {
    if ($error->getCode() === '23000') {
        respond(['message' => 'This email is already registered.'], 409);
    }
    respond(['message' => 'Registration failed.'], 500);
}
?>
