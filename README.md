# lobby-binghoe

[![Netlify Status](https://api.netlify.com/api/v1/badges/1d5b5359-9c0f-4e47-b497-12baa1cb9480/deploy-status)](https://app.netlify.com/sites/gregarious-puffpuff-bf7681/deploys)
![GitHub License](https://img.shields.io/github/license/phyberapex/LobbyBinghoe)
![GitHub issues](https://img.shields.io/github/issues/phyberapex/LobbyBinghoe)
![GitHub Release](https://img.shields.io/github/v/release/phyberapex/LobbyBinghoe)
![vue](https://img.shields.io/badge/vue-3.x-green)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/phyberapex/LobbyBinghoe)
![Website](https://img.shields.io/website?url=http%3A//bingo.phyberapex.de/)

Deployed at [https://lobby-binghoe.netlify.app](https://lobby-binghoe.netlify.app/)

## Setup

### Environment Variables

This project uses environment variables for optional features. Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

#### Analytics (Optional)

The project supports [Umami](https://umami.is/) analytics for privacy-focused, self-hosted web analytics:

- `VITE_UMAMI_SCRIPT_URL` - URL to your Umami tracking script (e.g., `https://analytics.phyberapex.de/script.js`)
- `VITE_UMAMI_WEBSITE_ID` - Your website ID from the Umami dashboard

Leave these empty to disable analytics. The site works perfectly without them (useful for local development).

### Local Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start dev server:

   ```bash
   pnpm dev
   ```

3. (Optional) To verify analytics is working:
   - Set the Umami env vars in `.env`
   - Start the dev server
   - Open DevTools → Network tab
   - Check that the Umami script loads (Status 200)
   - Navigate between pages to trigger pageviews

### Production Deployment

When deploying to Netlify (or other platforms):

1. Set environment variables in your hosting platform's dashboard
2. Ensure variables are prefixed with `VITE_` (required for Vite)
3. Deploy/redeploy the site
4. Verify in Umami dashboard → Realtime view that pageviews appear
