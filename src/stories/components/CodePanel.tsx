import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodePanelProps {
  code: string;
  children: React.ReactNode;
}

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 11V3a1 1 0 0 1 1-1h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CODE_FONT = "JetBrains Mono, Fira Code, Cascadia Code, monospace";

const LIGATURE_STYLE: React.CSSProperties = {
  fontVariantLigatures: 'common-ligatures contextual',
  fontFeatureSettings: '"liga" 1, "calt" 1, "kern" 1',
};

// vsDark with our background colour and JetBrains Mono
const codeTheme = {
  ...themes.vsDark,
  plain: {
    ...themes.vsDark.plain,
    backgroundColor: '#1E1E2E',
    fontFamily: CODE_FONT,
    fontSize: '13px',
    lineHeight: '23px',
  },
};

export function CodePanel({ code, children }: CodePanelProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="cpanel">

      {/* ── Tab bar ── */}
      <div className="cpanel__bar">
        <div className="cpanel__tabs">
          <button
            className={`cpanel__tab ${tab === 'preview' ? 'cpanel__tab--active' : ''}`}
            onClick={() => setTab('preview')}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 7h4M4 9.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
            </svg>
            Preview
          </button>

          <button
            className={`cpanel__tab ${tab === 'code' ? 'cpanel__tab--active' : ''}`}
            onClick={() => setTab('code')}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5 5l-3 3 3 3M11 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Code
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {tab === 'preview' ? (
        <div className="cpanel__preview">{children}</div>
      ) : (
        <div className="cpanel__code">

          {/* Floating copy button */}
          <button
            className={`cpanel__copy-btn ${copied ? 'cpanel__copy-btn--done' : ''}`}
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {/* Syntax-highlighted code with line numbers */}
          <Highlight theme={codeTheme} code={code.trim()} language="jsx">
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre
                style={{
                  ...style,
                  ...LIGATURE_STYLE,
                  margin: 0,
                  padding: '22px 72px 22px 0',
                  overflow: 'auto',
                  fontFamily: CODE_FONT,
                  fontSize: '13px',
                  lineHeight: '23px',
                  borderRadius: 0,
                  letterSpacing: 0,
                }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} style={{ display: 'flex' }}>
                    {/* Line number */}
                    <span
                      style={{
                        display: 'inline-block',
                        width: '3.2em',
                        paddingRight: '1.4em',
                        textAlign: 'right',
                        flexShrink: 0,
                        userSelect: 'none',
                        color: 'rgba(205, 214, 244, 0.2)',
                        fontFamily: CODE_FONT,
                        fontSize: '13px',
                        lineHeight: '23px',
                        letterSpacing: 0,
                        fontVariantLigatures: 'none',
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* Code tokens */}
                    <span style={{ paddingLeft: '1em' }}>
                      {line.map((token, key) => (
                        <span
                          key={key}
                          {...getTokenProps({ token })}
                          style={{
                            ...getTokenProps({ token }).style,
                            ...LIGATURE_STYLE,
                            fontFamily: CODE_FONT,
                            fontSize: '13px',
                            lineHeight: '23px',
                            letterSpacing: 0,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>

        </div>
      )}
    </div>
  );
}
