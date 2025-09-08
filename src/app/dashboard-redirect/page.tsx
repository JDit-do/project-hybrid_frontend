'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/shared/ui/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/molecules/Card';

export default function DashboardRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  // 로그인되지 않은 사용자는 온보딩으로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/onboarding');
    }
  }, [status, router]);

  // 카운트다운 및 자동 리다이렉트
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, session, router]);

  const handleOnboardingClick = () => {
    router.push('/onboarding');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-15 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card variant="glass" className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <span className="text-3xl">✅</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold gradient-text mb-2">
                로그인 완료!
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                환영합니다, {session?.user?.name || session?.user?.email}님!
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 카운트다운 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center space-y-4"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <motion.span
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-white"
                >
                  {countdown}
                </motion.span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {countdown}초 후 대시보드로 자동 이동합니다
              </p>
            </motion.div>

            {/* 액션 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-3"
            >
              <Button
                onClick={handleDashboardClick}
                size="lg"
                variant="modern"
                className="w-full"
              >
                지금 대시보드로 이동
              </Button>
              <Button
                onClick={handleOnboardingClick}
                size="lg"
                variant="outline"
                className="w-full"
              >
                온보딩으로 돌아가기
              </Button>
            </motion.div>

            {/* 추가 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-center pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Prism Memory에서 AI가 분석하는 스마트 앨범을 경험해보세요
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
