<?php

include "checktoken.php";

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

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$result = $mysql->query("SELECT `contents_key`, `name`, `lastname`, `picture` FROM `users` WHERE `id` = '$id'");
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