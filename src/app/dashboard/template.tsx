import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div>
      Welcome, {session.user?.email} : {children}
    </div>
  );
}
