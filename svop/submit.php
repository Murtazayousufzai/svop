<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Your email address
    $to = "murtazayousufzai833@gmail.com"; // <-- Replace this with your real email

    // Email subject
    $subject = "New Recruitment Application - Students Voice of Patient Safety";

    // Extract and sanitize form values
    $fullName = htmlspecialchars($_POST['fullName']);
    $email = htmlspecialchars($_POST['email']);
    $department = htmlspecialchars($_POST['Department']);
    $batch = htmlspecialchars($_POST['batch']);
    $phone = htmlspecialchars($_POST['phone']);
    $joinReason = htmlspecialchars($_POST['joinReason']);
    $selectedDepartment = htmlspecialchars($_POST['department']);

    // Email body
    $message = "You have received a new application:\n\n";
    $message .= "Full Name: $fullName\n";
    $message .= "Email: $email\n";
    $message .= "Department: $department\n";
    $message .= "Batch: $batch\n";
    $message .= "WhatsApp Number: $phone\n";
    $message .= "Why Join: $joinReason\n";
    $message .= "Preferred Working Department: $selectedDepartment\n";

    // Email headers
    $headers = "From: noreply@svop.netlify.app\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo "<h2>Thank you! Your application has been submitted.</h2>";
    } else {
        echo "<h2>Oops! Something went wrong. Please try again later.</h2>";
    }
} else {
    echo "Access Denied";
}
?>
