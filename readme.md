# Tee's mock API

My cloudflare worker providing mock API and some other stuffs.

Routes:

- `/api/v1/ipcheck`: Get IP address of current request.
- `/api/v1/timedate`: Get current time and date of server.
- `/api/v1/updates`: Set and get anything to the kv-cache.
- `/api/v1/nope`: Return a random reason to say "No". Powered by [No-as-a-Service](https://github.com/hotheadhacker/no-as-a-service).
- `/api/v1/random`: Return a random number in range 0 to 1. Powered by [Cloudflare's League of Entropy](https://www.cloudflare.com/leagueofentropy/).

Web:

- `/ipcheck`: YetAnotherOnlineIP-Check
- `/timedate`: TimeDateManualAcknowledgement
- `/ramdownload`: Online RAM Downloader
- `/updates`: Updates from anything
- `/nope`: Nope-as-a-Service
- `/random`: RandomValue

Assets:

- `/assets/static/js/vnlunar.js`: Converts date to VN_Lunar date. Contains only one function `ConvertSolar2Lunar(dd, mm, yy, timeZone, addYear)`. Returns `dd/mm`. Remember to use `timeZone=7` for Vietnam. Use `addYear=True` to return `dd/mm/yyyy`.
