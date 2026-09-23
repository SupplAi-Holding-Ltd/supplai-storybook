import React, { useMemo, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

type CodePanelProps = {
  code: string;
  children: React.ReactNode;
  /** Shown as the open file tab in the editor chrome */
  filename?: string;
  /** Prism language id */
  language?: 'jsx' | 'tsx' | 'javascript' | 'typescript' | 'css' | 'bash';
  /** Start on the code tab instead of preview */
  defaultTab?: 'preview' | 'code';
};

const CODE_FONT = '"JetBrains Mono", ui-monospace, monospace';
/** Applied to pre, gutters, and every token — keep in sync with global.css */
const CODE_FONT_SIZE = '12px';
const CODE_LINE_HEIGHT = '19px';

const LIGATURE_STYLE: React.CSSProperties = {
  fontVariantLigatures: 'common-ligatures contextual',
  fontFeatureSettings: '"liga" 1, "calt" 1',
};

/** JetBrains-ish dark editor theme on Catppuccin Mocha base */
const editorTheme = {
  ...themes.vsDark,
  plain: {
    ...themes.vsDark.plain,
    backgroundColor: '#1E1E2E',
    color: '#CDD6F4',
    fontFamily: CODE_FONT,
    fontSize: CODE_FONT_SIZE,
    lineHeight: CODE_LINE_HEIGHT,
  },
  styles: [
    ...themes.vsDark.styles,
    { types: ['comment', 'prolog'], style: { color: '#6C7086', fontStyle: 'italic' as const } },
    { types: ['keyword', 'builtin'], style: { color: '#CBA6F7' } },
    { types: ['string', 'attr-value'], style: { color: '#A6E3A1' } },
    { types: ['function'], style: { color: '#89B4FA' } },
    { types: ['number', 'boolean'], style: { color: '#FAB387' } },
    { types: ['tag', 'selector'], style: { color: '#F38BA8' } },
    { types: ['attr-name', 'property'], style: { color: '#89DCEB' } },
    { types: ['operator', 'punctuation'], style: { color: '#94E2D5' } },
    { types: ['class-name', 'maybe-class-name'], style: { color: '#F9E2AF' } },
  ],
};

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 11V3a1 1 0 0 1 1-1h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PreviewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4 7h4M4 9.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
  </svg>
);

const CodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M5 5l-3 3 3 3M11 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 2.5h5.5L13 6v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9.5 2.5V6H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

export function CodePanel({
  code,
  children,
  filename = 'example.tsx',
  language = 'tsx',
  defaultTab = 'preview',
}: CodePanelProps) {
  const [tab, setTab] = useState<'preview' | 'code'>(defaultTab);
  const [copied, setCopied] = useState(false);

  const trimmed = useMemo(() => code.replace(/^\n/, '').replace(/\n$/, ''), [code]);
  const lineCount = useMemo(() => trimmed.split('\n').length, [trimmed]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trimmed);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const langLabel = language.toUpperCase();

  return (
    <div className="cpanel">
      {/* Window chrome */}
      <div className="cpanel__chrome">
        <div className="cpanel__traffic" aria-hidden="true">
          <span className="cpanel__dot cpanel__dot--red" />
          <span className="cpanel__dot cpanel__dot--amber" />
          <span className="cpanel__dot cpanel__dot--green" />
        </div>

        <div className="cpanel__tabs" role="tablist" aria-label="Code panel views">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'preview'}
            className={`cpanel__tab ${tab === 'preview' ? 'cpanel__tab--active' : ''}`}
            onClick={() => setTab('preview')}
          >
            <PreviewIcon />
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'code'}
            className={`cpanel__tab ${tab === 'code' ? 'cpanel__tab--active' : ''}`}
            onClick={() => setTab('code')}
          >
            <CodeIcon />
            Code
          </button>
        </div>

        <div className="cpanel__chrome-spacer" />

        {tab === 'code' && (
          <button
            type="button"
            className={`cpanel__copy ${copied ? 'cpanel__copy--done' : ''}`}
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>

      {/* Editor file tab strip (code view only) */}
      {tab === 'code' && (
        <div className="cpanel__filebar">
          <div className="cpanel__filetab cpanel__filetab--active">
            <FileIcon />
            <span className="cpanel__filename">{filename}</span>
          </div>
          <span className="cpanel__lang-badge">{langLabel}</span>
        </div>
      )}

      {tab === 'preview' ? (
        <div className="cpanel__preview" role="tabpanel">
          {children}
        </div>
      ) : (
        <div className="cpanel__editor" role="tabpanel">
          <Highlight theme={editorTheme} code={trimmed} language={language === 'tsx' ? 'jsx' : language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`cpanel__pre ${className}`}
                style={{
                  ...style,
                  ...LIGATURE_STYLE,
                  margin: 0,
                  background: '#1E1E2E',
                  fontFamily: CODE_FONT,
                  fontSize: CODE_FONT_SIZE,
                  lineHeight: CODE_LINE_HEIGHT,
                }}
              >
                <code
                  className="cpanel__code-root"
                  style={{
                    fontFamily: CODE_FONT,
                    fontSize: CODE_FONT_SIZE,
                    lineHeight: CODE_LINE_HEIGHT,
                  }}
                >
                  {tokens.map((line, i) => (
                    <div
                      key={i}
                      {...getLineProps({ line })}
                      className="cpanel__line"
                      style={{ fontSize: CODE_FONT_SIZE, lineHeight: CODE_LINE_HEIGHT }}
                    >
                      <span
                        className="cpanel__gutter"
                        aria-hidden="true"
                        style={{
                          fontFamily: CODE_FONT,
                          fontSize: CODE_FONT_SIZE,
                          lineHeight: CODE_LINE_HEIGHT,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="cpanel__line-content"
                        style={{
                          fontFamily: CODE_FONT,
                          fontSize: CODE_FONT_SIZE,
                          lineHeight: CODE_LINE_HEIGHT,
                        }}
                      >
                        {line.map((token, key) => {
                          const props = getTokenProps({ token });
                          return (
                            <span
                              key={key}
                              {...props}
                              style={{
                                ...props.style,
                                ...LIGATURE_STYLE,
                                fontFamily: CODE_FONT,
                                fontSize: CODE_FONT_SIZE,
                                lineHeight: CODE_LINE_HEIGHT,
                              }}
                            />
                          );
                        })}
                        {line.length === 0 ? '\n' : null}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            )}
          </Highlight>

          <div className="cpanel__statusbar" aria-hidden="true">
            <span>UTF-8</span>
            <span>{langLabel}</span>
            <span>{lineCount} lines</span>
            <span className="cpanel__statusbar-font">JetBrains Mono</span>
          </div>
        </div>
      )}
    </div>
  );
}
