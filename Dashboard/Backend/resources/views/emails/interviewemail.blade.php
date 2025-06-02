<!DOCTYPE html>
<html>
<head>
    <title>Hello</title>
</head>
<body>
    <ul>
        <li><strong>Full Name:</strong> {{ $emailList->name }}</li>
        <li><strong>Email:</strong> {{ $emailList->email }}</li>
        <li><strong>Interview Location:</strong> <br> {{ $emailList->address }}</li>
        <li><strong>Interview Date:</strong> {{ $emailList->interview_date }}</li>
    </ul>
    
</body>
</html>