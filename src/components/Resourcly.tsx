import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "resourcly-chat-v1";

const Resourcly = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat failed");
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "(no response)" }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${e?.message || "Something went wrong"}` }]);
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

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Resourcly" : "Open Resourcly"}
        className="fixed z-[60] right-4 bottom-[5.5rem] md:bottom-6 w-14 h-14 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform flex items-center justify-center font-heading"
      >
        {open ? <X className="w-6 h-6" strokeWidth={2.5} /> : <MessageCircle className="w-6 h-6" strokeWidth={2.5} />}
      </button>

      {open &&
        createPortal(
          <div className="fixed z-[59] right-4 bottom-[10.5rem] md:bottom-24 w-[min(360px,calc(100vw-2rem))] max-h-[70vh] bg-card border-2 border-foreground/80 rounded-2xl shadow-pop flex flex-col overflow-hidden font-body">
            <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-foreground/20 bg-tertiary text-tertiary-foreground">
              <div className="w-8 h-8 rounded-full bg-card border-2 border-foreground/80 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-extrabold font-heading leading-none">Resourcly</p>
                <p className="text-[10px] font-bold opacity-80">Your Nextup guide</p>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="text-[10px] font-bold underline decoration-wavy underline-offset-2"
                >
                  clear
                </button>
              )}
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-background">
              {messages.length === 0 ? (
                <div className="text-center py-6 px-3">
                  <p className="text-sm font-bold text-foreground font-heading mb-1">Hi! I’m Resourcly 👋</p>
                  <p className="text-xs text-muted-foreground">
                    Ask me anything about Nextup Resources — I'll point you to the right section.
                  </p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] px-3 py-2 rounded-2xl border-2 border-foreground/30 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground border-foreground/80"
                        : "bg-card text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                ))
              )}
              {loading && (
                <div className="bg-card border-2 border-foreground/30 rounded-2xl px-3 py-2 text-sm text-muted-foreground inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              )}
            </div>
            <div className="p-2 border-t-2 border-foreground/20 bg-card flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Ask Resourcly…"
                className="flex-1 resize-none px-3 py-2 rounded-xl border-2 border-foreground/30 focus:border-foreground/80 outline-none text-sm bg-background text-foreground"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="w-10 h-10 shrink-0 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Resourcly;
