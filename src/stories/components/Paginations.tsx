/* eslint-disable react-refresh/only-export-components -- story module exports helpers + demos */
import React, { useMemo, useState } from "react";
import "./Paginations.css";

/* ── Range helper ─────────────────────────────────────────────────────── */

export type PageToken = number | "ellipsis";

/**
 * Build a page token list with ellipses (1-based pages).
 * siblingCount = pages adjacent to current; boundaryCount = pages at start/end.
 */
export function getPageItems(
  current: number,
  total: number,
  siblingCount = 1,
  boundaryCount = 1,
): PageToken[] {
  if (total < 1) return [];
  const cur = Math.min(Math.max(1, current), total);

  const range = (start: number, end: number) => {
    const out: number[] = [];
    for (let i = start; i <= end; i += 1) out.push(i);
    return out;
  };

  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3;
  if (total <= totalNumbers) return range(1, total);

  const leftSibling = Math.max(cur - siblingCount, 1);
  const rightSibling = Math.min(cur + siblingCount, total);

  const showLeftEllipsis = leftSibling > boundaryCount + 2;
  const showRightEllipsis = rightSibling < total - (boundaryCount + 1);

  const startPages = range(1, boundaryCount);
  const endPages = range(total - boundaryCount + 1, total);

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = boundaryCount + siblingCount * 2 + 2;
    return [...range(1, leftCount), "ellipsis", ...endPages];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = boundaryCount + siblingCount * 2 + 2;
    return [...startPages, "ellipsis", ...range(total - rightCount + 1, total)];
  }
  return [
    ...startPages,
    "ellipsis",
    ...range(leftSibling, rightSibling),
    "ellipsis",
    ...endPages,
  ];
}

export function clampPage(page: number, total: number): number {
  if (total < 1) return 1;
  return Math.min(Math.max(1, page), total);
}

export function getRecordRange(page: number, pageSize: number, totalItems: number) {
  if (totalItems <= 0) return { start: 0, end: 0 };
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  return { start, end };
}

/* ── Compound primitives ──────────────────────────────────────────────── */

export type PaginationSize = "sm" | "md" | "lg";

export function Pagination({
  children,
  className,
  size = "md",
  responsive = false,
  label = "Pagination",
  ...props
}: React.ComponentPropsWithoutRef<"nav"> & {
  size?: PaginationSize;
  responsive?: boolean;
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={[
        "pg-nav",
        `pg-nav--${size}`,
        responsive ? "pg-nav--responsive" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </nav>
  );
}

export function PaginationContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className={`pg-list ${className ?? ""}`} {...props}>
      {children}
    </ul>
  );
}

