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

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$mysql->query("INSERT INTO `users` (`id`, `email`, `pass`)
VALUES('$email', '$pass')");

$mysql->close();
?>