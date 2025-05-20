<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <h2>Reset Your Password</h2>

    <p>Hello,</p>

    <p>We received a request to reset your password. Click the button below to create a new password:</p>

    <a href="{{ $url }}" class="button">Reset Password</a>

    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>

    <p>This password reset link will expire in 60 minutes.</p>

    <div class="footer">
        <p>If you're having trouble clicking the button, copy and paste this URL into your web browser:</p>
        <p>{{ $url }}</p>
    </div>
</body>
</html>