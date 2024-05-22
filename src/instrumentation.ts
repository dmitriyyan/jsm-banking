export async function register() {
  const Sentry = await import('@sentry/nextjs');

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // This file configures the initialization of Sentry on the server.
    // The config you add here will be used whenever the server handles a request.
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/

    Sentry.init({
      dsn: 'https://ae7f426605f6217648b998214f09b6b9@o4507220951367680.ingest.de.sentry.io/4507294928666704',

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
      // spotlight: process.env.NODE_ENV === 'development',
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
    // The config you add here will be used whenever one of the edge features is loaded.
    // Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/

    Sentry.init({
      dsn: 'https://ae7f426605f6217648b998214f09b6b9@o4507220951367680.ingest.de.sentry.io/4507294928666704',

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });
  }
}
