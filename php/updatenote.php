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

$contents_encrypt_key = 'FSK10-klFA_01;ASFDyio[sDLVm, w45we51!!@m';
$contents_key = decryptToken($_SESSION['contents_key'], $contents_encrypt_key);

if (!isset($_POST['id'])) {
    echo "uuid_not_set";
    exit;
}
$note_id = $_POST['id'];
$preview_only = false;
if (!isset($_POST['contents']) && isset($_POST['preview'])) {
    $note_preview = encryptNote($_POST['preview'], $contents_key);
    $preview_only = true;
} else if (!isset($_POST['contents'])) {
    echo "contents_not_set";
    exit;
} else if (!isset($_POST['preview'])) {
    echo "preview_not_set";
    exit;
} else {
    $note_contents = encryptNote($_POST['contents'], $contents_key);
    $note_preview = encryptNote($_POST['preview'], $contents_key);
}

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("UPDATE notes SET contents = ?, preview = ?, time_edited = NOW() WHERE owner = ? AND uuid = ?");

if ($preview_only == true) {
    $request = $mysql->prepare("UPDATE notes SET preview = ? WHERE owner = ? AND uuid = ?");
}

if ($request === false) {
    die("MySQL prepare error: " . $mysql->error);
}
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
if ($preview_only == false) {
    $request->bind_param("ssis", $note_contents, $note_preview, $_SESSION['user_id'], $note_id);
} else {
    $request->bind_param("sis", $note_preview, $_SESSION['user_id'], $note_id);
}

if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}
$result = $request->get_result();

if ($result) {
    echo "successful";
}

$mysql->close();
