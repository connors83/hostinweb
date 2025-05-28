<?php
header('Content-Type: text/html; charset=UTF-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Asegúrate de tener PHPMailer en esta ruta o ajusta según sea necesario
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Honeypot
if (!empty($_POST['website'])) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado.']);
    exit;
}

// Validación reCAPTCHA v3
$token = $_POST['recaptcha_token'] ?? '';
$secretKey = '6Lf6cTorAAAAACM5Z0qFnOc3vASh_hmc07Uw5kH0';

$recaptcha_response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$token");
$recaptcha = json_decode($recaptcha_response);

if (!$recaptcha->success || $recaptcha->score < 0.5) {
    echo json_encode(['status' => 'error', 'message' => 'Validación de reCAPTCHA fallida.']);
    exit;
}

// Sanitizar entradas
function clean_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$name = clean_input($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = clean_input($_POST['phone'] ?? '');
$project = clean_input($_POST['project'] ?? '');
$subject = clean_input($_POST['subject'] ?? '');
$message = clean_input($_POST['message'] ?? '');

if (!$name || !$email || !$subject || !$message) {
    echo json_encode(['status' => 'error', 'message' => 'Por favor complete todos los campos obligatorios.']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'securemail2.megamailservers.com';         // Cambia esto
    $mail->SMTPAuth = true;
    $mail->Username = 'postmaster@seteinllc.com';          // Cambia esto
    $mail->Password = 'MrQ-bGaU25SdX*6C4WH%hk)qe';           // Cambia esto
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom($email, $name);
    $mail->addAddress('soporte@seteinllc.com');         // Cambia esto también si quieres recibirlo en otro correo

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = "
        <strong>Nombre:</strong> $name<br>
        <strong>Email:</strong> $email<br>
        <strong>Teléfono:</strong> $phone<br>
        <strong>Proyecto:</strong> $project<br>
        <strong>Mensaje:</strong><br>$message
    ";

    $mail->send();

    echo json_encode(['status' => 'success', 'message' => 'Mensaje enviado correctamente.']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al enviar: ' . $mail->ErrorInfo]);
}
