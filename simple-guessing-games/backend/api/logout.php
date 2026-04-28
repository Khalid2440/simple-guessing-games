<?php
require_once __DIR__ . '/config.php';

[$pdo, $user, $token] = require_user();
$stmt = $pdo->prepare('DELETE FROM tokens WHERE token = ?');
$stmt->execute([$token]);
respond(['message' => 'Logged out successfully.']);
?>
