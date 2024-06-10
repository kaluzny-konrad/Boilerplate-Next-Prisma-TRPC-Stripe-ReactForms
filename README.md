# ToDo:

1. [X] Add OpenAI API
2. [X] Add Seeding db


# Package Manger:
- used: bun (first 1min 22sec, then 50sec)
other:
- yarn (first 2min, then ?)
- pnpm (first 1min 30sec, then 1min 4sec)
- npm (downloading never finished) 

### Database:
- used: neon
other:
- planetscale

### Uploadthing
(can be same like other projects)

1. <https://uploadthing.com/>
   then .env 

### NextAuth.js:
(best to use diffrent secret for each project - Google Project Name is visible at login page)

1. Google Cloud Console:

- new project
- oauth client id:
  <https://console.cloud.google.com/apis/credentials/oauthclient>
- Web Application
- Javascript origin: <http://localhost:3000> (for local development)
- Redirect URI: <http://localhost:3000/api/auth/callback/google>
+ https://<appName>.vercel.app/api/auth/callback/google

effect: secret to .env.local

### Stripe:
(can be same like other projects)

1. Create account and secret key:
<https://dashboard.stripe.com/>

2. Create webhook for `checkout.session.completed`

3. Test webhook with localtunnel.

effect: secret and webhook secret to .env.local
Remember: to add new created webhook secret (not from local tunnel)


## Seed Database
`npx tsx prisma/seed/seed.ts`

# Updates bun

## Dont update:

## Wait with updates:

- @uploadthing/react": "^6.6.0" -> wait for fix first bugs
- uploadthing@latest -> wait for fix first bugs
- "eslint": "^8.57.0", -> wait for fix bugs from version 9

## Deps

```
bun add @clerk/nextjs@latest @hookform/resolvers@latest @langchain/openai@latest @langchain/pinecone@latest @mantine/hooks@latest @next-auth/prisma-adapter@latest @pinecone-database/pinecone@latest @prisma/client@latest @radix-ui/react-avatar@latest @radix-ui/react-dropdown-menu@latest @radix-ui/react-label@latest @radix-ui/react-slot@latest @tanstack/react-query@latest @trpc/client@latest @trpc/react-query@latest @trpc/server@latest ai@latest axios@latest class-variance-authority@latest clsx@latest date-fns@latest langchain@latest lucide-react@latest nanoid@latest next@latest next-auth@latest next-themes@latest openai@latest react@latest react-dom@latest react-hook-form@latest react-markdown@latest react-textarea-autosize@latest recoil@latest sonner@latest stripe@latest superjson@latest svix@latest tailwind-merge@latest tailwindcss-animate@latest zod@latest
```

## DevDeps

```
bun add --dev @playwright/test@latest @prisma/engines@latest @snaplet/copycat@latest @snaplet/seed@latest @types/node@latest @types/react@latest @types/react-dom@latest eslint-config-next@latest prisma@latest tailwindcss@latest typescript@latest vitest@latest
```
