# Atocha-Sever: A Backend for Atocha App

A backend for the Atocha app

## Live site:

    https://atocha-server-production.up.railway.app/

## API Endpoints

POST /api/translate

    REQUEST
        body: {langFrom: 'es', langTo: 'en', audio: [audioFile] }

    RESPONSE:
        body: {langFrom: 'es', langTo: 'en', textResponse: [String]}

## FFMPEG:

    ffmpeg -i male-1.wav -ar 16000 output.flac

## To Do List:
- Add User Model: usual fields + default srcLang + default targetLang 
- Add authentication - connect to routes + wss
- Make Translations Model: fields - srcLang, targetLang, userId, audio, text
- Feed string as input to node.spawn(ffmpeg) == no server-side temp file 
- Deploying with FFMPEG (Docker container required?)
-
