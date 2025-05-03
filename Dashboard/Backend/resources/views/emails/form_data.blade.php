<!DOCTYPE html>
<html>
<head>
    <title>New Project</title>
</head>
<body>
    <h4>A new project idea has been submitted with the following details:</h4>
    <ul>
        <li><strong>Full Name:</strong> {{ $commonForm->full_name }}</li>
        <li><strong>Email:</strong> {{ $commonForm->email }}</li>
        <li><strong>Project Name:</strong> {{ $commonForm->project_name }}</li>
        <li><strong>Project Type:</strong> {{ $commonForm->project_type }}</li>
        <li><strong>Budget:</strong> {{ $commonForm->project_budget }}</li>
        <li><strong>Project Description:</strong> {{ $commonForm->description }}</li>
    </ul>
</body>
</html>