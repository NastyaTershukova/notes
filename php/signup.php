<?php
$email = filter_var(
    trim($_POST['email']),
    FILTER_UNSAFE_RAW
);
$pass = filter_var(
    trim($_POST['pass']),
    FILTER_UNSAFE_RAW
);

if (mb_strlen($email) < 5 || mb_strlen($email) > 90) {
    echo "Недопустимая длина почты";
    exit();
} else if (mb_strlen($pass) < 6) {
    echo "Недопустимая длина пароля (минимум 6 символов)";
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
