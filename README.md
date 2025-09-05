# FFBad tournament bot

## What does this do ?

Periodically fetches the Badnet API for new tournament.

Currently writes to a file, the plan is to send new tournaments to Whatsapp

## Requirements

`node` (tested with v22)

## Installation

Run `npm install`

Create a `.env` file with the following :

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

## How to use

Change the parameters in `.env` as needed (TODO : add documentation)

Run with `npm run start`

## Payloads

The script will query the Badnet API, an example output of the call can be found at [tournaments.json](./examples/tournaments.json)

## TODO

- Add instructions on how to get badnet token
- Add details about each `.env` parameter
