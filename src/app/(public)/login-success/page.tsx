import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LoginSuccessClient from "./LoginSuccessClient";

export default async function LoginSuccessPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isFirstLogin = Boolean((session as any)?.isFirstLogin);

  if (!isFirstLogin) {
    redirect("/onboarding");
  }

  return <LoginSuccessClient isFirstLogin={isFirstLogin} serverNow={Date.now()} />;
}
