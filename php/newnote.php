<?php
include "checktoken.php";
include "session.php";

if (!isset($_COOKIE['token'])) {
    refreshToken();
    echo "token_reloaded";
    exit;
}
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

$contents_key = encryptPassword(generateRandomString(), $pass_raw);

$name = 'Добавь Поле для имени';
$lastname = 'Добавь Поле для фамилии';
$picture = '/userpictures/devio.jpg';

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("INSERT INTO `notes` (`owner`, `contents`)
VALUES(?, ?)");

$data = array(
    'title' => '',
    'time' => time(),
    'date' => 0,
    'content' => []
);

// Преобразование массива в строку JSON
$json_string = json_encode($data);
echo $json_string;

if ($request === false) {
    die("MySQL prepare error: " . $mysqli->error);
}
$request->bind_param("ss", $email, $pass, $contents_key, $name, $lastname, $picture);
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
