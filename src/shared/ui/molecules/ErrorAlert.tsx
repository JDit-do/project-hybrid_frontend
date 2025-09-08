'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import Button from '@/shared/ui/atoms/Button';
import { cn } from '@/shared/lib/utils';

interface ErrorAlertProps {
  isOpen: boolean;
  message: string;
  code?: string;
  retryCount: number;
  maxRetries: number;
  onRetry?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function ErrorAlert({
  isOpen,
  message,
  code,
  retryCount,
  maxRetries,
  onRetry,
  onClose,
  className,
}: ErrorAlertProps) {
  const canRetry = retryCount < maxRetries;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed top-4 right-4 z-50 max-w-md",
            className
          )}
        >
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  오류가 발생했습니다
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {message}
                </p>
                
                {code && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-mono">
                    오류 코드: {code}
                  </p>
                )}
                
                {retryCount > 0 && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    재시도 횟수: {retryCount}/{maxRetries}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {canRetry && onRetry && (
                  <Button
                    onClick={onRetry}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    재시도
                  </Button>
                )}
                
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
