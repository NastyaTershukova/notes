<?php
$email = filter_var(
    trim($_POST['email']),
    FILTER_UNSAFE_RAW
);
$pass = filter_var(
    trim($_POST['pass']),
    FILTER_UNSAFE_RAW
);
$pass = $_POST['pass'];
$salt = "ecbccdjcn3474";
$hashed_password = hash('sha256', $pass . $salt);

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$result = $mysql->query("SELECT * FROM `users` WHERE `email` = '$email' AND `pass` = '$hashed_password'");
$user = $result->fetch_assoc();
if($user === null) {
    echo "Такой пользователь не найден";
    exit();
}
setcookie('user', $user['email'], time() + 3600, "/");

if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}

$mysql->close();
header('Location: /');
?>