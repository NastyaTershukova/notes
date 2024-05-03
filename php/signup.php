<?php
include "login.php";

function generateRandomString($length = 32) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[random_int(0, $charactersLength - 1)];
    }
    return $randomString;
}

$email = filter_var(
    trim($_POST['email']),
    FILTER_UNSAFE_RAW
);
$pass_raw = filter_var(
    trim($_POST['pass']),
    FILTER_UNSAFE_RAW
);

if (mb_strlen($email) < 5 || mb_strlen($email) > 90) {
    echo "Недопустимая длина почты";
    exit();
} else if (mb_strlen($pass_raw) < 6) {
    echo "Недопустимая длина пароля (минимум 6 символов)";
    exit();
}

$pass = hash("sha256", $pass_raw."ecbccdjcn3474");

function encryptPassword($password, $key) {
    // Генерируем случайную строку для использования в качестве соли
    $salt = openssl_random_pseudo_bytes(16);
    
    // Создаем ключ шифрования на основе заданного ключа
    $encryptionKey = openssl_pbkdf2($key, $salt, 32, 1000, 'sha256');
    
    // Шифруем пароль с использованием ключа
    $encryptedPassword = openssl_encrypt($password, 'aes-256-cbc', $encryptionKey, 0, $salt);
    
    // Кодируем зашифрованный пароль и соль в base64
    $encodedPassword = base64_encode($encryptedPassword);
    $encodedSalt = base64_encode($salt);
    
    // Возвращаем зашифрованный пароль и соль, разделенные символом ";"
    return $encodedPassword . ';' . $encodedSalt;
}

$contents_key = encryptPassword(generateRandomString(), $pass_raw);

$name = 'Добавь Поле для имени';
$lastname = 'Добавь Поле для фамилии';
$picture = '/userpictures/devio.jpg';

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("INSERT INTO `users` (`email`, `pass`, `contents_key`, `name`, `lastname`, `picture`)
VALUES(?, ?, ?, ?, ?, ?)");

if ($request === false) {
    die("MySQL prepare error: " . $mysqli->error);
}
$request->bind_param("ssssss", $email, $pass, $contents_key, $name, $lastname, $picture);
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}
$result = $request->get_result();

$login_result = login($email, $pass_raw);
echo $login_result;

if ($login_result == "login_successful") {
    header('Location: /');
}

$mysql->close();
