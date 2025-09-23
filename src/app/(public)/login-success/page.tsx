import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginSuccessClient from "./LoginSuccessClient";

export default async function LoginSuccessPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isFirstLogin = Boolean((session as { isFirstLogin?: boolean })?.isFirstLogin);

  if (!isFirstLogin) {
    redirect("/onboarding");
  }

  return <LoginSuccessClient isFirstLogin={isFirstLogin} serverNow={Date.now()} />;
}
