<?php
require_once __DIR__ . '/config.php';

[$pdo, $user, $token] = require_user();
respond(['user' => public_user($user)]);
?>
