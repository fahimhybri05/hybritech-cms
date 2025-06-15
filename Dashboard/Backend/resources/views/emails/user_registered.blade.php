<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Application</title>
</head>
<body>
    <h1>Welcome, {{ $name }}!</h1>
    @if ($image_url)
        <img src="{{ $image_url }}" alt="{{ $name }}'s profile image" style="max-width: 150px; height: auto;">
    @endif
    <p>Thank you for registering with us. Here are your account details:</p>
    <ul>
        <li><strong>Name:</strong> {{ $name }}</li>
        <li><strong>Position:</strong> {{ $position }}</li>
        <li><strong>Email:</strong> {{ $email }}</li>
        <li><strong>Password:</strong> {{ $password }}</li>
    </ul>
    <p>Please keep this information safe. You can log in using your email and password.</p>
    <p>Best regards,<br><b>Hybritech Innovations Ltd.</b></p>
</body>
</html>
