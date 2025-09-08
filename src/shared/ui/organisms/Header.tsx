"use client";

import { useSession } from "next-auth/react";
import { User, Plus, LogOut, Sparkles } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
  onLogout: () => void;
}

export default function Header({ onUploadClick, onLogout }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-container">
              <Sparkles className="logo-icon" />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Prism Memory</h1>
            </div>
          </div>

          <div className="header-actions">
            <button className="action-button primary" onClick={onUploadClick}>
              <Plus className="button-icon" />
              <span className="button-text">업로드</span>
            </button>

            {session?.user && (
              <div className="user-section">
                <div className="user-info">
                  <User className="user-icon" />
                  <span className="user-email">{session.user.email}</span>
                </div>
                <button className="action-button secondary" onClick={onLogout}>
                  <LogOut className="button-icon" />
                  <span className="button-text">로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}