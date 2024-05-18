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

if (!isset($_GET['sortby'])) {
    echo "error_sortby_notset";
}
if (!isset($_GET['is_deleted'])) {
    echo "error_is_deleted_notset";
}

session_start();
$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("SELECT uuid, preview, time_edited, time_created, tags from `notes` WHERE owner = ? AND is_deleted = ? ORDER BY ".$_GET['sortby']." DESC");

if ($request === false) {
    die("MySQL prepare error: " . $mysql->error);
}
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
$request->bind_param("ii", $_SESSION['user_id'], $_GET['is_deleted']);

if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}
$result = $request->get_result();

$decryptedArray = [];
$contents_encrypt_key = 'FSK10-klFA_01;ASFDyio[sDLVm, w45we51!!@m';
$contents_key = decryptToken($_SESSION['contents_key'], $contents_encrypt_key);

while ($row = $result->fetch_assoc()) {
    $decryptedArray[] = Array(decryptNote($row['preview'], $contents_key), $row['time_edited'], $row['time_created'], $row['tags'], $row['uuid']);
}
// Возвращаем JSON как ответ на запрос
header('Content-Type: application/json');
echo json_encode($decryptedArray);

$mysql->close();
