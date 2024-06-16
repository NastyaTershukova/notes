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

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

if (!isset($data['email'])) {
    echo json_encode(['error' => 'Email is required']);

    exit();
}
if (!isset($data['password'])) {
    echo json_encode(['error' => 'Password is required']);
    
    exit();
}
if (!isset($data['name'])) {
    echo json_encode(['error' => 'First name is required']);
    
    exit();
}
if (!isset($data['last_name'])) {
    echo json_encode(['error' => 'Last name is required']);
    
    exit();
}

$email = $data['email'];
$pass_raw = $data['password'];

if (mb_strlen($email) < 5 || mb_strlen($email) > 90) {
    echo "Недопустимая длина почты";
    exit();
} else if (mb_strlen($pass_raw) < 6) {
    echo "Недопустимая длина пароля (минимум 6 символов)";
    exit();
}

$pass = hash("sha256", $data['password']."ecbccdjcn3474");

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

$name = $data['name'];
$lastname = $data['last_name'];

if ($data['image'] != "") {
    $filename = uniqid() . '.jpg';
    $filepath = __DIR__ . '/../userpictures/' . $filename;

    $imageData = base64_decode($data['image']);
    if (!$imageData) {
        echo json_encode(['warn' => 'Invalid image data']);
        exit;
    }

    // Сохранение изображения на сервере
    if (!file_put_contents($filepath, $imageData)) {
        echo json_encode(['warn' => 'Failed to save profile photo']);
    }
} else {
    $filename = '';
}

$mysql = new mysqli('localhost', 'u2695624_backend', 'dixkyj-1gUjje-qagdog', 'u2695624_graduate_notes');
$request = $mysql->prepare("INSERT INTO `users` (`email`, `pass`, `contents_key`, `name`, `lastname`, `picture`)
VALUES(?, ?, ?, ?, ?, ?)");

if ($request === false) {
    die("MySQL prepare error: " . $mysqli->error);
}
$request->bind_param("ssssss", $email, $pass, $contents_key, $name, $lastname, $filename);
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

echo json_encode(['success' => 'signup successful']);

$mysql->close();
