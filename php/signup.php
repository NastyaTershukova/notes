<?php

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

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
echo $contents_key;
$mysql->query("INSERT INTO `users` (`email`, `pass`, `contents_key`)
VALUES('$email', '$pass', '$contents_key')");
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}

session_start();
$_SESSION['user_id'] = $email;
$_SESSION['password'] = $pass;

setcookie(session_name(), session_id(), [
  'expires' => time() + 15552000, // Куки действительны 180 дней
  'path' => '/',
  'secure' => true,
  'httponly' => false, //для доступности куки с помощью JS
  'samesite' => 'Lax'
]);
$mysql->close();
header('Location: /');
