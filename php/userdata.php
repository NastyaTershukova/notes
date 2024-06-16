<?php

include "checktoken.php";
include "session.php";

if (!isset($_COOKIE['token'])) {
    refreshToken();
    echo "token_reloaded";
    exit;
}
$token = $_COOKIE['token'];

$id = checkToken($token);

if ($id == "error_no_token") {
    echo "token_expired";
    exit();
}
if ($id == "error_not_executable") {
    echo "not_executable";
    exit();
}

$mysql = new mysqli('localhost', 'u2695624_backend', 'dixkyj-1gUjje-qagdog', 'u2695624_graduate_notes');
$result = $mysql->query("SELECT `contents_key`, `name`, `lastname`, `picture`, `email` FROM `users` WHERE `id` = '$id'");
$data = $result->fetch_assoc();
if($data === null) {
    echo "user_not_found";
    exit();
}

if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}

// Устанавливаем заголовок Content-Type для указания формата JSON
header('Content-Type: application/json');

// Возвращаем JSON как ответ на запрос
echo json_encode($data);

$mysql->close();
//header('Location: /');
?>