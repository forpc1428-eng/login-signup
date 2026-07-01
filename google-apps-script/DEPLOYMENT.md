# Google Apps Script Deployment

## Backend Setup
1. Open Google Drive and create a new standalone Google Apps Script project.
2. Replace the default script with `google-apps-script/Code.gs`.
3. Save the project.
4. In the Apps Script editor, run `doGet` once from the function selector to authorize spreadsheet creation and sheet access.
5. Confirm the first run creates a spreadsheet titled `Atlas Access Database` and a `Users` sheet.

## Deploy As Web App
1. In the Apps Script editor, click `Deploy`.
2. Choose `New deployment`.
3. Select `Web app` as the deployment type.
4. Set `Execute as` to `Me`.
5. Set `Who has access` to `Anyone`.
6. Deploy and copy the `/exec` URL.

## Frontend Configuration
1. In the Vite project root, create a `.env.local` file.
2. Set `VITE_APPS_SCRIPT_URL` to the copied Apps Script `/exec` URL.
3. Keep the URL exactly as deployed, including `/exec`.

## Frontend Run And Build
1. Install dependencies.
2. Run the app with `npm run dev`.
3. Build production output with `npm run build`.

## Operational Notes
- The frontend sends requests as `text/plain;charset=utf-8` so the browser treats them as simple requests and avoids a preflight failure with Apps Script web apps.
- Google Apps Script web apps return JSON through `ContentService` and the browser follows the published web app response path automatically.
- The backend auto-creates the spreadsheet, creates or repairs the `Users` sheet, and re-adds missing headers without duplicating them.
