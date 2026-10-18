import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';

function GoogleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage({ onNavigate, redirectNotice, onSuccess }) {
  const { login, resetPassword, signInWithGoogle } = useAuth();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const fieldsRef = useRef(null);
  const imageRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Field specific validation errors
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left image fade in
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
        );
      }

      // Card slide up
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' }
        );
      }

      // Fields stagger
      if (fieldsRef.current) {
        gsap.fromTo(
          fieldsRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.2, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    const newErrors = { email: '', password: '', form: '' };
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Please enter your password.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', form: '' });

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await login(email, password);

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else if (onNavigate) {
          onNavigate('home');
        }
      } else {
        setErrors({ email: '', password: '', form: result.error || 'Incorrect email or password.' });
      }
    } catch (err) {
      setErrors({ email: '', password: '', form: getAuthErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrors({ email: '', password: '', form: '' });
    setIsGoogleSubmitting(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else if (onNavigate) {
          onNavigate('home');
        }
      } else if (!result.cancelled) {
        setErrors((prev) => ({ ...prev, form: result.error || 'Failed to sign in with Google.' }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: getAuthErrorMessage(err) }));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetPassword(forgotEmail);
      if (res.success) {
        setForgotSent(true);
      } else {
        setForgotError(res.error || 'Failed to send reset instructions.');
      }
    } catch (err) {
      setForgotError(getAuthErrorMessage(err));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#040906] text-white pt-20 pb-12 px-4 sm:px-8 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-radial from-[#00FF66]/10 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      <div className="max-w-5xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 rounded-3xl glass-panel border border-[#00FF66]/30 shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* ==================================================
            LEFT PANEL: CINEMATIC SPORTS VISUAL (DESKTOP)
           ================================================== */}
        <div ref={imageRef} className="hidden lg:flex relative flex-col justify-between p-10 overflow-hidden bg-black/50">
          <img
            src="/images/stadium_wide.jpg"
            alt="Stadium View"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/60 to-transparent" />

          {/* Top Logo */}
          <div className="relative z-10">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#00FF66] transition-colors group cursor-pointer mb-6"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FF66] to-[#10B981] flex items-center justify-center shadow-md shadow-[#00FF66]/20">
                <span className="font-heading font-black text-lg text-[#040906] tracking-tighter">S</span>
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Sport<span className="text-[#00FF66]">Spot</span>
              </span>
            </div>
          </div>

          {/* Bottom Headline */}
          <div className="relative z-10 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PREMIUM TURF BOOKING</span>
            </span>
            <h2 className="font-heading font-black text-4xl text-white tracking-tight uppercase leading-none">
              FIND YOUR <span className="text-gradient-bright">PLAY</span>
            </h2>
            <p className="text-xs text-gray-300 max-w-sm leading-relaxed font-normal">
              Book professional floodlit arenas, synthetic badminton courts, and top-tier sports turf in seconds.
            </p>
          </div>
        </div>

        {/* ==================================================
            RIGHT PANEL: GLASS AUTHENTICATION FORM CARD
           ================================================== */}
        <div ref={cardRef} className="p-6 sm:p-10 flex flex-col justify-between bg-[#061208]/90 relative">
          
          {/* Mobile Back Button */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-[#00FF66] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="font-heading font-bold text-base text-white">
              Sport<span className="text-[#00FF66]">Spot</span>
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-2 mb-6">
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              WELCOME <span className="text-[#00FF66]">BACK</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Get back in the game.
            </p>
          </div>

          {/* Redirect Notice Message if Protected Route Requested */}
          {redirectNotice && !errors.form && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <Sparkles className="w-4 h-4 shrink-0 text-[#00FF66]" />
              <span>{redirectNotice}</span>
            </div>
          )}

          {/* Form Alert Message */}
          {errors.form && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Input Fields */}
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
            <div ref={fieldsRef} className="space-y-4">
              
              {/* EMAIL FIELD */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest block">
                  EMAIL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4 text-[#00FF66]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled={isSubmitting || isGoogleSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#08180d] border text-xs text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                      errors.email
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-white/10 focus:border-[#00FF66]/60 focus:ring-1 focus:ring-[#00FF66]/40'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 font-semibold pl-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD FIELD WITH EYE TOGGLE */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest block">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    disabled={isSubmitting || isGoogleSubmitting}
                    onClick={() => {
                      setForgotSent(false);
                      setForgotError('');
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] font-bold text-[#00FF66] hover:underline cursor-pointer disabled:opacity-60"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4 text-[#00FF66]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={isSubmitting || isGoogleSubmitting}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl bg-[#08180d] border text-xs text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                      errors.password
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-white/10 focus:border-[#00FF66]/60 focus:ring-1 focus:ring-[#00FF66]/40'
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isSubmitting || isGoogleSubmitting}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 font-semibold pl-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* MAIN CTA BUTTON: Login → */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-[#00FF66]/20 hover:shadow-[#00FF66]/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#040906] border-t-transparent rounded-full animate-spin" />
                      <span>LOGGING IN...</span>
                    </>
                  ) : (
                    <span>Login →</span>
                  )}
                </button>
              </div>

              {/* OR DIVIDER */}
              <div className="relative my-1 flex items-center justify-center">
                <div className="w-full border-t border-white/10" />
                <span className="absolute px-3 bg-[#061208] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  OR
                </span>
              </div>

              {/* GOOGLE SIGN-IN BUTTON */}
              <div>
                <button
                  type="button"
                  id="google-signin-btn"
                  disabled={isSubmitting || isGoogleSubmitting}
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF66]/40 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-[#00FF66]/10 active:scale-[0.99]"
                >
                  {isGoogleSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                      <span>CONNECTING...</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="w-4 h-4" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>

          {/* Bottom Switch Link */}
          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('signup')}
                className="font-bold text-[#00FF66] hover:underline cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </p>
          </div>

        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#061208] border border-[#00FF66]/30 rounded-3xl p-6 text-white space-y-4 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:text-[#00FF66]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-xl text-white">
              Reset Password
            </h3>
            <p className="text-xs text-gray-300">
              Enter your registered email address and we'll send password reset instructions.
            </p>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{forgotError}</span>
              </div>
            )}

            {!forgotSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  disabled={forgotLoading}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    if (forgotError) setForgotError('');
                  }}
                  placeholder="Enter your email address"
                  className="w-full p-3 rounded-xl bg-[#08180d] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF66] disabled:opacity-60"
                  required
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-[#00FF66] text-[#040906] font-bold text-xs uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {forgotLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#040906] border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/30 text-center space-y-2">
                <p className="text-xs font-bold text-[#00FF66]">
                  Instructions sent to {forgotEmail}!
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-lg glass-panel text-xs font-bold text-white mt-2"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
