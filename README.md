# FFBad tournament bot

## What does this do ?

Periodically fetches the Badnet API for new tournament.

Currently writes to a file, the plan is to send new tournaments to Whatsapp

## Requirements

`node` (tested with v22)

## Installation

Run `npm install`

Create a `.env` file with the following (instructions below for the whatsapp variables) :

```
BADNET_API_URL=https://api.badnet.org/api/search/events
BADNET_ORIGIN=inscription-android
BADNET_TOKEN=yourtokenhere

SEARCH=
REGION=PDLL
AGE_CATEGORIES=Sénior
HIDE_OPENED_TOURNAMENTS=false
HIDE_CLOSED_TOURNAMENTS=true

PAGE_LIMIT=50
FETCH_INTERVAL_MINUTES=30
OUTPUT_FILE=
OUTPUT_DIR=

WHATSAPP_TOKEN=yourtokenhere
WHATSAPP_APP_ID=youridhere
WHATSAPP_DESTINATION=yourphonenumberhere

CACHE_FILE=cache.json
```

### Setting up WhatsApp

- Set up a new App on meta website : https://developers.facebook.com/apps/
- Link your phone on this page : https://developers.facebook.com/apps/<youridhere>/whatsapp-business
  - This will give you a phone id = `WHATSAPP_APP_ID` + your phone number = `WHATSAPP_DESTINATION`
- Follow the documentation to create a new business wallet and link it to your app. You should be able to see it in the linked apps here : https://business.facebook.com/latest/settings/apps
- Create a new system user for your bot with Whatsapp send permission here : https://business.facebook.com/latest/settings/system_users
  - Create a token for this user, this gives you `WHATSAPP_TOKEN`
- Create a new message template :

```
Name : badnetlink

Language : French

Title : Nouveau tournoi : {{1}}

Body :
Dates du tournoi : {{1}}
Emplacement : {{2}}
Ouverture des inscriptions : {{3}}
Disciplines : {{4}}
Classements : {{6}}
Lien : {{5}}

Les infos peuvent changer, vérifiez sur le lien ci-dessus !
```

- Put some data in the examples, doesn't matter. Then press send, make sure it's approved.

### Getting your badnet token

TODO

## How to use

Change the parameters in `.env` as needed

Run with `npm run start`

## Payloads

The script will query the Badnet API, an example output of the call can be found at [tournaments.json](./examples/tournaments.json)
