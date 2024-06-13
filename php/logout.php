<?php

session_start();
session_unset();
session_destroy();
setcookie('is_authorised', 'false', time() - 3600, '/');
setcookie('token', '', time() - 3600, '/');

?>