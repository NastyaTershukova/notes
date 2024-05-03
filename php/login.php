<?php

$requestBody = file_get_contents('php://input');
$requestData = json_decode($requestBody, true);

if (isset($requestData['email'])) {
    $email = $requestData['email'];
} else {
    echo "email_not_provided";
}
if (isset($requestData['pass'])) {
    $pass = $requestData['pass'];
} else {
    echo "password_not_provided";
}


$salt = "ecbccdjcn3474";
$hashed_password = hash('sha256', $pass . $salt);

$mysql = new mysqli('localhost', 'root', '', 'register-bd');

$email = mysqli_real_escape_string($mysql, $email);

$result = $mysql->query("SELECT `contents_key`, `name`, `lastname`, `picture` FROM `users` WHERE `email` = '$email' AND `pass` = '$hashed_password'");
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