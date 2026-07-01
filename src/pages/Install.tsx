```tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, CheckCircle, Share, MoreVertical } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const features = [
    { icon: <Smartphone className="w-5 h-5" strokeWidth={2.5} />, text: "Works offline", color: "border-t-primary" },
    { icon: <Download className="w-5 h-5" strokeWidth={2.5} />, text: "Fast loading", color: "border-t-secondary" },
    { icon: <Monitor className="w-5 h-5" strokeWidth={2.5} />, text: "Full screen", color: "border-t-tertiary" },
    { icon: <CheckCircle className="w-5 h-5" strokeWidth={2.5} />, text: "Auto updates", color: "border-t-quaternary" },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main className="pt-32 pb-20 relative overflow-hidden dot-grid">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* App Icon */}
            <div className="w-24 h-24 rounded-2xl mx-auto mb-8 flex items-center justify-center bg-primary border-2 border-foreground/80 shadow-pop animate-fade-in">
              <span className="text-3xl font-extrabold text-primary-foreground font-heading">N</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-1 font-heading animate-fade-in delay-100">
              Install Nextup Resources
            </h1>
            <SquigglyUnderline color="hsl(var(--quaternary))" width={260} />
            <p className="text-lg text-muted-foreground mb-8 mt-4 animate-fade-in delay-200">
              Get the full app experience on your device.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10 animate-fade-in delay-300">
              {features.map((feature, index) => (
                <div key={index} className={`bg-card border-2 border-foreground/80 rounded-xl p-4 flex items-center gap-3 shadow-pop-soft border-t-4 ${feature.color}`}>
                  <div className="text-primary">{feature.icon}</div>
                  <span className="text-sm font-bold text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* APK Download */}
            <div className="bg-card border-2 border-foreground/80 rounded-2xl p-6 shadow-pop-soft mb-6 animate-fade-in delay-350 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary border-2 border-foreground/80 shadow-pop-soft flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-secondary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-foreground font-heading">Download APK</h2>
                  <p className="text-xs text-muted-foreground">For Android — direct install</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Prefer a native APK? Download and install directly on your Android device. Enable <span className="font-semibold text-foreground">Install from unknown sources</span> in settings if prompted.
              </p>
              <a
                href="https://kklz19o6an7qwti4.public.blob.vercel-storage.com/Nextup%20Resources.apk"
                download="Nextup Resources.apk"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm hover:shadow-pop-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <Download className="w-4 h-4" strokeWidth={2.5} />
                Download APK
              </a>
            </div>

            {isStandalone || isInstalled ? (
              <div className="bg-card border-2 border-foreground/80 rounded-2xl p-8 shadow-pop-soft animate-fade-in delay-400">
                <CheckCircle className="w-16 h-16 text-quaternary mx-auto mb-4" strokeWidth={2.5} />
                <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Already Installed!</h2>
                <p className="text-muted-foreground">You're using the installed version.</p>
              </div>
            ) : isIOS ? (
              <div className="bg-card border-2 border-foreground/80 rounded-2xl p-8 shadow-pop-soft animate-fade-in delay-400">
                <h2 className="text-xl font-bold text-foreground mb-4 font-heading">Install on iOS</h2>
                <div className="space-y-4 text-left">
                  {[
                    { step: "1", title: "Tap the Share button", desc: <span className="flex items-center gap-1">Look for <Share className="w-4 h-4" /> at the bottom of Safari</span> },
                    { step: "2", title: 'Select "Add to Home Screen"', desc: "Scroll down in the share menu" },
                    { step: "3", title: 'Tap "Add"', desc: "The app will appear on your home screen" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 border-2 border-foreground/80 font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : deferredPrompt ? (
              <Button size="xl" onClick={handleInstall} className="animate-fade-in delay-400">
                <Download className="w-5 h-5 mr-2" strokeWidth={2.5} /> Install App
              </Button>
            ) : (
              <div className="bg-card border-2 border-foreground/80 rounded-2xl p-8 shadow-pop-soft animate-fade-in delay-400">
                <h2 className="text-xl font-bold text-foreground mb-4 font-heading">Install on Android</h2>
                <div className="space-y-4 text-left">
                  {[
                    { step: "1", title: "Tap the menu button", desc: <span className="flex items-center gap-1">Look for <MoreVertical className="w-4 h-4" /> in Chrome</span> },
                    { step: "2", title: 'Select "Install app"', desc: "Follow the prompts to install" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 border-2 border-foreground/80 font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Install;
```