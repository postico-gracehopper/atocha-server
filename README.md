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
