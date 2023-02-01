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

## Docker:
### Build docker image
docker build -t <docker-username>/atocha-server-v0.1 .
### Run docker image as container
docker run -p 3000:3000 -d <docker-image>



## To Do List:
- DB / Google Firebase Integration:
    - DB User Model: usual fields + default srcLang + default targetLang 
    - DB Translations Model: fields - srcLang, targetLang, userId, audio, text
    - Add route authentication - connect to routes + wss
    - API route for user?
    - API route for history?
- Convert audio without using temporary save file
- Save session stats to PostgreSQL or Firebase.
- Landing Page
    - Copyright, footer
    - new favicon
    - real text
    - link to expo app store / real app store

