import React, { useState } from 'react';
import { LICENSE_KEY_LENGTH, normalizeLicenseInput } from '../constants/license';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Key,
  Lock,
  Crown,
  CheckCircle2,
  AlertCircle,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginSuccessData {
  userName: string;
  licenseKey: string;
  isAdmin: boolean;
  tokens: number;
}

interface LoginScreenProps {
  onLogin: (data: LoginSuccessData) => void;
}

function verifyAdminKey(input: string): boolean {
  if (!__ADMIN_KEY_FNV__) return false;
  const trimmed = input.trim();
  if (trimmed.length !== 10) return false;
  let h = 0x811c9dc5;
  for (let i = 0; i < trimmed.length; i++) {
    h ^= trimmed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) === __ADMIN_KEY_FNV__;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [authKeyInput, setAuthKeyInput] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [creatorName, setCreatorName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const cleanRawKey = authKeyInput.trim();
  const isAdminAuthorized = !__BUYER_BUILD__ && verifyAdminKey(cleanRawKey);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!cleanRawKey) {
      setErrorMessage('인증 키를 입력해주세요.');
      return;
    }

    if (isAdminAuthorized) {
      setIsSuccess(true);
      setAuthKeyInput('');
      setTimeout(() => {
        onLogin({
          userName: creatorName.trim() || '마스터 교사',
          licenseKey: 'KSH-MASTER-ADMIN-SESSION',
          isAdmin: true,
          tokens: 999999999,
        });
      }, 400);
      return;
    }

    const normalized = normalizeLicenseInput(cleanRawKey);
    if (normalized.length !== LICENSE_KEY_LENGTH) {
      setErrorMessage(`키 ${LICENSE_KEY_LENGTH}자리를 모두 입력해 주세요. (현재 ${normalized.length}자)`);
      return;
    }

    if (window.electronAPI?.activateLicense) {
      setIsChecking(true);
      window.electronAPI
        .activateLicense(normalized)
        .then((res) => {
          if (res.success && res.status) {
            setIsSuccess(true);
            setAuthKeyInput('');
            setTimeout(() => {
              onLogin({
                userName: creatorName.trim() || '교사 크리에이터',
                licenseKey: res.status!.keyHint,
                isAdmin: false,
                tokens: res.status!.tokens,
              });
            }, 400);
          } else {
            setErrorMessage(res.error || '유효하지 않은 인증 키입니다. 확인 후 다시 입력해주세요.');
          }
        })
        .catch(() => {
          setErrorMessage('라이선스 확인 중 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
        })
        .finally(() => setIsChecking(false));
      return;
    }

    setErrorMessage('유효하지 않은 인증 키입니다. 확인 후 다시 입력해주세요.');
  };

  return (
    <div className="flex h-screen w-full bg-[#FAF8F3] text-[#14213D] overflow-hidden">
      <div className="m-auto w-full max-w-md p-6">
        <div className="bg-[#FFFDF8] border border-[#CFC6AE] rounded-2xl overflow-hidden shadow-md">
          {/* Top Ink-Navy Book Header */}
          <div className="bg-[#14213D] px-7 py-6 text-white border-b border-[#24365C] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F59E0B] text-[#14213D] flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                Edu-Shorts Studio
              </h1>
              <p className="text-xs text-[#9FB2D4] font-medium">
                에듀쇼츠 스튜디오 · 교사용 9:16 수업 쇼츠 제작 워크북
              </p>
            </div>
          </div>

          <div className="p-7 space-y-5">
            {/* License Status Strip */}
            <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E5DEC9] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1E40AF]" />
                <span className="font-extrabold text-[#14213D]">교사용 라이선스 인증</span>
              </div>
              {isAdminAuthorized ? (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D] flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#B45309]" />
                  마스터 확인됨
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                  인증 대기
                </span>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
              className="space-y-4"
            >
              <div className="space-y-1.5 text-left">
                <label htmlFor="kshorts_secure_auth_token" className="text-xs font-extrabold text-[#14213D] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#1E40AF]" />
                    <span>인증 키</span>
                  </span>
                  <span className="text-[11px] text-[#5C6B85] tabular-nums font-bold">
                    {`${normalizeLicenseInput(cleanRawKey).length} / ${LICENSE_KEY_LENGTH}자`}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    name="kshorts_secure_auth_token"
                    id="kshorts_secure_auth_token"
                    maxLength={40}
                    value={authKeyInput}
                    onChange={(e) => {
                      const sliced = e.target.value.slice(0, 40);
                      setAuthKeyInput(sliced);
                      setErrorMessage('');
                    }}
                    placeholder="발급받은 정품 키 16자리 (XXXX XXXX XXXX XXXX)"
                    autoFocus
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    aria-autocomplete="none"
                    className={`w-full bg-[#FAF8F3] border rounded-lg pl-3.5 pr-11 py-2.5 text-sm text-[#14213D] placeholder-[#5C6B85] focus:outline-none transition-colors tracking-wider tabular-nums ${
                      isAdminAuthorized
                        ? 'border-[#B45309] bg-[#FEF3C7]/40 text-[#78350F] font-extrabold'
                        : errorMessage
                        ? 'border-[#B91C1C] bg-[#FEE2E2]/30'
                        : 'border-[#CFC6AE] focus:border-[#1E40AF] focus:bg-white'
                    }`}
                  />

                  <div className="absolute right-2.5 top-2.5 flex items-center">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 text-[#5C6B85] hover:text-[#14213D] transition-colors rounded"
                      title={showKey ? '입력값 숨기기' : '입력값 보기'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-[#B91C1C] text-[11px] font-bold pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="creator_display_name" className="text-xs font-extrabold text-[#14213D] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>교사 · 강사 호칭 (선택)</span>
                </label>
                <input
                  id="creator_display_name"
                  type="text"
                  name="creator_display_name"
                  autoComplete="off"
                  spellCheck={false}
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="예: 과학 김선생님"
                  className="w-full bg-[#FAF8F3] border border-[#CFC6AE] focus:border-[#1E40AF] focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-[#14213D] placeholder-[#5C6B85] focus:outline-none transition-colors font-semibold"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSuccess || isChecking}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-extrabold text-sm transition-colors bg-[#1E40AF] hover:bg-[#1E3A8A] text-white disabled:opacity-50"
                >
                  {isChecking ? (
                    <span>라이선스 서버 확인 중…</span>
                  ) : isSuccess ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />
                      <span>인증 완료! 수업 연구실 입장 중...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>연구실 입장하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-[#E5DEC9] text-[11px] text-[#5C6B85] flex items-center justify-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              <span>로컬 무료 Edge-TTS · FFmpeg 9:16 수업 영상 합성 내장</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
