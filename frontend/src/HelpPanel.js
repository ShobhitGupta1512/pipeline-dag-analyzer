import React, { useState, useEffect, useRef } from 'react';

const steps = [
  {
    icon: '⬇',
    color: '#4f8ef7',
    title: 'Add Nodes',
    desc: 'Drag any node from the top toolbar onto the canvas.',
    tip: 'Try dragging an Input node first.',
  },
  {
    icon: '⇌',
    color: '#2dd4bf',
    title: 'Connect Nodes',
    desc: 'Drag from an output handle (right dot) to an input handle (left dot) on another node.',
    tip: 'Teal dots = inputs  ·  Amber dots = outputs',
  },
  {
    icon: 'T',
    color: '#2dd4bf',
    title: 'Dynamic Variables',
    desc: 'In a Text node, type {{variableName}} to auto-create an input handle for that variable.',
    tip: 'Example: Hello {{name}} creates a "name" handle.',
  },
  {
    icon: '✕',
    color: '#f43f5e',
    title: 'Delete Connections',
    desc: 'Hover over any connection line and click the red ✕ button that appears.',
    tip: 'To delete a node: click it to select, then press Delete or Backspace.',
  },
  {
    icon: '▶',
    color: '#4f8ef7',
    title: 'Run Pipeline',
    desc: "Click RUN PIPELINE to analyse your graph. An alert shows node count, edge count, and whether it's a valid DAG.",
    tip: 'Make sure the backend is running on port 8000.',
  },
];

const shortcuts = [
  { keys: ['Delete', 'Backspace'], action: 'Delete selected node' },
  { keys: ['Scroll'],              action: 'Zoom in / out'        },
  { keys: ['Click + Drag'],        action: 'Pan the canvas'       },
  { keys: ['Ctrl + Drag'],         action: 'Select multiple nodes'},
];

