<!DOCTYPE html>
<html>
<head>
    <title>{{$contactUsForm->subject}}</title>
</head>
<body>
    <h1>New Form Submitted</h1>
    <h4>A new form has been submitted with the following details:</h4>
    <ul>
        <li><strong>Full Name:</strong> {{ $contactUsForm->full_name }}</li>
        <li><strong>Email:</strong> {{ $contactUsForm->email }}</li>
        <li><strong>Contact Number:</strong> {{ $contactUsForm->number }}</li>
        <li><strong>Details:</strong> {{ $contactUsForm->description }}</li>
    </ul>
</body>
</html>