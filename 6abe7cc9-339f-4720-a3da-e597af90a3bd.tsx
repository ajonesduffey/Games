import { useState } from "react";

const COLORS = [
  { id: "crimson", label: "Crimson", hex: "#8B1A1A", mid: "#B22222", glow: "rgba(178,34,34,0.55)" },
  { id: "cobalt",  label: "Cobalt",  hex: "#14366B", mid: "#1A5DAD", glow: "rgba(26,93,173,0.55)" },
  { id: "emerald", label: "Emerald", hex: "#0A5230", mid: "#0F7A48", glow: "rgba(15,122,72,0.55)"  },
  { id: "amber",   label: "Amber",   hex: "#9A5200", mid: "#D4780A", glow: "rgba(212,120,10,0.55)" },
  { id: "violet",  label: "Violet",  hex: "#4A1070", mid: "#7A1FAD", glow: "rgba(122,31,173,0.55)" },
  { id: "teal",    label: "Teal",    hex: "#0A5060", mid: "#0A8090", glow: "rgba(10,128,144,0.55)" },
];

const MAP = Object.fromEntries(COLORS.map(c => [c.id, c]));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Bottle({ colorId, selected, onClick, size = "lg" }) {
  const c = MAP[colorId];
  const w = size === "lg" ? 62 : 30;
  const h = size === "lg" ? 130 : 63;

  return (
    <div
      onClick={onClick}
      title={c.label}
      style={{
        width: w, height: h, flexShrink: 0,
        cursor: onClick ? "pointer" : "default",
        filter: selected
          ? `drop-shadow(0 0 14px ${c.glow}) drop-shadow(0 0 6px ${c.glow})`
          : "drop-shadow(0 3px 6px rgba(0,0,0,0.6))",
        transform: selected ? "translateY(-10px) scale(1.07)" : "none",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <svg viewBox="0 0 60 122" width={w} height={h} overflow="visible">
        {/* Cork top */}
        <rect x="23" y="1" width="14" height="5" rx="2.5" fill="#C4A050" />
        <rect x="21" y="5" width="18" height="8" rx="2.5" fill="#A07830" />
        {/* Neck */}
        <path d="M 22 13 L 20 26 L 40 26 L 38 13 Z"
          fill="rgba(180,220,255,0.07)" stroke="rgba(200,230,255,0.2)" strokeWidth="1.2" />
        {/* Shoulder */}
        <path d="M 20 26 Q 13 34 11 44 L 49 44 Q 47 34 40 26 Z"
          fill="rgba(180,220,255,0.06)" stroke="rgba(200,230,255,0.18)" strokeWidth="1.2" />
        {/* Body */}
        <path d="M 11 44 Q 6 60 6 74 Q 6 107 30 110 Q 54 107 54 74 Q 54 60 49 44 Z"
          fill="rgba(180,220,255,0.06)" stroke="rgba(200,230,255,0.2)" strokeWidth="1.5" />
        {/* Liquid */}
        <path d="M 12 56 Q 7 65 7 75 Q 7 107 30 110 Q 53 107 53 75 Q 53 65 48 56 Z"
          fill={c.hex} opacity="0.93" />
        {/* Liquid top shimmer */}
        <ellipse cx="30" cy="56" rx="18" ry="3" fill="rgba(255,255,255,0.13)" />
        {/* Mid-tone fill for depth */}
        <path d="M 12 56 Q 9 63 9 72 L 13 72 Q 13 63 15 56 Z"
          fill={c.mid} opacity="0.4" />
        {/* Glass highlights */}
        <path d="M 16 30 Q 13 46 13 62" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"
          fill="none" strokeLinecap="round" />
        <path d="M 18 26 L 16 30" stroke="rgba(255,255,255,0.2)" strokeWidth="2"
          fill="none" strokeLinecap="round" />
        {/* Right edge glow */}
        <path d="M 48 48 Q 51 62 51 74" stroke="rgba(255,255,255,0.07)" strokeWidth="2"
          fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function AttemptRow({ attempt, rowNum }) {
  const filledDots = attempt.matches;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 14px",
      background: "rgba(255,255,255,0.025)",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <span style={{
        color: "rgba(220,200,160,0.3)", fontSize: 11,
        fontFamily: "monospace", width: 14, flexShrink: 0,
      }}>{rowNum}</span>
      <div style={{ display: "flex", gap: 5 }}>
        {attempt.arrangement.map((cid, i) => (
          <Bottle key={i} colorId={cid} size="sm" />
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: i < filledDots ? "#E8C84A" : "rgba(255,255,255,0.1)",
              boxShadow: i < filledDots ? "0 0 5px #E8C84A88" : "none",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
        <span style={{
          color: "#E8C84A", fontSize: 13, fontWeight: 600,
          fontFamily: "Georgia, serif", minWidth: 14, textAlign: "right",
        }}>{filledDots}</span>
      </div>
    </div>
  );
}

function Game({ onRestart }) {
  const [solution] = useState(() => shuffle(COLORS.map(c => c.id)));
  const [arrangement, setArrangement] = useState(() => shuffle(COLORS.map(c => c.id)));
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const MAX = 10;
  const remaining = MAX - attempts.length;

  const handleClick = (i) => {
    if (gameOver) return;
    if (selected === null) { setSelected(i); return; }
    if (selected === i) { setSelected(null); return; }
    const next = [...arrangement];
    [next[selected], next[i]] = [next[i], next[selected]];
    setArrangement(next);
    setSelected(null);
  };

  const handleSubmit = () => {
    if (gameOver || attempts.length >= MAX) return;
    const matches = arrangement.filter((c, i) => c === solution[i]).length;
    const next = [...attempts, { arrangement: [...arrangement], matches }];
    setAttempts(next);
    if (matches === 6) { setWon(true); setGameOver(true); }
    else if (next.length >= MAX) { setGameOver(true); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 40% 0%, #0E1F30 0%, #070E18 55%, #040810 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "36px 20px 48px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      color: "#E8DFC8",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{
          fontSize: 10, letterSpacing: 7, color: "#8A7040",
          textTransform: "uppercase", fontFamily: "'Cinzel', serif", marginBottom: 10,
        }}>
          The Alchemist's Trial
        </div>
        <h1 style={{
          fontSize: 38, fontWeight: 300, letterSpacing: 3,
          color: "#E8DFC8", lineHeight: 1.1,
        }}>
          Cipher of Vials
        </h1>
        <p style={{
          marginTop: 8, fontSize: 14, fontStyle: "italic",
          color: "rgba(232,223,200,0.4)", fontWeight: 300,
        }}>
          Arrange the vials to match the hidden formula
        </p>
      </div>

      {/* Attempts tracker */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 26 }}>
        {Array.from({ length: MAX }).map((_, i) => {
          const used = i < attempts.length;
          const isWinDot = won && i === attempts.length - 1;
          return (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: "50%",
              background: isWinDot ? "#58D88A"
                : used ? "rgba(255,255,255,0.13)"
                : "rgba(138,112,64,0.7)",
              boxShadow: !used ? "0 0 5px rgba(138,112,64,0.3)" : "none",
              transition: "all 0.4s ease",
            }} />
          );
        })}
        <span style={{
          marginLeft: 10, fontSize: 11, letterSpacing: 2,
          color: "rgba(232,223,200,0.35)", fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
        }}>
          {remaining} left
        </span>
      </div>

      {/* Main bottle rack */}
      <div style={{
        display: "flex", gap: 14, justifyContent: "center",
        padding: "22px 28px 26px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 22,
        position: "relative",
        backdropFilter: "blur(4px)",
      }}>
        {arrangement.map((cid, i) => (
          <Bottle
            key={i}
            colorId={cid}
            selected={selected === i}
            onClick={() => handleClick(i)}
            size="lg"
          />
        ))}
        {selected !== null && (
          <div style={{
            position: "absolute", bottom: 8, left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9, letterSpacing: 3,
            color: "rgba(232,223,200,0.28)", textTransform: "uppercase",
            whiteSpace: "nowrap", fontFamily: "'Cinzel', serif",
          }}>
            select another vial to swap
          </div>
        )}
      </div>

      {/* Action area */}
      {!gameOver ? (
        <button
          onClick={handleSubmit}
          style={{
            background: "transparent",
            border: "1px solid rgba(138,112,64,0.55)",
            color: "#C4A050",
            padding: "11px 40px",
            fontSize: 11, letterSpacing: 5,
            fontFamily: "'Cinzel', serif",
            textTransform: "uppercase",
            cursor: "pointer", borderRadius: 4,
            marginBottom: 32,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(138,112,64,0.12)";
            e.currentTarget.style.borderColor = "rgba(196,160,80,0.8)";
            e.currentTarget.style.color = "#D4B060";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(138,112,64,0.55)";
            e.currentTarget.style.color = "#C4A050";
          }}
        >
          Submit Formula
        </button>
      ) : (
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {won ? (
            <>
              <div style={{
                fontSize: 22, letterSpacing: 3, color: "#58D88A",
                fontFamily: "'Cinzel', serif", marginBottom: 4,
              }}>
                Formula Solved
              </div>
              <div style={{
                fontSize: 14, fontStyle: "italic",
                color: "rgba(232,223,200,0.45)", marginBottom: 18,
              }}>
                Mastered in {attempts.length} attempt{attempts.length !== 1 ? "s" : ""}
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontSize: 22, letterSpacing: 3, color: "#C0392B",
                fontFamily: "'Cinzel', serif", marginBottom: 6,
              }}>
                Formula Lost
              </div>
              <div style={{
                fontSize: 13, color: "rgba(232,223,200,0.4)",
                marginBottom: 10, fontStyle: "italic",
              }}>
                The hidden order was:
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 18 }}>
                {solution.map((cid, i) => (
                  <Bottle key={i} colorId={cid} size="sm" />
                ))}
              </div>
            </>
          )}
          <button
            onClick={onRestart}
            style={{
              background: "transparent",
              border: "1px solid rgba(138,112,64,0.55)",
              color: "#C4A050",
              padding: "11px 40px",
              fontSize: 11, letterSpacing: 5,
              fontFamily: "'Cinzel', serif",
              textTransform: "uppercase",
              cursor: "pointer", borderRadius: 4,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(138,112,64,0.12)";
              e.currentTarget.style.borderColor = "rgba(196,160,80,0.8)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(138,112,64,0.55)";
            }}
          >
            New Trial
          </button>
        </div>
      )}

      {/* Attempt history */}
      {attempts.length > 0 && (
        <div style={{ width: "100%", maxWidth: 500 }}>
          <div style={{
            fontSize: 9, letterSpacing: 5,
            color: "rgba(232,223,200,0.25)",
            textTransform: "uppercase",
            fontFamily: "'Cinzel', serif",
            textAlign: "center", marginBottom: 10,
          }}>
            Attempt History
          </div>

          {/* Divider */}
          <div style={{
            height: 1, background: "linear-gradient(90deg, transparent, rgba(138,112,64,0.3), transparent)",
            marginBottom: 12,
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[...attempts].reverse().map((a, i) => (
              <AttemptRow key={i} attempt={a} rowNum={attempts.length - i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [key, setKey] = useState(0);
  return <Game key={key} onRestart={() => setKey(k => k + 1)} />;
}
