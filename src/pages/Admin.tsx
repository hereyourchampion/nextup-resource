import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, KeyRound, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { updatePageMeta } from "@/lib/og-image";

type KeyStatus = { masked: string | null; updated_at: string | null };
type ConfigResponse = {
  keys: Record<string, KeyStatus>;
  env: Record<string, boolean>;
};

const PW_KEY = "nextup:admin_pw";

const Admin = () => {
  const [pw, setPw] = useState<string>(() => sessionStorage.getItem(PW_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [lovableInput, setLovableInput] = useState("");
  const [deepseekInput, setDeepseekInput] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    updatePageMeta({
      title: "Admin · Nextup Resources",
      description: "Admin-only settings for Nextup Resources.",
      noIndex: true,
    });
  }, []);

  const callAdmin = async (method: "GET" | "POST", payload?: unknown) => {
    const { data, error } = await supabase.functions.invoke("admin-config", {
      method,
      headers: { "x-admin-password": pw },
      body: payload,
    });
    if (error) throw new Error(error.message);
    return data as any;
  };

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = (await callAdmin("GET")) as ConfigResponse;
      setConfig(data);
      setAuthed(true);
      sessionStorage.setItem(PW_KEY, pw);
    } catch (e: any) {
      setAuthed(false);
      sessionStorage.removeItem(PW_KEY);
      toast.error(e?.message?.includes("401") || /unauth/i.test(e?.message || "")
        ? "Wrong admin password"
        : e?.message || "Failed to load config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pw) loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    const updates: Record<string, string> = {};
    if (lovableInput.trim()) updates.LOVABLE_API_KEY = lovableInput.trim();
    if (deepseekInput.trim()) updates.DEEPSEEK_API_KEY = deepseekInput.trim();
    if (!Object.keys(updates).length) {
      toast.info("Nothing to save");
      return;
    }
    setLoading(true);
    try {
      await callAdmin("POST", { updates });
      setLovableInput("");
      setDeepseekInput("");
      await loadConfig();
      toast.success("Keys saved");
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const clearKey = async (key: string) => {
    if (!confirm(`Clear ${key}?`)) return;
    setLoading(true);
    try {
      await callAdmin("POST", { updates: { [key]: null } });
      await loadConfig();
      toast.success(`${key} cleared`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to clear");
    } finally {
      setLoading(false);
    }
  };

  const test = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: [{ role: "user", content: "ping — reply with one word" }] },
      });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success(`OK — answered by ${(data as any)?.provider || "unknown"}`);
    } catch (e: any) {
      toast.error(e?.message || "Test failed");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 dot-grid">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 pt-24 sm:pt-28">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <div className="bg-card border-2 border-foreground/80 rounded-2xl shadow-pop p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary border-2 border-foreground/80 shadow-pop flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold">Admin · API keys</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Manage the Lovable AI and DeepSeek keys used by the chat backend. Keys are stored
            server-side and never sent to the browser.
          </p>

          {!authed ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadConfig();
              }}
              className="space-y-3"
            >
              <Label htmlFor="pw">Admin password</Label>
              <Input
                id="pw"
                type="password"
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                aria-label="Admin password"
                autoFocus
              />
              <Button type="submit" disabled={!pw || loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Status */}
              <div className="grid sm:grid-cols-2 gap-3">
                {(["LOVABLE_API_KEY", "DEEPSEEK_API_KEY"] as const).map((k) => {
                  const status = config?.keys[k];
                  const inEnv = config?.env[k];
                  const set = !!status?.masked || !!inEnv;
                  return (
                    <div
                      key={k}
                      className="border-2 border-foreground/30 rounded-xl p-3 bg-background/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm flex items-center gap-2">
                          <KeyRound className="w-4 h-4" />
                          {k === "LOVABLE_API_KEY" ? "Lovable AI" : "DeepSeek"}
                        </div>
                        {set && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
                            <CheckCircle2 className="w-3.5 h-3.5" /> set
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">
                        {status?.masked ?? (inEnv ? "(from environment)" : "not configured")}
                      </div>
                      {status?.masked && (
                        <button
                          onClick={() => clearKey(k)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-destructive hover:underline"
                        >
                          <Trash2 className="w-3 h-3" /> Clear stored value
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Edit */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="lov">New Lovable AI key</Label>
                  <Input
                    id="lov"
                    type="password"
                    placeholder="Paste new key to replace"
                    value={lovableInput}
                    onChange={(e) => setLovableInput(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ds">New DeepSeek key</Label>
                  <Input
                    id="ds"
                    type="password"
                    placeholder="Paste new key to replace"
                    value={deepseekInput}
                    onChange={(e) => setDeepseekInput(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={save} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
                  </Button>
                  <Button variant="outline" onClick={test} disabled={testing}>
                    {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test chat"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      sessionStorage.removeItem(PW_KEY);
                      setPw("");
                      setAuthed(false);
                      setConfig(null);
                    }}
                  >
                    Lock
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Admin;
