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

$note_id = isset($_POST['id']) ? $_POST['id'] : null;

session_start();
$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("SELECT id, contents from `notes` WHERE owner = ? LIMIT ?, 1");

if ($request === false) {
    die("MySQL prepare error: " . $mysql->error);
}
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
$request->bind_param("ii", $_SESSION['user_id'], $note_id);

if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}
$result = $request->get_result()->fetch_assoc();

$contents_encrypt_key = 'FSK10-klFA_01;ASFDyio[sDLVm, w45we51!!@m';
$contents_key = decryptToken($_SESSION['contents_key'], $contents_encrypt_key);

$result_note = decryptNote($result['contents'], $contents_key);
// Возвращаем JSON как ответ на запрос
header('Content-Type: application/json');
echo $result_note;

$mysql->close();