<?php
$email = filter_var(
    trim($_POST['email']),
    FILTER_SANITIZE_STRING
);
$pass = filter_var(
    trim($_POST['pass']),
    FILTER_SANITIZE_STRING
);
    $pass = $_POST['pass'];
    $salt = "ecbccdjcn3474";
    $hashed_password = hash('sha256', $pass . $salt);
// $pass = md5($pass . "ecbccdjcn3474");

$mysql = new mysqli('localhost', 'root', '', 'register-bd');

$result = $mysql->query("SELECT * FROM `users` WHERE `email` = '$email' AND `pass` = '$pass'");
$user = $result->fetch_assoc();
if (count($user) == 0) {
    echo "Такой пользователь не найден";
    exit();
}

// setcookie('user', $user)

if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}

$mysql->close();
header('Location: /');
?>