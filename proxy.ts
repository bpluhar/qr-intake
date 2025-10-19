// middleware.ts
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtected = createRouteMatcher(["/dashboard(.*)"]);
const isSignIn = createRouteMatcher(["/signin"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isProtected(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }

  if (isSignIn(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
