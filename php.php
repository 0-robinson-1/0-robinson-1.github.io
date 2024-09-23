<?php
// Database credentials
$host = 'sql312.infinityfree.com'; // Replace with your MySQL Hostname, e.g., sqlXXX.epizy.com
$dbname = 'if0_37367339_php_exercises'; // Replace with your Database Name
$username = 'if0_37367339'; // Replace with your Database Username
$password = 'PF4hzV66YIoQb'; // Replace with your Database Password

// Create a connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>