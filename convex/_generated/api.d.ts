/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics_helpers from "../analytics/helpers.js";
import type * as analytics_mutations from "../analytics/mutations.js";
import type * as analytics_permissions from "../analytics/permissions.js";
import type * as analytics_queries from "../analytics/queries.js";
import type * as auditLogs_helpers from "../auditLogs/helpers.js";
import type * as auditLogs_mutations from "../auditLogs/mutations.js";
import type * as auditLogs_queries from "../auditLogs/queries.js";
import type * as auth from "../auth.js";
import type * as auth_currentUser from "../auth/currentUser.js";
import type * as auth_helpers from "../auth/helpers.js";
import type * as auth_permission from "../auth/permission.js";
import type * as auth_permissions from "../auth/permissions.js";
import type * as auth_validators from "../auth/validators.js";
import type * as categories_helpers from "../categories/helpers.js";
import type * as categories_mutations from "../categories/mutations.js";
import type * as categories_permissions from "../categories/permissions.js";
import type * as categories_queries from "../categories/queries.js";
import type * as categories_validators from "../categories/validators.js";
import type * as convex__generated_api from "../convex/_generated/api.js";
import type * as convex__generated_server from "../convex/_generated/server.js";
import type * as files_helpers from "../files/helpers.js";
import type * as files_mutations from "../files/mutations.js";
import type * as http from "../http.js";
import type * as monitoring_helpers from "../monitoring/helpers.js";
import type * as monitoring_mutations from "../monitoring/mutations.js";
import type * as monitoring_queries from "../monitoring/queries.js";
import type * as notifications_mutations from "../notifications/mutations.js";
import type * as notifications_queries from "../notifications/queries.js";
import type * as orders_helpers from "../orders/helpers.js";
import type * as orders_mutations from "../orders/mutations.js";
import type * as orders_permissions from "../orders/permissions.js";
import type * as orders_queries from "../orders/queries.js";
import type * as orders_tracking from "../orders/tracking.js";
import type * as orders_validators from "../orders/validators.js";
import type * as payments_actions from "../payments/actions.js";
import type * as payments_helpers from "../payments/helpers.js";
import type * as payments_mutations from "../payments/mutations.js";
import type * as payments_permissions from "../payments/permissions.js";
import type * as payments_validators from "../payments/validators.js";
import type * as payments_webhooks from "../payments/webhooks.js";
import type * as products_helpers from "../products/helpers.js";
import type * as products_mutations from "../products/mutations.js";
import type * as products_permissions from "../products/permissions.js";
import type * as products_queries from "../products/queries.js";
import type * as products_validators from "../products/validators.js";
import type * as rateLimit_helpers from "../rateLimit/helpers.js";
import type * as settings_defaults from "../settings/defaults.js";
import type * as settings_helpers from "../settings/helpers.js";
import type * as settings_mutations from "../settings/mutations.js";
import type * as settings_permissions from "../settings/permissions.js";
import type * as settings_queries from "../settings/queries.js";
import type * as settings_validators from "../settings/validators.js";
import type * as shared_helpers from "../shared/helpers.js";
import type * as shared_permissions from "../shared/permissions.js";
import type * as stores_helpers from "../stores/helpers.js";
import type * as stores_mutations from "../stores/mutations.js";
import type * as stores_permissions from "../stores/permissions.js";
import type * as stores_queries from "../stores/queries.js";
import type * as stores_validators from "../stores/validators.js";
import type * as users_helpers from "../users/helpers.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_permissions from "../users/permissions.js";
import type * as users_queries from "../users/queries.js";
import type * as users_validators from "../users/validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "analytics/helpers": typeof analytics_helpers;
  "analytics/mutations": typeof analytics_mutations;
  "analytics/permissions": typeof analytics_permissions;
  "analytics/queries": typeof analytics_queries;
  "auditLogs/helpers": typeof auditLogs_helpers;
  "auditLogs/mutations": typeof auditLogs_mutations;
  "auditLogs/queries": typeof auditLogs_queries;
  auth: typeof auth;
  "auth/currentUser": typeof auth_currentUser;
  "auth/helpers": typeof auth_helpers;
  "auth/permission": typeof auth_permission;
  "auth/permissions": typeof auth_permissions;
  "auth/validators": typeof auth_validators;
  "categories/helpers": typeof categories_helpers;
  "categories/mutations": typeof categories_mutations;
  "categories/permissions": typeof categories_permissions;
  "categories/queries": typeof categories_queries;
  "categories/validators": typeof categories_validators;
  "convex/_generated/api": typeof convex__generated_api;
  "convex/_generated/server": typeof convex__generated_server;
  "files/helpers": typeof files_helpers;
  "files/mutations": typeof files_mutations;
  http: typeof http;
  "monitoring/helpers": typeof monitoring_helpers;
  "monitoring/mutations": typeof monitoring_mutations;
  "monitoring/queries": typeof monitoring_queries;
  "notifications/mutations": typeof notifications_mutations;
  "notifications/queries": typeof notifications_queries;
  "orders/helpers": typeof orders_helpers;
  "orders/mutations": typeof orders_mutations;
  "orders/permissions": typeof orders_permissions;
  "orders/queries": typeof orders_queries;
  "orders/tracking": typeof orders_tracking;
  "orders/validators": typeof orders_validators;
  "payments/actions": typeof payments_actions;
  "payments/helpers": typeof payments_helpers;
  "payments/mutations": typeof payments_mutations;
  "payments/permissions": typeof payments_permissions;
  "payments/validators": typeof payments_validators;
  "payments/webhooks": typeof payments_webhooks;
  "products/helpers": typeof products_helpers;
  "products/mutations": typeof products_mutations;
  "products/permissions": typeof products_permissions;
  "products/queries": typeof products_queries;
  "products/validators": typeof products_validators;
  "rateLimit/helpers": typeof rateLimit_helpers;
  "settings/defaults": typeof settings_defaults;
  "settings/helpers": typeof settings_helpers;
  "settings/mutations": typeof settings_mutations;
  "settings/permissions": typeof settings_permissions;
  "settings/queries": typeof settings_queries;
  "settings/validators": typeof settings_validators;
  "shared/helpers": typeof shared_helpers;
  "shared/permissions": typeof shared_permissions;
  "stores/helpers": typeof stores_helpers;
  "stores/mutations": typeof stores_mutations;
  "stores/permissions": typeof stores_permissions;
  "stores/queries": typeof stores_queries;
  "stores/validators": typeof stores_validators;
  "users/helpers": typeof users_helpers;
  "users/mutations": typeof users_mutations;
  "users/permissions": typeof users_permissions;
  "users/queries": typeof users_queries;
  "users/validators": typeof users_validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
