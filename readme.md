# Tee's mock API

My cloudflare worker providing mock API and some other stuffs.

Routes:

- `/api/v1/ipcheck`: Get IP address of current request.
- `/api/v1/timedate`: Get current time and date of server.

Web:

- `/ipcheck`: YetAnotherOnlineIP-Check
- `/timedate`: TimeDateManualAcknowledgement
- `/ramdownload`: Online RAM Downloader

Assets:

- `/assets/static/js/vnlunar.js`: Converts date to VN_Lunar date. Contains only one function `ConvertSolar2Lunar(dd, mm, yy, timeZone, addYear)`. Returns `dd/mm`. Remember to use `timeZone=7` for Vietnam. Use `addYear=True` to return `dd/mm/yyyy`.
