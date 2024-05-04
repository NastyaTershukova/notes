<?php
function encryptNote($contents, $key) {
    // Генерируем случайную строку для использования в качестве соли
    $salt = openssl_random_pseudo_bytes(16);
    
    // Создаем ключ шифрования на основе заданного ключа
    $encryptionKey = openssl_pbkdf2($key, $salt, 32, 1000, 'sha256');
    
    // Шифруем пароль с использованием ключа
    $encryptedContents = openssl_encrypt($contents, 'aes-256-cbc', $encryptionKey, 0, $salt);
    
    // Кодируем зашифрованный пароль и соль в base64
    $encodedContents = base64_encode($encryptedContents);
    $encodedSalt = base64_encode($salt);
    
    // Возвращаем зашифрованный пароль и соль, разделенные символом ";"
    return $encodedContents . ';' . $encodedSalt;
}

function decryptNote($encryptedContents, $key) {
    // Разбиваем зашифрованный пароль и соль, разделенные символом ";"
    $parts = explode(';', $encryptedContents);
    $encodedContents = $parts[0];
    $encodedSalt = $parts[1];
    
    // Декодируем зашифрованный пароль и соль из base64
    $encryptedContents = base64_decode($encodedContents);
    $salt = base64_decode($encodedSalt);
    
    // Создаем ключ шифрования на основе заданного ключа
    $encryptionKey = openssl_pbkdf2($key, $salt, 32, 1000, 'sha256');
    
    // Расшифровываем пароль с использованием ключа
    $decryptedContents = openssl_decrypt($encryptedContents, 'aes-256-cbc', $encryptionKey, 0, $salt);
    
    // Возвращаем расшифрованный пароль
    return $decryptedContents;
}
?>