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

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("INSERT INTO `notes` (`owner`, `contents`, `preview`)
VALUES(?, ?, ?)");

$data = array(
    'title' => '',
    'time' => time(),
    'date' => 0,
    'content' => []
);
$preview = array(
    'title' => '',
    'time' => time(),
    'text' => ''
);

// Преобразование массива в строку JSON
$json_string = json_encode($data);
$preview_encode = json_encode($preview);

session_start();
$encryptedNote = encryptNote($json_string, $_SESSION['contents_key']);
$encryptedPreview = encryptNote($preview_encode, $_SESSION['contents_key']);

if ($request === false) {
    die("MySQL prepare error: " . $mysqli->error);
}
$request->bind_param("iss", $_SESSION['user_id'], $encryptedNote, $encryptedPreview);
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}
$result = $request->get_result();


$mysql->close();
