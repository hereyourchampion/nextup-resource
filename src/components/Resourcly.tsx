import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Sparkles, Send, Trash2, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMsg = { role: "user" | "assistant"; content: string };

const GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Hey! I'm **Nextup Guide** — ask me about courses, FOSS apps, Material You, Morphe, ebooks, AI tools or anything on the site.",
};

const Resourcly = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        throw new Error(
          "Chat is only available on the deployed site. Preview environments can't run serverless functions."
        );
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "…" }]);
    } catch (e: any) {
      setError(e?.message || "Failed to reach Nextup Guide.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => {
    setMessages([GREETING]);
    setError(null);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Nextup Guide"
          className="fixed z-[60] right-4 bottom-[5.5rem] md:bottom-6 w-14 h-14 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop hover:shadow-pop-hover hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-pop-active transition-all flex items-center justify-center font-heading"
          style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
        </button>
      )}

      {open &&
        createPortal(
          <div
            className="fixed z-[70] right-3 left-3 sm:left-auto sm:right-4 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop flex flex-col overflow-hidden font-body animate-fade-in-up sm:w-[380px]"
            style={{
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)",
              height: "min(560px, calc(100dvh - 8rem))",
            }}
            role="dialog"
            aria-modal="false"
            aria-label="Nextup Guide chat"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-foreground/20 bg-tertiary text-tertiary-foreground shrink-0">
              <div className="w-9 h-9 rounded-full bg-card border-2 border-foreground/80 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold font-heading leading-none">Nextup Guide</p>
                <p className="text-[10px] font-bold opacity-80 mt-0.5">Powered by Sarvam AI</p>
              </div>
              <button
                onClick={clear}
                aria-label="Clear chat"
                className="p-1.5 rounded-full hover:bg-card/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-full hover:bg-card/30 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              aria-live="polite"
              aria-atomic="false"
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-background"
            >
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-br-sm bg-primary text-primary-foreground text-sm font-medium border-2 border-foreground/80 shadow-pop-soft">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start">
                    <div className="max-w-[92%] text-sm text-foreground leading-relaxed prose prose-sm dark:prose-invert prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0 prose-strong:text-foreground prose-a:text-primary">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                )
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="font-medium">Thinking…</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-xs text-destructive font-medium px-3 py-2 rounded-lg bg-destructive/10 border-2 border-destructive/40">
                  {error}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t-2 border-foreground/20 p-2.5 bg-card shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  placeholder="Ask anything about Nextup…"
                  aria-label="Message Nextup Guide"
                  className="flex-1 resize-none bg-background border-2 border-foreground/30 rounded-xl px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors max-h-32"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="w-10 h-10 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-pop-active transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0"
                >
                  <Send className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Resourcly;
