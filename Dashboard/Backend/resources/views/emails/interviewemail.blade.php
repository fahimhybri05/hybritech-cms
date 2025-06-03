<!DOCTYPE html>
<html>
<head>
    <title>Hello</title>
</head>
<body>
<p>Hi <strong>{{ $emailList->name }}</strong></p>

<p>I hope this message finds you well. We are pleased to inform you that you have been shortlisted for the <strong>{{ $emailList->designation }}</strong> role at Hybritech Innovations Ltd. As part of our selection process, we would like to invite you for an  examination and interview.
Details of the interview and exam are as follows:</p>
<p>
    <li>Date: {{ \Carbon\Carbon::parse($emailList->interview_date)->format('Y-m-d') }}</li>
    <li>Time: {{ \Carbon\Carbon::parse($emailList->interview_date)->format('h:i A') }}</li>
    <li>Location: {{ $emailList->address }}</li>
</p>
<p>
If you have any questions or require further assistance, feel free to reach out. We look forward to meeting you.
</p>
<p>
Note: Please bring hard copy printed CV with you.
</p>
<p>Kind regards,<br><b>Md. Shahriar Shakif</b><br>
<b>Manager</b><br>
<b>Hybritech Innovations Ltd.</b></p>
<p>Plot 31, Road-5, Banasree Block-C | 1219 Dhaka | T +8801882541540 | www.hybri.tech</p>    
</body>
</html>