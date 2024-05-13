# ToDo:

1. Add OpenAI API
2. Add Seeding db


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
