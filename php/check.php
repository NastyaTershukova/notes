<?php
$email = filter_var(
    trim($_POST['email']),
    FILTER_SANITIZE_STRING
);
$pass = filter_var(
    trim($_POST['pass']),
    FILTER_SANITIZE_STRING
);

if (mb_strlen($email) < 5 || mb_strlen($email) > 90) {
    echo "Недопустимая длина почты";
    exit();
} else if (mb_strlen($pass) < 2 || mb_strlen($pass) > 20) {
    echo "Недопустимая длина пароля (от 2 до 20 символов)";
    exit();
}

$pass = hash("sha256", $pass."ecbccdjcn3474");

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$mysql->query("INSERT INTO `users` (`email`, `pass`)
VALUES('$email', '$pass')");
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
$mysql->close();
header('Location: /');
