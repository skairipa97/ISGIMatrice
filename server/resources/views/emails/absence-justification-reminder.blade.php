<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Rappel : Justification d'absence</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
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
    <h2>Rappel : Justification d'absence bientôt expirée</h2>

    <p>Bonjour {{ $stagiaire->prenom }} {{ $stagiaire->nom }},</p>

    <p>Vous avez une absence du {{ $absence->seance->date }} qui n'a pas encore été justifiée.</p>
    <p>Il vous reste moins de {{ $hours_left }} heures pour soumettre une justification. Passé ce délai (48h après l'absence), il ne sera plus possible de justifier cette absence.</p>

    <div class="footer">
        <div class="signature">
            <p>Cordialement,</p>
            <p><strong>L'équipe ISGIMatrice</strong></p>
            <p>Institut Supérieur de Génie Informatique</p>
        </div>
    </div>
</body>
</html> 