# Deploy Informula Backend on Vercel

Deploy this folder as its own Vercel project.

## Project settings

- Framework preset: Other
- Root directory: `backend_final`
- Build command: leave empty
- Output directory: leave empty
- Install command: leave empty, or use Vercel default

Vercel detects `server.py` as the FastAPI entrypoint because it exports `app = FastAPI()`.

## Environment variables

Add these in Vercel Project Settings -> Environment Variables for Production, Preview, and Development as needed:

```env
GOOGLE_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
AZURE_API_KEY=...
ENDPOINT=...
```

Optional:

```env
GEMINI_MODEL=gemini-2.5-flash-lite
```

## Verify

After deployment, open:

```text
https://your-backend-domain.vercel.app/api/health
```

It should return:

```json
{"ok":true}
```

## Connect the deployed frontend

In the frontend Vercel project, set:

```env
VITE_API_BASE_URL=https://your-backend-domain.vercel.app
```

Then redeploy the frontend so the Vite environment variable is baked into the production bundle.

## CLI note

If you deploy from the terminal, use Vercel CLI `48.1.8` or newer:

```powershell
cd backend_final
vercel login
vercel deploy --prod
```
