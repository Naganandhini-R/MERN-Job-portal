import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn:"https://7cf2f53a1c7fafc53dac278f7e130e35@o4509342504189952.ingest.us.sentry.io/4509342512775168",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],
 // tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

Sentry.profiler.startProfiler();
// You probably do NOT have this line:
export default Sentry;
