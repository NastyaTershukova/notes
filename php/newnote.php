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
$request = $mysql->prepare("INSERT INTO `notes` (`owner`, `uuid`, `contents`, `preview`, `time_edited`, `time_created`, `tags`)
VALUES(?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?)");

$data = array(
    'content' => [],
);
$preview = array(
    'title' => '',
    'text' => '',
);

function generateUUIDv4() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,  // версия 4
        mt_rand(0, 0x3fff) | 0x8000,  // вариант 1
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
$uuid = generateUUIDv4();

// Преобразование массива в строку JSON
$json_string = json_encode($data);
$preview_encode = json_encode($preview);

session_start();
$contents_encrypt_key = 'FSK10-klFA_01;ASFDyio[sDLVm, w45we51!!@m';
$contents_key = decryptToken($_SESSION['contents_key'], $contents_encrypt_key);
$encryptedNote = encryptNote($json_string, $contents_key);
$encryptedPreview = encryptNote($preview_encode, $contents_key);

if ($request === false) {
    die("MySQL prepare error: " . $mysqli->error);
}
$tags = json_encode([]);
$cur_time = time();
$request->bind_param("isssiis", $_SESSION['user_id'], $uuid, $encryptedNote, $encryptedPreview, $cur_time, $cur_time, $tags);
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
