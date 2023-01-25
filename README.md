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