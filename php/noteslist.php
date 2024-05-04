<?php
include "checktoken.php";
include "session.php";
include "note_encrypt.php";

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

session_start();
$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("SELECT id, preview from `notes` WHERE owner = ?");

if ($request === false) {
    die("MySQL prepare error: " . $mysql->error);
}
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
$request->bind_param("i", $_SESSION['user_id']);

if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}
$result = $request->get_result();

$decryptedArray = [];

while ($row = $result->fetch_assoc()) {
    $decryptedArray[] = decryptNote($row['preview']);
}
// Возвращаем JSON как ответ на запрос
header('Content-Type: application/json');
echo json_encode($decryptedArray);

$mysql->close();
