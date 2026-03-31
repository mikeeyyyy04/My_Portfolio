<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ce003ebb-8411-48f3-9b6a-85555935d1ce

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. If you add backend Gemini integration later, store `GEMINI_API_KEY` in server-side environment variables only
3. Run the app:
   `npm run dev`

## Vercel Deployment Checklist

1. Keep API secrets off the client. Do not inject `GEMINI_API_KEY` into frontend code.
2. If Gemini access is needed in production, use a serverless function/API route and read secrets there.
3. Build output directory is `dist` (default Vite output).
4. Framework preset on Vercel: `Vite`.
5. Build command on Vercel: `npm run build`.
