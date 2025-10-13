/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as functions_helpers from "../functions/helpers.js";
import type * as functions_intakeForms from "../functions/intakeForms.js";
import type * as functions_organizations from "../functions/organizations.js";
import type * as functions_profiles from "../functions/profiles.js";
import type * as functions_users from "../functions/users.js";
import type * as functions_usersettings from "../functions/usersettings.js";
import type * as http from "../http.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "functions/helpers": typeof functions_helpers;
  "functions/intakeForms": typeof functions_intakeForms;
  "functions/organizations": typeof functions_organizations;
  "functions/profiles": typeof functions_profiles;
  "functions/users": typeof functions_users;
  "functions/usersettings": typeof functions_usersettings;
  http: typeof http;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
