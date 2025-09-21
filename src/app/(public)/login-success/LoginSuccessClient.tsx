"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

export interface LoginSuccessClientProps {
  isFirstLogin: boolean;
  serverNow?: number;
}

const LoginSuccessClient: FC<LoginSuccessClientProps> = ({ isFirstLogin }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const navigatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isFirstLogin) return;

    const TOTAL_STEPS = 3; // 3 -> 2 -> 1
    const STEP_MS = 1000; // 1s per step

    if (startedAtRef.current == null) {
      startedAtRef.current = Date.now(); // start from client mount
    }

    const update = () => {
      const elapsedMs = Date.now() - (startedAtRef.current as number);
      const stepIndex = Math.floor(elapsedMs / STEP_MS); // 0,1,2,3
      const remaining = Math.max(0, TOTAL_STEPS - stepIndex);
      setCountdown(remaining);

      // Stepwise progress: 0% -> 33% -> 66% -> 100%
      const p = Math.min(1, stepIndex / TOTAL_STEPS);
      setProgress(p);
    };

    update();
    const id = setInterval(update, 80);
    return () => clearInterval(id);
  }, [isFirstLogin, router]);

  // Immediate redirect exactly when countdown hits 0
  useEffect(() => {
    if (!isFirstLogin) return;
    if (countdown <= 0 && !navigatedRef.current) {
      navigatedRef.current = true;
      router.push("/dashboard");
    }
  }, [isFirstLogin, countdown, router]);

  return (
    <section className={styles.hero}>
      <div className={styles.waitPanel}>
        {isFirstLogin ? (
          <>
            <div className={styles.waitCount}>{countdown}</div>
            <div className={styles.waitText}>AI 앨범 환경을 준비 중입니다...</div>
            <div className={styles.waitBar}>
              <div
                className={styles.waitFill}
                style={{ width: `${Math.round(progress * 100)}%`, transition: "width 0.15s ease" }}
              />
            </div>
            <div className={styles.actions}>
              <button
                className={styles.buttonPrimary}
                onClick={() => router.push("/dashboard")}
              >
                대시보드로 이동
              </button>
              <button
                className={styles.buttonSecondary}
                onClick={() => router.push("/onboarding")}
              >
                온보딩 보기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.waitText}>온보딩으로 이동 중...</div>
            <div className={styles.waitBar}>
              <div className={styles.waitFill} style={{ width: "100%", transition: "width 0.6s ease-in-out" }} />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LoginSuccessClient;


