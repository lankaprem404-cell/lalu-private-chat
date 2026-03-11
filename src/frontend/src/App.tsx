import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Heart, Lock, LogOut, MessageCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGetMessages, useSendMessage } from "./hooks/useQueries";

const CORRECT_PASSWORD = "lalu123";

const HEART_CONFIGS = [
  { left: "10%", duration: "8s", delay: "0s", size: "0.8rem", emoji: "💕" },
  { left: "22%", duration: "10s", delay: "1.5s", size: "1.2rem", emoji: "✨" },
  { left: "34%", duration: "12s", delay: "3s", size: "0.8rem", emoji: "💕" },
  { left: "46%", duration: "14s", delay: "4.5s", size: "1.2rem", emoji: "✨" },
  { left: "58%", duration: "16s", delay: "6s", size: "1.6rem", emoji: "💕" },
  { left: "70%", duration: "18s", delay: "7.5s", size: "0.8rem", emoji: "✨" },
  { left: "82%", duration: "20s", delay: "9s", size: "1.2rem", emoji: "💕" },
  { left: "94%", duration: "22s", delay: "10.5s", size: "1.6rem", emoji: "✨" },
];

const DOT_OPACITIES = [
  { key: "dot-left", opacity: 0.3 },
  { key: "dot-center", opacity: 0.5 },
  { key: "dot-right", opacity: 0.3 },
];

// Floating hearts background
const HeartFloats = () => (
  <div aria-hidden="true">
    {HEART_CONFIGS.map((cfg) => (
      <span
        key={cfg.left}
        className="heart-float text-primary/30"
        style={{
          left: cfg.left,
          animationDuration: cfg.duration,
          animationDelay: cfg.delay,
          fontSize: cfg.size,
        }}
      >
        {cfg.emoji}
      </span>
    ))}
  </div>
);

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Wrong Password! 💔");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="lalu-bg flex items-center justify-center min-h-screen relative overflow-hidden">
      <HeartFloats />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <motion.div
          animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-pink-100 p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Lock className="w-7 h-7 text-primary" />
            </motion.div>
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              💖 LALU Private Login 💖
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Enter your secret password to continue
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input
              data-ocid="login.input"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="pink-glow text-center text-base border-pink-200 focus:border-primary rounded-xl h-12 bg-pink-50/50"
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  data-ocid="login.error_state"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-destructive text-sm text-center font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              data-ocid="login.primary_button"
              onClick={handleLogin}
              className="w-full h-12 rounded-xl btn-pulse text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Heart className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>

          {/* Decorative dots */}
          <div className="flex justify-center gap-2 mt-6">
            {DOT_OPACITIES.map(({ key, opacity }) => (
              <span
                key={key}
                className="w-2 h-2 rounded-full bg-primary"
                style={{ opacity }}
              />
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with{" "}
          <Heart className="inline w-3 h-3 text-primary" /> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// ─── Chat Page ─────────────────────────────────────────────────────────────────
function ChatPage({ onLogout }: { onLogout: () => void }) {
  const [sender, setSender] = useState("");
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useGetMessages();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const msgCount = messages.length;

  // Auto-scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: msgCount triggers scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgCount]);

  const handleSend = () => {
    if (!sender.trim()) {
      toast.error("Please enter your name 💕");
      return;
    }
    if (!text.trim()) {
      toast.error("Write a message first! 💌");
      return;
    }
    sendMessage(
      { sender: sender.trim(), text: text.trim() },
      {
        onSuccess: () => {
          setText("");
          toast.success("Message sent! 💖");
        },
        onError: () => toast.error("Failed to send message 😢"),
      },
    );
  };

  const formatTime = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    const d = new Date(ms);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="lalu-bg flex flex-col min-h-screen relative overflow-hidden">
      <HeartFloats />
      <Toaster position="top-center" />

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm"
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💖</span>
            <h1
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              LALU Private Chat
            </h1>
            <span className="text-xl">💖</span>
          </div>
          <Button
            data-ocid="chat.secondary_button"
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </motion.header>

      {/* Messages */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {isLoading && (
            <div
              data-ocid="chat.loading_state"
              className="flex items-center justify-center py-16 text-muted-foreground"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                💕 Loading messages...
              </motion.div>
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <motion.div
              data-ocid="chat.empty_state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            >
              <MessageCircle className="w-12 h-12 text-primary/30 mb-3" />
              <p className="text-base">No messages yet. Say hello! 💕</p>
              <p className="text-sm mt-1 text-muted-foreground/60">
                Be the first to write something special ✨
              </p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={String(msg.id)}
                data-ocid={`chat.item.${idx + 1}`}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <div className="msg-bubble msg-bubble-other w-fit max-w-[70%]">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary">
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100 shadow-md p-3 space-y-2"
        >
          <Input
            data-ocid="chat.input"
            placeholder="Your name 💕"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="pink-glow border-pink-200 rounded-xl text-sm bg-pink-50/50 h-9"
          />
          <div className="flex gap-2">
            <Input
              data-ocid="chat.textarea"
              placeholder="Write a message... 💌"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              className="pink-glow border-pink-200 rounded-xl text-sm bg-pink-50/50 flex-1 h-9"
            />
            <Button
              data-ocid="chat.primary_button"
              onClick={handleSend}
              disabled={isSending}
              className="btn-pulse rounded-xl h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              {isSending ? (
                <Heart className="w-4 h-4 animate-pulse" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-3 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()}. Built with{" "}
        <Heart className="inline w-3 h-3 text-primary" /> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn ? (
        <motion.div
          key="chat"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <ChatPage onLogout={() => setIsLoggedIn(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.35 }}
        >
          <LoginPage onLogin={() => setIsLoggedIn(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