export function PaginationItem({
  children,
  className,
  optional,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { optional?: boolean }) {
  return (
    <li
      className={`pg-item${optional ? " pg-item--optional" : ""} ${className ?? ""}`}
      {...props}
    >
      {children}
    </li>
  );
}

export function PaginationEllipsis({
  className,
  label = "More pages",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span className={`pg-ellipsis ${className ?? ""}`} aria-hidden="true">
      …
      <span className="sr-only">{label}</span>
    </span>
  );
}

type LinkProps = {
  children?: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  "aria-label"?: string;
  ghost?: boolean;
};

export function PaginationLink({
  children,
  isActive,
  disabled,
  href,
  onClick,
  className,
  ghost,
  ...rest
}: LinkProps) {
  const cls = [
    "pg-btn",
    isActive ? "pg-btn--active" : "",
    ghost ? "pg-btn--ghost" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={cls}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={disabled || undefined}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PaginationPrevious(props: Omit<LinkProps, "children">) {
  return (
    <PaginationLink aria-label="Go to previous page" ghost {...props}>
      <ChevronLeft />
      <span>Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext(props: Omit<LinkProps, "children">) {
  return (
    <PaginationLink aria-label="Go to next page" ghost {...props}>
      <span>Next</span>
      <ChevronRight />
    </PaginationLink>
  );
}

export function PaginationFirst(props: Omit<LinkProps, "children">) {
  return (
    <PaginationLink aria-label="Go to first page" ghost {...props}>
      <ChevronDoubleLeft />
      <span>First</span>
    </PaginationLink>
  );
}

export function PaginationLast(props: Omit<LinkProps, "children">) {
  return (
    <PaginationLink aria-label="Go to last page" ghost {...props}>
      <span>Last</span>
      <ChevronDoubleRight />
    </PaginationLink>
  );
}

/* Icons */
function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M8.5 3.5L5 7l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M5.5 3.5L9 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDoubleLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7.5 3.5L4 7l3.5 3.5M10.5 3.5L7 7l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDoubleRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3.5 3.5L7 7l-3.5 3.5M6.5 3.5L10 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── High-level PaginationBar ─────────────────────────────────────────── */

export type PaginationBarProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: PaginationSize;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showNumbers?: boolean;
  disabled?: boolean;
  responsive?: boolean;
  /** Use href builder for Link-style routing demos */
  getHref?: (page: number) => string;
  className?: string;
  label?: string;
};

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  size = "md",
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = false,
  showPrevNext = true,
  showNumbers = true,
  disabled = false,
  responsive = false,
  getHref,
  className,
  label,
}: PaginationBarProps) {
  const total = Math.max(0, totalPages);
  const current = clampPage(page, total || 1);
  const items = useMemo(
    () => (total > 0 ? getPageItems(current, total, siblingCount, boundaryCount) : []),
    [current, total, siblingCount, boundaryCount],
  );

  const go = (p: number, e?: React.MouseEvent) => {
    if (disabled) return;
    if (getHref) {
      // allow default navigation unless prevented by demo
      e?.preventDefault();
    }
    const next = clampPage(p, total);
    if (next !== current) onPageChange(next);
  };

  if (total <= 0) return null;

  return (
    <Pagination size={size} responsive={responsive} className={className} label={label}>
      <PaginationContent>
        {showFirstLast && (
          <PaginationItem>
            <PaginationFirst
              disabled={disabled || current <= 1}
              href={getHref?.(1)}
              onClick={(e) => go(1, e)}
            />
          </PaginationItem>
        )}
        {showPrevNext && (
          <PaginationItem>
            <PaginationPrevious
              disabled={disabled || current <= 1}
              href={getHref?.(current - 1)}
              onClick={(e) => go(current - 1, e)}
            />
          </PaginationItem>
        )}
        {showNumbers &&
          items.map((token, i) =>
            token === "ellipsis" ? (
              <PaginationItem key={`e-${i}`} optional>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={token} optional={token !== 1 && token !== total && token !== current}>
                <PaginationLink
                  isActive={token === current}
                  disabled={disabled}
                  href={getHref?.(token)}
                  aria-label={`Page ${token}`}
                  onClick={(e) => go(token, e)}
                >
                  {token}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
        {showPrevNext && (
          <PaginationItem>
            <PaginationNext
              disabled={disabled || current >= total}
              href={getHref?.(current + 1)}
              onClick={(e) => go(current + 1, e)}
            />
          </PaginationItem>
        )}
        {showFirstLast && (
          <PaginationItem>
            <PaginationLast
              disabled={disabled || current >= total}
              href={getHref?.(total)}
              onClick={(e) => go(total, e)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

/* ── Code sample ──────────────────────────────────────────────────────── */

export const PAGINATION_CODE = `// Pagination · supplai Design System
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationBar,
} from './Pagination';

<PaginationBar
  page={page}
  totalPages={20}
  onPageChange={setPage}
  siblingCount={1}
  boundaryCount={1}
  showFirstLast
/>

// Or compose manually with Pagination / PaginationContent / PaginationItem
`;

/* ── Demos ────────────────────────────────────────────────────────────── */

function DemoShell({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return <div className={`pg-demo${center ? " pg-demo--center" : ""}`}>{children}</div>;
}

export function PaginationPlayground() {
  const [totalPages, setTotalPages] = useState(20);
  const [page, setPage] = useState(5);
  const [size, setSize] = useState<PaginationSize>("md");
  const [siblingCount, setSiblingCount] = useState(1);
  const [showFirstLast, setShowFirstLast] = useState(true);
  const [showPrevNext, setShowPrevNext] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const safePage = clampPage(page, totalPages);

  return (
    <div className="pg-play">
      <div className="pg-play-preview">
        <PaginationBar
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          size={size}
          siblingCount={siblingCount}
          showFirstLast={showFirstLast}
          showPrevNext={showPrevNext}
          disabled={disabled}
          responsive
        />
        <span className="pg-meta pg-meta--mono">
          page {safePage} / {totalPages}
        </span>
      </div>
      <div className="pg-play-controls">
        <div className="pg-play-row">
          <span className="pg-play-label">Total pages</span>
          {[5, 10, 20, 40].map((n) => (
            <button
              key={n}
              type="button"
              className={`pg-chip${totalPages === n ? " pg-chip--on" : ""}`}
              onClick={() => {
                setTotalPages(n);
                setPage((p) => clampPage(p, n));
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="pg-play-row">
          <span className="pg-play-label">Size</span>
          {(["sm", "md", "lg"] as PaginationSize[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`pg-chip${size === s ? " pg-chip--on" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="pg-play-row">
          <span className="pg-play-label">Siblings</span>
          {[0, 1, 2].map((n) => (
            <button
              key={n}
              type="button"
              className={`pg-chip${siblingCount === n ? " pg-chip--on" : ""}`}
              onClick={() => setSiblingCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="pg-play-row">
          <span className="pg-play-label">Options</span>
          <button
            type="button"
            className={`pg-chip${showPrevNext ? " pg-chip--on" : ""}`}
            onClick={() => setShowPrevNext((v) => !v)}
          >
            Prev/Next
          </button>
          <button
            type="button"
            className={`pg-chip${showFirstLast ? " pg-chip--on" : ""}`}
            onClick={() => setShowFirstLast((v) => !v)}
          >
            First/Last
          </button>
          <button
            type="button"
            className={`pg-chip${disabled ? " pg-chip--on" : ""}`}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </button>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  const [page, setPage] = useState(1);
  return (
    <DemoShell center>
      <PaginationBar page={page} totalPages={8} onPageChange={setPage} />
      <span className="pg-meta">Page {page} of 8</span>
    </DemoShell>
  );
}

export function NumberedDemo() {
  const [page, setPage] = useState(3);
  return (
    <DemoShell center>
      <PaginationBar
        page={page}
        totalPages={5}
        onPageChange={setPage}
        showPrevNext={false}
        siblingCount={2}
        boundaryCount={1}
      />
    </DemoShell>
  );
}

export function PrevNextDemo() {
  const [page, setPage] = useState(1);
  return (
    <DemoShell center>
      <PaginationBar page={page} totalPages={6} onPageChange={setPage} showNumbers />
      <span className="pg-note">Previous disabled on page 1; Next disabled on last page.</span>
    </DemoShell>
  );
}

export function FirstLastDemo() {
  const [page, setPage] = useState(4);
  return (
    <DemoShell center>
      <PaginationBar
        page={page}
        totalPages={12}
        onPageChange={setPage}
        showFirstLast
        siblingCount={1}
      />
    </DemoShell>
  );
}

export function EllipsisDemo() {
  const [page, setPage] = useState(1);
  return (
    <DemoShell center>
      <PaginationBar
        page={page}
        totalPages={20}
        onPageChange={setPage}
        siblingCount={1}
        boundaryCount={1}
      />
      <div className="pg-play-row">
        {[1, 5, 10, 15, 20].map((p) => (
          <button
            key={p}
            type="button"
            className={`pg-chip${page === p ? " pg-chip--on" : ""}`}
            onClick={() => setPage(p)}
          >
            Go {p}
          </button>
        ))}
      </div>
    </DemoShell>
  );
}

export function DynamicRangeDemo() {
  const [page, setPage] = useState(10);
  return (
    <DemoShell center>
      <PaginationBar
        page={page}
        totalPages={30}
        onPageChange={setPage}
        siblingCount={2}
        boundaryCount={1}
        showFirstLast
      />
      <span className="pg-note">
        Middle pages show neighbours + boundaries; ends collapse ellipsis appropriately.
      </span>
    </DemoShell>
  );
}

export function SizesDemo() {
  const [page, setPage] = useState(2);
  return (
    <DemoShell>
      {(["sm", "md", "lg"] as PaginationSize[]).map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="pg-play-label">{size}</span>
          <PaginationBar
            page={page}
            totalPages={5}
            onPageChange={setPage}
            size={size}
            showPrevNext
          />
        </div>
      ))}
    </DemoShell>
  );
}

export function BoundaryStatesDemo() {
  const [mode, setMode] = useState<"first" | "middle" | "last" | "disabled">("first");
  const page = mode === "first" ? 1 : mode === "last" ? 10 : 5;
  return (
    <DemoShell center>
      <div className="pg-play-row">
        {(["first", "middle", "last", "disabled"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`pg-chip${mode === m ? " pg-chip--on" : ""}`}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
      </div>
      <PaginationBar
        page={page}
        totalPages={10}
        onPageChange={() => {}}
        showFirstLast
        disabled={mode === "disabled"}
      />
    </DemoShell>
  );
}

export function ResponsiveDemo() {
  const [page, setPage] = useState(8);
  return (
    <DemoShell center>
      <PaginationBar
        page={page}
        totalPages={20}
        onPageChange={setPage}
        responsive
        siblingCount={1}
        showFirstLast
      />
      <span className="pg-note">
        Narrow the viewport — optional middle page buttons hide; Prev/Next and edges stay.
      </span>
    </DemoShell>
  );
}

export function PageInfoDemo() {
  const [page, setPage] = useState(3);
  const total = 20;
  return (
    <DemoShell center>
      <span className="pg-meta">
        Page {page} of {total}
      </span>
      <PaginationBar page={page} totalPages={total} onPageChange={setPage} />
    </DemoShell>
  );
}

export function RowsPerPageDemo() {
  const totalItems = 97;
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const [page, setPage] = useState(1);
  const { start, end } = getRecordRange(page, pageSize, totalItems);

  return (
    <DemoShell>
      <div className="pg-toolbar">
        <label className="pg-label-inline">
          Rows per page
          <select
            className="pg-select"
            value={pageSize}
            onChange={(e) => {
              const next = Number(e.target.value);
              const newTotal = Math.max(1, Math.ceil(totalItems / next));
              const firstIndex = (page - 1) * pageSize;
              const nextPage = clampPage(Math.floor(firstIndex / next) + 1, newTotal);
              setPageSize(next);
              setPage(nextPage);
            }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <span className="pg-meta">
          Showing {start}–{end} of {totalItems}
        </span>
      </div>
      <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
    </DemoShell>
  );
}

const SAMPLE_ROWS = Array.from({ length: 100 }, (_, i) => ({
  id: `USR-${String(i + 1).padStart(3, "0")}`,
  name: ["Alex Morgan", "Sam Lee", "Jordan Blake", "Casey Ng", "Riley Chen"][i % 5]!,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Buyer", "Supplier", "Editor"][i % 4]!,
  status: i % 7 === 0 ? "Inactive" : "Active",
}));

export function DataTableDemo() {
  const [pageSize, setPageSize] = useState(10);
  const totalItems = SAMPLE_ROWS.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const [page, setPage] = useState(1);
  const safePage = clampPage(page, totalPages);
  const { start, end } = getRecordRange(safePage, pageSize, totalItems);
  const rows = SAMPLE_ROWS.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <DemoShell>
      <div className="pg-table-wrap">
        <table className="pg-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.role}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pg-toolbar">
        <label className="pg-label-inline">
          Rows
          <select
            className="pg-select"
            value={pageSize}
            onChange={(e) => {
              const next = Number(e.target.value);
              const newTotal = Math.max(1, Math.ceil(totalItems / next));
              const firstIndex = (safePage - 1) * pageSize;
              setPageSize(next);
              setPage(clampPage(Math.floor(firstIndex / next) + 1, newTotal));
            }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <span className="pg-meta">
          Showing {start}–{end} of {totalItems} results
        </span>
        <PaginationBar page={safePage} totalPages={totalPages} onPageChange={setPage} size="sm" />
      </div>
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [page, setPage] = useState(4);
  return (
    <DemoShell center>
      <PaginationBar page={page} totalPages={12} onPageChange={setPage} showFirstLast />
      <div className="pg-play-row">
        <button type="button" className="pg-chip" onClick={() => setPage(1)}>
          Set 1
        </button>
        <button type="button" className="pg-chip" onClick={() => setPage(6)}>
          Set 6
        </button>
        <button type="button" className="pg-chip" onClick={() => setPage(12)}>
          Set 12
        </button>
        <span className="pg-meta pg-meta--mono">page: {page}</span>
      </div>
    </DemoShell>
  );
}

export function RoutingDemo() {
  const [page, setPage] = useState(2);
  const href = (p: number) => `?page=${p}`;
  return (
    <DemoShell center>
      <PaginationBar
        page={page}
        totalPages={8}
        onPageChange={setPage}
        getHref={href}
      />
      <span className="pg-meta pg-meta--mono">
        Simulated query: {href(page)} — clicks update local state (no router required in Storybook)
      </span>
      <span className="pg-note">
        In apps, pass real Link hrefs or sync <code>page</code> from your router query.
      </span>
    </DemoShell>
  );
}

export function EmptySingleDemo() {
  return (
    <DemoShell>
      <div>
        <p className="pg-meta" style={{ marginBottom: 8 }}>
          No results
        </p>
        <div className="pg-table-wrap">
          <div className="pg-empty">No records to display</div>
        </div>
        <p className="pg-note" style={{ marginTop: 8 }}>
          Pagination hidden when totalItems = 0.
        </p>
      </div>
      <div>
        <p className="pg-meta" style={{ marginBottom: 8 }}>
          Single page (5 items)
        </p>
        <PaginationBar page={1} totalPages={1} onPageChange={() => {}} showPrevNext />
        <p className="pg-note">Only one page — Prev/Next disabled; optional to hide entirely in apps.</p>
      </div>
      <div>
        <p className="pg-meta" style={{ marginBottom: 8 }}>
          Multi-page
        </p>
        <PaginationBar page={2} totalPages={4} onPageChange={() => {}} />
      </div>
    </DemoShell>
  );
}

export function CardVariantDemo() {
  const [page, setPage] = useState(2);
  return (
    <DemoShell center>
      <div className="pg-card">
        <PaginationBar page={page} totalPages={6} onPageChange={setPage} size="sm" />
      </div>
      <span className="pg-note">Card surface variant — same controls, padded container.</span>
    </DemoShell>
  );
}

export function SpecsDemo() {
  return (
    <div className="pg-specs-grid">
      <div className="pg-spec-card">
        <span className="pg-spec-label">Sizes</span>
        <span className="pg-spec-value">sm 28 · md 32 · lg 40</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Selected</span>
        <span className="pg-spec-value">Brand Blue #4169E1</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Radius</span>
        <span className="pg-spec-value">6px</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Landmark</span>
        <span className="pg-spec-value">nav + aria-label</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Current</span>
        <span className="pg-spec-value">aria-current=&quot;page&quot;</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Pages</span>
        <span className="pg-spec-value">1-based</span>
      </div>
    </div>
  );
}
