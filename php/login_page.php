<?php

    include "login.php";

    $email_post = filter_var(
        trim($_POST['email']),
        FILTER_UNSAFE_RAW
    );
    $pass_post = filter_var(
        trim($_POST['pass']),
        FILTER_UNSAFE_RAW
    );

    login($email_post, $pass_post);
?>