import "next-auth";

declare module "next-auth" {
  interface Session {
    id_token?: string;
    access_token?: string;
  }
}

export {};