export const HelpPanel = () => {
  const [open, setOpen]             = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [pulsed, setPulsed]         = useState(false);
  const panelRef                    = useRef(null);
  const btnRef                      = useRef(null);

  /* Close when user clicks anywhere outside the panel + button */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current   && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    // slight delay so the open-click itself doesn't immediately close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setPulsed(true);
  };

  const step = steps[activeStep];

  return (
    <>
      <style>{`
        @keyframes helpPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(79,142,247,0.4); transform: scale(1);    }
          50%       { box-shadow: 0 4px 28px rgba(79,142,247,0.8); transform: scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* ── ? button ── */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        title="Open help guide"
        style={{
          ...helpBtnStyle,
          animation: !pulsed ? 'helpPulse 2s ease-in-out infinite' : 'none',
        }}
      >
        ?
      </button>

      {/* ── Panel ── */}
      {open && (
        <div ref={panelRef} style={panelStyle}>

          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={headerIcon}>?</span>
              <span style={headerTitle}>Quick Guide</span>
            </div>
            <button onClick={() => setOpen(false)} style={closeBtn} title="Close">✕</button>
          </div>

          {/* Dots */}
          <div style={dotsRow}>
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                style={dotBtn(i === activeStep, s.color)}
                title={s.title}
              />
            ))}
          </div>

          {/* Card */}
          <div style={cardStyle(step.color)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={cardIcon(step.color)}>{step.icon}</div>
              <div style={cardTitle}>{step.title}</div>
            </div>
            <div style={cardDesc}>{step.desc}</div>
            <div style={cardTip}>
              <span style={tipLabel}>TIP</span>
              {step.tip}
            </div>
          </div>

          {/* Nav */}
          <div style={navRow}>
            <button
              style={navBtn(activeStep > 0)}
              onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
              disabled={activeStep === 0}
            >
              ← Prev
            </button>
            <span style={stepCount}>{activeStep + 1} / {steps.length}</span>
            <button
              style={navBtn(activeStep < steps.length - 1)}
              onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))}
              disabled={activeStep === steps.length - 1}
            >
              Next →
            </button>
          </div>

          <div style={divider} />

          {/* Shortcuts */}
          <div style={shortcutTitle}>Keyboard &amp; Mouse</div>
          {shortcuts.map((s, i) => (
            <div key={i} style={shortcutRow}>
              <div style={keysGroup}>
                {s.keys.map((k) => <span key={k} style={keyBadge}>{k}</span>)}
              </div>
              <span style={shortcutAction}>{s.action}</span>
            </div>
          ))}

          <div style={{ height: 10 }} />
        </div>
      )}
    </>
  );
};

/* ─── Styles ─── */

const helpBtnStyle = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  width: 42,
  height: 42,
  borderRadius: '50%',
  background: '#4f8ef7',
  color: '#fff',
  border: 'none',
  fontSize: 20,
  fontWeight: 700,
  cursor: 'pointer',
  zIndex: 300,
  fontFamily: 'Syne, sans-serif',
  lineHeight: 1,
};

const panelStyle = {
  position: 'fixed',
  bottom: 78,
  right: 24,
  width: 284,
  background: '#13161d',
  border: '1px solid #2e3347',
  borderRadius: 12,
  boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
  zIndex: 299,
  fontFamily: 'JetBrains Mono, monospace',
  animation: 'slideUp 0.22s ease',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 14px 10px',
  borderBottom: '1px solid #2e3347',
  background: '#1f2433',
  borderRadius: '12px 12px 0 0',
};

const headerIcon = {
  width: 22,
  height: 22,
  borderRadius: '50%',
  background: '#4f8ef7',
  color: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 700,
  fontFamily: 'Syne, sans-serif',
  flexShrink: 0,
};

const headerTitle = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 700,
  fontSize: 13,
  color: '#e8eaf0',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const closeBtn = {
  background: 'transparent',
  border: 'none',
  color: '#8b92a8',
  cursor: 'pointer',
  fontSize: 13,
  padding: '2px 6px',
  borderRadius: 4,
  lineHeight: 1,
};

const dotsRow = {
  display: 'flex',
  justifyContent: 'center',
  gap: 6,
  padding: '10px 14px 4px',
};

const dotBtn = (active, color) => ({
  width: active ? 22 : 8,
  height: 8,
  borderRadius: 4,
  background: active ? color : '#2e3347',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  transition: 'all 0.2s ease',
});

const cardStyle = (color) => ({
  margin: '8px 12px',
  background: '#1a1e28',
  border: `1px solid ${color}33`,
  borderLeft: `3px solid ${color}`,
  borderRadius: 8,
  padding: '10px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
});

const cardIcon = (color) => ({
  width: 28,
  height: 28,
  borderRadius: 6,
  background: color + '22',
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'Syne, sans-serif',
  flexShrink: 0,
});

const cardTitle = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 700,
  fontSize: 13,
  color: '#e8eaf0',
};

const cardDesc = {
  fontSize: 11,
  color: '#8b92a8',
  lineHeight: 1.65,
};

const cardTip = {
  fontSize: 10,
  color: '#4a5068',
  lineHeight: 1.55,
  display: 'flex',
  gap: 6,
  alignItems: 'flex-start',
};

const tipLabel = {
  background: '#2a2f3d',
  color: '#6b7280',
  borderRadius: 3,
  padding: '1px 5px',
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.06em',
  flexShrink: 0,
  marginTop: 1,
};

const navRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 12px 10px',
};

const navBtn = (enabled) => ({
  background: 'transparent',
  border: '1px solid #2e3347',
  borderRadius: 6,
  color: enabled ? '#e8eaf0' : '#2e3347',
  cursor: enabled ? 'pointer' : 'default',
  fontSize: 10,
  padding: '4px 10px',
  fontFamily: 'Syne, sans-serif',
  fontWeight: 600,
  transition: 'all 0.15s ease',
});

const stepCount = { fontSize: 10, color: '#4a5068' };

const divider = {
  height: 1,
  background: '#2e3347',
  margin: '0 12px 10px',
};

const shortcutTitle = {
  fontSize: 9,
  color: '#4a5068',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '0 14px 6px',
  fontWeight: 700,
};

const shortcutRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '3px 14px',
  marginBottom: 3,
};

const keysGroup = { display: 'flex', gap: 4 };

const keyBadge = {
  background: '#1f2433',
  border: '1px solid #2e3347',
  borderRadius: 4,
  padding: '2px 6px',
  fontSize: 9,
  color: '#8b92a8',
  whiteSpace: 'nowrap',
};

const shortcutAction = {
  fontSize: 10,
  color: '#4a5068',
  textAlign: 'right',
};      