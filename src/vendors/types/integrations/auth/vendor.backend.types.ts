import type {
  VendorConfigType,
  VendorProfileType,
} from "@src/vendors/integrations/auth/vendor.types";

export type AuthVendorTokenType = {
  email: string | null;
  image: string | null;
  name: string | null;
  group: string | null;
} | null;

export interface AuthVendorClientInterface {
  getSession: () => AuthVendorTokenType | Promise<AuthVendorTokenType>;
}

export type AuthVendorProfilePersistenceClientConstructorType = new (
  ...args: unknown[]
) => AuthVendorProfilePersistenceClientInterface;

export interface AuthVendorProfilePersistenceClientInterface {
  persistProfile(profile?: VendorProfileType): void;
}

export interface AuthVendorBackendInterface {
  config: VendorConfigType;
  Client: new (...args: unknown[]) => AuthVendorClientInterface;
  ApiRoutes: (...args: unknown[]) => unknown;
}
