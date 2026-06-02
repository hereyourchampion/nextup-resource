const keywords = [
  "LEARN", "CREATE", "GROW", "EXPLORE", "BUILD", "DISCOVER", "INNOVATE", "SHARE", "INSPIRE", "CODE"
];

const colors = [
  "text-primary", "text-secondary", "text-tertiary", "text-quaternary",
  "text-primary", "text-secondary", "text-tertiary", "text-quaternary",
  "text-primary", "text-secondary"
];

const Marquee = () => {
  const items = [...keywords, ...keywords]; // duplicate for seamless loop

  return (
    <div
      className="relative overflow-hidden py-5 border-y-2 border-foreground/80 bg-card"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((word, i) => (
          <span key={i} className="flex items-center mx-4">
            <span className={`text-lg sm:text-xl font-extrabold font-heading ${colors[i % colors.length]}`}>
              {word}
            </span>
            <span className="mx-4 text-foreground/30 text-xl">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
