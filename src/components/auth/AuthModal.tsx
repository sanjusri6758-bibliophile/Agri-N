import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Tractor,
  GraduationCap,
  Microscope,
  Globe,
  Sparkles,
  ArrowRight,
  User as UserIcon,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { UserRole, LanguageCode } from '../../types/index.js';
import { api } from '../../services/api.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole }) => {
  const { loginWithUser, loginAsRole, isDemoMode, language, setLanguage } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('phone');
  const [name, setName] = useState('Ramesh Patel');
  const [email, setEmail] = useState('ramesh.patel@agrin-brics.org');
  const [phone, setPhone] = useState('9876543210');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [demoReceivedOtp, setDemoReceivedOtp] = useState<string | null>('123456');
  const [countdown, setCountdown] = useState(180);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    setIsLoading(true);

    try {
      const res = await api.requestOtp(phone, countryCode, name, email);
      if (res.success) {
        setStep('otp');
        setCountdown(180);
        if (res.demoOtp) {
          setDemoReceivedOtp(res.demoOtp);
          setOtp(res.demoOtp); // prefill demo OTP for convenience
        }
      } else {
        setErrorMessage(res.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await api.verifyOtp(phone, otp, name, email);
      if (res.success) {
        setVerifiedUser(res.user);
        setStep('role');
      } else {
        setErrorMessage(res.message || 'Invalid OTP code');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      if (verifiedUser) {
        const res = await api.setRole({
          userId: verifiedUser.id,
          role,
          name,
          email,
          language
        });
        loginWithUser(res.user || { ...verifiedUser, name, email, role });
      } else {
        await loginAsRole(role);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to set role');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BRICS AgrIn Secure Access</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {step === 'phone' && 'Sign In to AgriN Network'}
            {step === 'otp' && 'Verify 6-Digit Code'}
            {step === 'role' && 'Select Your Role'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            {step === 'phone' && 'Verified farmer, researcher, and student digital identity for agro-advisories'}
            {step === 'otp' && `Enter the OTP sent to ${countryCode} ${phone}`}
            {step === 'role' && 'Customizes your dashboard, algorithms, and telemetry views'}
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-center justify-between">
          <span className="font-semibold">⚡ Quick Demo Preview:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => loginAsRole('farmer')}
              className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 font-bold text-amber-950 text-[10px]"
            >
              Farmer
            </button>
            <button
              onClick={() => loginAsRole('researcher')}
              className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 font-bold text-amber-950 text-[10px]"
            >
              Researcher
            </button>
            <button
              onClick={() => loginAsRole('student')}
              className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 font-bold text-amber-950 text-[10px]"
            >
              Student
            </button>
          </div>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Name, Email & Phone number */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 bg-white">
                  <UserIcon className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    required
                    className="flex-1 text-sm text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 bg-white">
                  <Mail className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. ramesh.patel@agrin-brics.org"
                    required
                    className="flex-1 text-sm text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <div className="flex rounded-xl border border-stone-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="bg-stone-50 border-r border-stone-300 px-2.5 py-2 text-xs font-semibold text-stone-700 focus:outline-none"
                  >
                    <option value="+91">🇮🇳 +91 (India)</option>
                    <option value="+55">🇧🇷 +55 (Brazil)</option>
                    <option value="+7">🇷🇺 +7 (Russia)</option>
                    <option value="+86">🇨🇳 +86 (China)</option>
                    <option value="+27">🇿🇦 +27 (South Africa)</option>
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit phone number"
                    required
                    className="flex-1 px-3 py-2 text-sm text-stone-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1 flex justify-between">
                  <span>Demo phone: <strong className="font-mono text-emerald-800">9876543210</strong></span>
                  <span>Demo OTP: <strong className="font-mono text-emerald-800">123456</strong></span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  required
                  className="w-full tracking-widest text-center font-mono font-bold text-2xl py-3 px-4 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />

                {isDemoMode && demoReceivedOtp && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <span className="font-semibold">DEMO OTP GENERATED:</span>
                    <span className="font-mono font-extrabold text-sm tracking-wider bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {demoReceivedOtp}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Valid for: {formatCountdown(countdown)}</span>
                </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={countdown > 120}
                  className="font-semibold text-emerald-700 hover:underline disabled:text-stone-400"
                >
                  Resend OTP
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Change Phone
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Role Selection */}
          {step === 'role' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Phone verified successfully. Please select your role to proceed:</span>
              </div>

              <div className="space-y-2.5">
                {/* Farmer */}
                <button
                  onClick={() => handleSelectRole('farmer')}
                  className="w-full p-3.5 rounded-2xl border-2 border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900 group-hover:text-emerald-800">
                      1. Farmer
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Personalized farm telemetry, thunderstorm SMS alerts, NDVI satellite scans, and AI crop doctor.
                    </div>
                  </div>
                </button>

                {/* Researcher */}
                <button
                  onClick={() => handleSelectRole('researcher')}
                  className="w-full p-3.5 rounded-2xl border-2 border-stone-200 hover:border-indigo-600 hover:bg-indigo-50/50 text-left transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900 group-hover:text-indigo-800">
                      2. Agricultural Researcher
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Federated BRICS registry datasets, cross-country agronomy trends, and student observation validation.
                    </div>
                  </div>
                </button>

                {/* Student */}
                <button
                  onClick={() => handleSelectRole('student')}
                  className="w-full p-3.5 rounded-2xl border-2 border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 text-left transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900 group-hover:text-amber-800">
                      3. B.Sc Agriculture Student
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Agro-pathology learning library, field diary submission, AI tutoring, and research internships.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
