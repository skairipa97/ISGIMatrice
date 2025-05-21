<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Convocation au Comité de Discipline</title>
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
    <h2>Convocation au Comité de Discipline</h2>

    <p>Bonjour {{ $stagiaire->prenom }} {{ $stagiaire->nom }},</p>

    <p>Nous avons constaté que vous avez dépassé le seuil autorisé d'absences non justifiées (plus de {{ $totalHours }} heures).</p>

    <p>En conséquence, vous êtes convoqué(e) à vous présenter devant le comité de discipline de l'Institut Supérieur de Génie Informatique.</p>

    <p>Merci de prendre contact avec l'administration pour connaître la date et l'heure de votre passage.</p>

    <div class="footer">
        <div class="signature">
            <p>Cordialement,</p>
            <p><strong>L'équipe ISGIMatrice</strong></p>
            <p>Institut Supérieur de Génie Informatique</p>
        </div>
    </div>
</body>
</html> 