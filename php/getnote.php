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

$note_id = $_POST['id'];

session_start();
$mysql = new mysqli('localhost', 'root', '', 'register-bd');

if (!is_numeric($note_id)) {
    $request = $mysql->prepare("SELECT * from `notes` WHERE owner = ? AND uuid = ?");
    $type = "s";
} else {
    $request = $mysql->prepare("SELECT * from `notes` WHERE owner = ? LIMIT ?, 1");
    $type = "i";
}

if ($request === false) {
    die("MySQL prepare error: " . $mysql->error);
}
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}


$request->bind_param("i".$type, $_SESSION['user_id'], $note_id);

if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}
$result = $request->get_result()->fetch_assoc();

$contents_encrypt_key = 'FSK10-klFA_01;ASFDyio[sDLVm, w45we51!!@m';
$contents_key = decryptToken($_SESSION['contents_key'], $contents_encrypt_key);

$result_note = Array(decryptNote($result['contents'], $contents_key), decryptNote($result['preview'], $contents_key), $result['time_edited'], $result['time_created']);
// Возвращаем JSON как ответ на запрос
header('Content-Type: application/json');
echo json_encode($result_note);

$mysql->close();
