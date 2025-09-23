"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Brand from "@/shared/ui/molecules/Brand";
import Button from "@/shared/ui/atoms/Button";

import style from "./indext.module.scss";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const hiddenActionPrefixes = ["/login-success", "/login"]; // add more prefixes as needed
  const isHiddenActionsPage = hiddenActionPrefixes.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmed) return;
    setIsLoading(true);
    try {
      await signOut({
        callbackUrl: `/api/auth/logout-redirect`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className={style.wrap}>
      <Brand />

      <div className={style.information}>
        {isMounted && !isHiddenActionsPage && (
          <>
            {session?.user?.email ? (
              <>
                {pathname?.startsWith("/onboarding") ? (
                  <Link href="/dashboard">
                    <Button>대시보드</Button>
                  </Link>
                ) : (
                  <Link href="/onboarding">
                    <Button>온보딩 보기</Button>
                  </Link>
                )}

                <Button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "로그아웃 중..." : "로그아웃"}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>로그인</Button>
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
