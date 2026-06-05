import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Sparkles, Send, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";


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

  const callApi = useCallback(async (history: ChatMsg[]) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("chat", {
        body: { messages: history },
      });
      if (invokeError) throw new Error(invokeError.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      setMessages((m) => [...m, { role: "assistant", content: (data as any)?.reply || "…" }]);
    } catch (e: any) {
      setError(e?.message || "Failed to reach Nextup Guide.");
    } finally {
      setLoading(false);
    }
  }, []);


  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    await callApi(next);
  };

  const retry = async () => {
    if (loading) return;
    // Resend with current history (last message should be a user message)
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    await callApi(messages);
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

  const canRetry = !loading && messages[messages.length - 1]?.role === "user";

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Nextup Guide chat"
          className="fixed z-[60] right-4 bottom-[5.5rem] md:bottom-6 w-14 h-14 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop hover:shadow-pop-hover hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-pop-active transition-all flex items-center justify-center font-heading focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                <p className="text-[10px] font-bold opacity-80 mt-0.5">Powered by Lovable AI</p>
              </div>
              <button
                onClick={clear}
                aria-label="Clear chat history"
                title="Clear chat"
                className="p-1.5 rounded-full hover:bg-card/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                title="Close"
                className="p-1.5 rounded-full hover:bg-card/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
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
                <div className="flex justify-start" aria-label="Nextup Guide is typing">
                  <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-card border-2 border-foreground/20 shadow-pop-soft">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/70 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/70 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/70 animate-bounce"></span>
                  </div>
                </div>
              )}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-destructive/10 border-2 border-destructive/40 px-3 py-2.5 space-y-2"
                >
                  <div className="flex items-start gap-2 text-xs text-destructive font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="leading-snug">{error}</span>
                  </div>
                  {canRetry && (
                    <button
                      onClick={retry}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground border-2 border-foreground/80 shadow-pop-soft hover:-translate-y-0.5 active:translate-y-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                    >
                      <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t-2 border-foreground/20 p-2.5 bg-card shrink-0">
              <div className="flex items-end gap-2">
                <label htmlFor="nextup-guide-input" className="sr-only">
                  Message Nextup Guide
                </label>
                <textarea
                  id="nextup-guide-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  placeholder="Ask anything about Nextup…"
                  className="flex-1 resize-none bg-background border-2 border-foreground/30 rounded-xl px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors max-h-32"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="w-10 h-10 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-pop-active transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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
