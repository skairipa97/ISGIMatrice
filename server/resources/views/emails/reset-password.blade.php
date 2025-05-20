<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Réinitialisation du mot de passe</title>
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
        .button:hover {
            background-color: #45a049;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }
        .signature {
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h2>Réinitialisation de votre mot de passe</h2>

    <p>Bonjour,</p>

    <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

    <a href="http://localhost:5173{{ $url }}" class="button">Réinitialiser le mot de passe</a>

    <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet email ou contacter le support si vous avez des questions.</p>

    <p>Ce lien de réinitialisation expirera dans 60 minutes.</p>

    <div class="footer">
        <p>Si vous avez des difficultés à cliquer sur le bouton, copiez et collez cette URL dans votre navigateur :</p>
        <p>http://localhost:5173{{ $url }}</p>
        
        <div class="signature">
            <p>Cordialement,</p>
            <p><strong>L'équipe ISGIMatrice</strong></p>
            <p>Institut Supérieur de Génie Informatique</p>
        </div>
    </div>
</body>
</html>