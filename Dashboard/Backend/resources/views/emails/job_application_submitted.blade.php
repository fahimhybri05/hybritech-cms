<!DOCTYPE html>
<html>
<head>
    <title>New Job Application</title>
</head>
<body>
    <h1>New Job Application Submitted</h1>
    <p>A new job application has been submitted with the following details:</p>
    <ul>
        <li><strong>Full Name:</strong> {{ $jobApplication->full_name }}</li>
        <li><strong>Email:</strong> {{ $jobApplication->email }}</li>
        <li><strong>Phone Number:</strong> {{ $jobApplication->number }}</li>
        <li><strong>Designation:</strong> {{ $jobApplication->designation }}</li>
        <li><strong>Experience:</strong> {{ $jobApplication->experience }}</li>
        <li><strong>Active Status:</strong> {{ $jobApplication->is_active ? 'Active' : 'Inactive' }}</li>
    </ul>
    <p>The applicant's attachment is included with this email.</p>
</body>
</html>