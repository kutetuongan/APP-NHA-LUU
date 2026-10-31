import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Trophy,
  Copy,
  Check,
  Sparkles,
  Ticket,
  ArrowLeft
} from 'lucide-react';
import { GameData } from '../types';
import { soundManager } from '../utils/audio';

// Extend window for requested callbacks
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: { score: number; timestamp: string }) => void;
  }
}

interface FlappyGameSectionProps {
  data: GameData;
  onBackToMenu?: () => void;
}

// Global Configuration constants per PDF requirements
const WIN_SCORE = 20;
const GRAVITY = 0.28;
const JUMP_FORCE = -5.8;
const PIPE_SPEED = 2.1;
const PIPE_GAP = 160; // Generous gap for casual banking customers
const PIPE_SPAWN_INTERVAL = 130; // frames
const VOUCHER_TEXT = 'Voucher 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

export const FlappyGameSection: React.FC<FlappyGameSectionProps> = ({
  data,
  onBackToMenu
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game UI States: 'start' | 'playing' | 'win' | 'lose'
  const [gameState, setGameState] = useState<'start' | 'playing' | 'win' | 'lose'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentVoucher, setCurrentVoucher] = useState<string>('');
  const [lastVoucher, setLastVoucher] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(!soundManager.enabled);

  // Internal mutable game loop references
  const loopRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  const hasWonRef = useRef<boolean>(false);

  // Entities
  const birdRef = useRef({
    x: 70,
    y: 200,
    vy: 0,
    radius: 18,
    angle: 0
  });

  const pipesRef = useRef<
    Array<{
      x: number;
      topHeight: number;
      passed: boolean;
    }>
  >([]);

  // Load saved high score and last voucher from localStorage
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('vietinbank_game_highscore');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10));

      const savedVoucher = localStorage.getItem('vietinbank_last_voucher');
      if (savedVoucher) setLastVoucher(savedVoucher);
    } catch {
      // localStorage error safe
    }
  }, []);

  // Voucher generator per specification: VB-XXXXXX (6 random digits)
  const generateVoucherCode = useCallback((): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  }, []);

  // Copy voucher to clipboard
  const copyVoucherCode = useCallback((codeToCopy: string) => {
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  // Dynamic encouragement text based on score
  const getEncouragementText = (s: number) => {
    if (s < 5) return data.encouragements.under5;
    if (s < 10) return data.encouragements['5to9'];
    if (s < 15) return data.encouragements['10to14'];
    if (s < 20) return data.encouragements['15to19'];
    return data.encouragements.at20;
  };

  // Reset Game
  const resetGame = useCallback(() => {
    birdRef.current = {
      x: 70,
      y: 200,
      vy: 0,
      radius: 18,
      angle: 0
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    hasWonRef.current = false;
    setScore(0);
    setIsCopied(false);
  }, []);

  // Win Game
  const winGame = useCallback(() => {
    if (hasWonRef.current) return;
    hasWonRef.current = true;
    setGameState('win');
    soundManager.playWin();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // confetti error safe
    }

    const newVoucher = generateVoucherCode();
    setCurrentVoucher(newVoucher);
    setLastVoucher(newVoucher);

    // Save to localStorage
    try {
      localStorage.setItem('vietinbank_last_voucher', newVoucher);
      localStorage.setItem('vietinbank_game_highscore', '20');
      setHighScore(20);
    } catch {
      // ignore
    }

    // Call window callback if defined
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newVoucher,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [generateVoucherCode]);

  // End Game (Lose)
  const endGame = useCallback((finalScore: number) => {
    setGameState('lose');
    soundManager.playHit();

    // Update high score
    setHighScore((prev) => {
      const newHigh = Math.max(prev, finalScore);
      try {
        localStorage.setItem('vietinbank_game_highscore', newHigh.toString());
      } catch {
        // ignore
      }
      return newHigh;
    });

    // Call window callback if defined
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  // Flap jump action
  const jump = useCallback(() => {
    if (gameState !== 'playing') return;
    birdRef.current.vy = JUMP_FORCE;
    soundManager.playFlap();
  }, [gameState]);

  // Start Game
  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
    birdRef.current.vy = JUMP_FORCE * 0.7;
    soundManager.playFlap();
  }, [resetGame]);

  // Toggle sound
  const handleToggleSound = () => {
    const isNowEnabled = soundManager.toggle();
    setIsMuted(!isNowEnabled);
  };

  // Main Canvas Rendering and Physics Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const gameLoop = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      frameCountRef.current++;

      // Update Bird Physics
      const bird = birdRef.current;
      bird.vy += GRAVITY;
      bird.y += bird.vy;
      bird.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, (bird.vy * 0.08)));

      // Ceiling and Ground Collision
      if (bird.y + bird.radius >= height - 30) {
        // Hit ground
        bird.y = height - 30 - bird.radius;
        endGame(score);
        return;
      }
      if (bird.y - bird.radius <= 0) {
        bird.y = bird.radius;
        bird.vy = 0;
      }

      // Spawn Pipes
      if (frameCountRef.current % PIPE_SPAWN_INTERVAL === 0) {
        const minTop = 60;
        const maxTop = height - PIPE_GAP - 90;
        const topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
        pipesRef.current.push({
          x: width + 20,
          topHeight,
          passed: false
        });
      }

      // Update & Draw Background Sky & Clouds
      ctx.clearRect(0, 0, width, height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.7, '#e0f2fe');
      skyGrad.addColorStop(1, '#f8fafc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Background subtle city/building silhouette (VietinBank aesthetic)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(40, height - 90, 50, 60);
      ctx.fillRect(120, height - 120, 60, 90);
      ctx.fillRect(210, height - 80, 45, 50);
      ctx.fillRect(290, height - 110, 55, 80);
      ctx.fillRect(380, height - 70, 50, 40);

      // Pipes update & check collision
      const currentPipes = pipesRef.current;
      const pipeWidth = 56;

      for (let i = 0; i < currentPipes.length; i++) {
        const p = currentPipes[i];
        p.x -= PIPE_SPEED;

        // Draw Top Pipe (VietinBank Blue theme)
        const topGrad = ctx.createLinearGradient(p.x, 0, p.x + pipeWidth, 0);
        topGrad.addColorStop(0, '#00529b');
        topGrad.addColorStop(0.7, '#0072ce');
        topGrad.addColorStop(1, '#003a6e');

        ctx.fillStyle = topGrad;
        ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
        // Top pipe cap
        ctx.fillStyle = '#003a6e';
        ctx.fillRect(p.x - 4, p.topHeight - 20, pipeWidth + 8, 20);

        // Draw Bottom Pipe
        const bottomY = p.topHeight + PIPE_GAP;
        const bottomHeight = height - bottomY - 30; // Above ground
        ctx.fillStyle = topGrad;
        ctx.fillRect(p.x, bottomY, pipeWidth, bottomHeight);
        // Bottom pipe cap
        ctx.fillStyle = '#003a6e';
        ctx.fillRect(p.x - 4, bottomY, pipeWidth + 8, 20);

        // Check if bird passed pipe
        if (!p.passed && p.x + pipeWidth < bird.x) {
          p.passed = true;
          soundManager.playPoint();
          setScore((prevScore) => {
            const nextScore = prevScore + 1;
            if (nextScore >= WIN_SCORE) {
              winGame();
            }
            return nextScore;
          });
        }

        // Circular Bird vs Rectangle Collision detection
        const birdLeft = bird.x - bird.radius + 3;
        const birdRight = bird.x + bird.radius - 3;
        const birdTop = bird.y - bird.radius + 3;
        const birdBottom = bird.y + bird.radius - 3;

        const inPipeX = birdRight > p.x && birdLeft < p.x + pipeWidth;
        const hitTop = birdTop < p.topHeight;
        const hitBottom = birdBottom > bottomY;

        if (inPipeX && (hitTop || hitBottom)) {
          endGame(score);
          return;
        }
      }

      // Remove off-screen pipes
      pipesRef.current = currentPipes.filter((p) => p.x + pipeWidth > -20);

      // Draw Ground
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, height - 30, width, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, height - 24, width, 24);

      // Draw Player: Flying Bank Card / Mascot
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.angle);

      // Card body (VietinBank Credit/Debit Card look)
      const cardW = 34;
      const cardH = 22;
      const radius = 4;

      // Card drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath();
      ctx.roundRect(-cardW / 2 + 2, -cardH / 2 + 2, cardW, cardH, radius);
      ctx.fill();

      // Card Gradient (VietinBank Red & Blue gradient)
      const cardGrad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
      cardGrad.addColorStop(0, '#00529b');
      cardGrad.addColorStop(0.6, '#0284c7');
      cardGrad.addColorStop(1, '#ed1c24');
      ctx.fillStyle = cardGrad;
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, radius);
      ctx.fill();

      // Chip EMV simulation
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-cardW / 2 + 4, -cardH / 2 + 6, 7, 6);

      // Little cute wing flapping
      ctx.fillStyle = '#ffffff';
      const wingFlap = Math.sin(frameCountRef.current * 0.3) * 6;
      ctx.beginPath();
      ctx.ellipse(-4, wingFlap, 8, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Mini text "VB"
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('VB', cardW / 2 - 12, cardH / 2 - 5);

      ctx.restore();

      loopRef.current = requestAnimationFrame(gameLoop);
    };

    loopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [gameState, score, endGame, winGame]);

  // Handle Keyboard Space & Prevent scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          jump();
        } else if (gameState === 'start') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, startGame]);

  return (
    <div
      id="flappy-voucher-game"
      ref={containerRef}
      className="max-w-4xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-200 select-none"
    >
      {/* Top Game Info Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Quay lại danh mục"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {GAME_TITLE}
            </h2>
            <p className="text-xs text-slate-500">
              Vượt qua {WIN_SCORE} thử thách nhận ngay {VOUCHER_TEXT}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              !isMuted
                ? 'bg-sky-50 border-sky-200 text-[#00529b]'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? 'Tắt tiếng' : 'Bật tiếng'}</span>
          </button>
        </div>
      </div>

      {/* Main Game Stage Container */}
      <div className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden max-w-lg mx-auto touch-none">
        {/* In-Game Live HUD (Visible while playing) */}
        {gameState === 'playing' && (
          <div className="absolute top-4 inset-x-4 z-20 pointer-events-none flex flex-col gap-2">
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-xs px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Điểm:</span>
                <span className="text-lg font-black text-[#00529b] tabular-nums">
                  {score}/{WIN_SCORE}
                </span>
              </div>
              <div className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {getEncouragementText(score)}
              </div>
            </div>

            {/* Score Progress Bar (0 to 20) */}
            <div className="w-full bg-slate-200/90 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#00529b] via-sky-500 to-emerald-500 h-full transition-all duration-200"
                style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={460}
          height={560}
          onClick={jump}
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
          className="w-full h-[480px] sm:h-[540px] block cursor-pointer bg-sky-100"
        />

        {/* Screen 1: Start Screen Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-30 flex items-center justify-center p-6 text-center text-white animate-in fade-in">
            <div className="max-w-xs space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00529b] to-[#ed1c24] flex items-center justify-center mx-auto shadow-lg ring-4 ring-white/20">
                <Sparkles className="w-8 h-8 text-amber-300" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold tracking-tight">
                  {BRAND_NAME} Kiosk Challenge
                </h3>
                <p className="text-sm font-semibold text-amber-300">
                  {data.description}
                </p>
                <p className="text-xs text-sky-100/90 pt-1">
                  {data.instructions}
                </p>
              </div>

              {lastVoucher && (
                <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs">
                  <span className="text-slate-300 block mb-0.5">Mã gần nhất Quý khách đã nhận:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm tracking-widest">
                    {lastVoucher}
                  </span>
                </div>
              )}

              <button
                onClick={startGame}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#ed1c24] hover:bg-[#d6161d] active:scale-95 text-white font-bold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt Đầu Chơi Ngay</span>
              </button>

              <div className="text-[11px] text-sky-200">
                Chạm màn hình hoặc nhấn phím Space để bay
              </div>
            </div>
          </div>
        )}

        {/* Screen 3: Lose Screen Overlay */}
        {gameState === 'lose' && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs z-30 flex items-center justify-center p-6 text-center text-white animate-in zoom-in-95">
            <div className="max-w-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto">
                <RotateCcw className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold">{data.loseTitle}</h3>
                <p className="text-base font-semibold text-amber-300">
                  Bạn đã vượt qua {score}/{WIN_SCORE} thử thách
                </p>
                <p className="text-xs text-slate-300 pt-1">
                  {data.loseEncouragement}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={startGame}
                  className="w-full py-3 px-5 rounded-xl bg-[#00529b] hover:bg-[#004077] active:scale-95 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Lượt Mới</span>
                </button>
                <button
                  onClick={() => setGameState('start')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
                >
                  Về màn hình chính
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Screen 4: Win Screen Overlay */}
        {gameState === 'win' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/85 to-[#002b54]/95 backdrop-blur-xs z-30 flex items-center justify-center p-6 text-center text-white animate-in zoom-in-95">
            <div className="max-w-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-300/30">
                <Trophy className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-amber-300">{data.winTitle}</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {data.winSubtitle}
                </p>
              </div>

              {/* Voucher Box */}
              <div className="p-4 bg-white/10 border-2 border-amber-400/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-semibold uppercase">
                  <Ticket className="w-4 h-4" />
                  <span>Mã Quà Tặng Độc Quyền</span>
                </div>
                <div className="font-mono text-2xl font-black text-white tracking-widest bg-slate-950/60 py-2 px-3 rounded-xl border border-white/10">
                  {currentVoucher}
                </div>
                <p className="text-[11px] text-sky-100 font-medium">
                  {data.voucherGuide}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => copyVoucherCode(currentVoucher)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-800" />
                      <span>Đã Sao Chép Mã</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao Chép Mã Quà</span>
                    </>
                  )}
                </button>

                <button
                  onClick={startGame}
                  className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
                >
                  Chơi lại lần nữa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* High score and Tips Footer */}
      <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Điểm cao nhất:</span>
          <span className="font-bold text-slate-900 tabular-nums">{highScore}/20</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Phần quà: <strong className="text-slate-800">{VOUCHER_TEXT}</strong>
        </div>
      </div>
    </div>
  );
};
