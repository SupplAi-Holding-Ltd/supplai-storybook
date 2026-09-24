/* eslint-disable react-refresh/only-export-components -- story module exports helpers + demos */
import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import "./FileUploads.css";

/* ── Types & helpers ──────────────────────────────────────────────────── */

export type FileStatus = "idle" | "pending" | "uploading" | "success" | "error";

export type UploadEntry = {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
  previewUrl?: string;
};

export type FileRejectReason = "type" | "size" | "maxFiles" | "duplicate";

export type FileReject = {
  file: File;
  reason: FileRejectReason;
  message: string;
};

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function matchesAccept(file: File, accept?: string): boolean {
  if (!accept || accept.trim() === "" || accept === "*/*") return true;
  const tokens = accept.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1);
      return type.startsWith(prefix);
    }
    return type === token;
  });
}

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function makeId(): string {
  return `fu-${Math.random().toString(36).slice(2, 10)}`;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);
}

/* ── Context ──────────────────────────────────────────────────────────── */

type FileUploadContextValue = {
  entries: UploadEntry[];
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple: boolean;
  disabled: boolean;
  dragging: boolean;
  dragReject: boolean;
  errors: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  openPicker: () => void;
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clear: () => void;
  setDragging: (v: boolean, reject?: boolean) => void;
  updateEntry: (id: string, patch: Partial<UploadEntry>) => void;
  simulateUpload: (opts?: { failIds?: string[] }) => void;
};

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFU(): FileUploadContextValue {
  const ctx = React.useContext(FileUploadContext);
  if (!ctx) throw new Error("FileUpload components must be used within <FileUpload>");
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────────── */

export type FileUploadProps = {
  children: React.ReactNode;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  onFileReject?: (rejects: FileReject[]) => void;
  className?: string;
};

export function FileUpload({
  children,
  accept,
  maxSize,
  maxFiles,
  multiple = false,
  disabled = false,
  value,
  defaultValue,
  onValueChange,
  onFileReject,
  className,
}: FileUploadProps) {
  const isControlled = value !== undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState<UploadEntry[]>(() =>
    (defaultValue ?? []).map((file) => ({
      id: makeId(),
      file,
      status: "idle" as const,
      progress: 0,
      previewUrl: isImageFile(file) ? URL.createObjectURL(file) : undefined,
    })),
  );
  const [dragging, setDraggingState] = useState(false);
  const [dragReject, setDragReject] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const revokePreview = (entry?: UploadEntry) => {
    if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
  };

  // When controlled, align internal list to the parent File[] (preview URLs preserved by key).
  /* eslint-disable react-hooks/set-state-in-effect -- controlled value sync */
  useEffect(() => {
    if (!isControlled) return;
    const nextFiles = value ?? [];
    setInternal((prev) => {
      const nextKeys = new Set(nextFiles.map(fileKey));
      const same =
        prev.length === nextFiles.length &&
        prev.every((e, i) => fileKey(e.file) === fileKey(nextFiles[i]!));
      if (same) return prev;
      prev.forEach((e) => {
        if (!nextKeys.has(fileKey(e.file))) revokePreview(e);
      });
      return nextFiles.map((file) => {
        const existing = prev.find((e) => fileKey(e.file) === fileKey(file));
        if (existing) return { ...existing, file };
        return {
          id: makeId(),
          file,
          status: "idle" as const,
          progress: 0,
          previewUrl: isImageFile(file) ? URL.createObjectURL(file) : undefined,
        };
      });
    });
  }, [isControlled, value]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const entries = internal;

  const commit = useCallback(
    (next: UploadEntry[]) => {
      setInternal(next);
      onValueChange?.(next.map((e) => e.file));
    },
    [onValueChange],
  );

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      if (disabled) return;
      const incoming = Array.from(list);
      if (incoming.length === 0) return;

      const rejects: FileReject[] = [];
      const accepted: File[] = [];
      const existingKeys = new Set(entries.map((e) => fileKey(e.file)));
      let remainingSlots =
        maxFiles !== undefined ? Math.max(0, maxFiles - entries.length) : Infinity;

      for (const file of incoming) {
        if (!multiple && entries.length + accepted.length >= 1) {
          rejects.push({
            file,
            reason: "maxFiles",
            message: `"${file.name}" was skipped — only one file is allowed.`,
          });
          continue;
        }
        if (remainingSlots <= 0) {
          rejects.push({
            file,
            reason: "maxFiles",
            message: `"${file.name}" was skipped — maximum of ${maxFiles} files.`,
          });
          continue;
        }
        if (!matchesAccept(file, accept)) {
          rejects.push({
            file,
            reason: "type",
            message: `"${file.name}" is not an accepted file type.`,
          });
          continue;
        }
        if (maxSize !== undefined && file.size > maxSize) {
          rejects.push({
            file,
            reason: "size",
            message: `"${file.name}" exceeds ${formatBytes(maxSize)}.`,
          });
          continue;
        }
        if (existingKeys.has(fileKey(file))) {
          rejects.push({
            file,
            reason: "duplicate",
            message: `"${file.name}" is already selected.`,
          });
          continue;
        }
        accepted.push(file);
        existingKeys.add(fileKey(file));
        remainingSlots -= 1;
      }

      if (rejects.length) {
        const msgs = rejects.map((r) => r.message);
        setErrors(msgs);
        onFileReject?.(rejects);
      } else {
        setErrors([]);
      }

      if (accepted.length === 0) return;

      const nextEntries = multiple
        ? [
            ...entries,
            ...accepted.map((file) => ({
              id: makeId(),
              file,
              status: "idle" as const,
              progress: 0,
              previewUrl: isImageFile(file) ? URL.createObjectURL(file) : undefined,
            })),
          ]
        : [
            (() => {
              entries.forEach(revokePreview);
              const file = accepted[0]!;
              return {
                id: makeId(),
                file,
                status: "idle" as const,
                progress: 0,
                previewUrl: isImageFile(file) ? URL.createObjectURL(file) : undefined,
              };
            })(),
          ];

      commit(nextEntries);
      if (inputRef.current) inputRef.current.value = "";
    },
    [disabled, entries, maxFiles, multiple, accept, maxSize, onFileReject, commit],
  );

  const removeFile = useCallback(
    (id: string) => {
      const target = entries.find((e) => e.id === id);
      revokePreview(target);
      commit(entries.filter((e) => e.id !== id));
      setErrors([]);
      if (inputRef.current) inputRef.current.value = "";
    },
    [entries, commit],
  );

  const clear = useCallback(() => {
    entries.forEach(revokePreview);
    commit([]);
    setErrors([]);
    if (inputRef.current) inputRef.current.value = "";
  }, [entries, commit]);

  const updateEntry = useCallback((id: string, patch: Partial<UploadEntry>) => {
    setInternal((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const simulateUpload = useCallback(
    (opts?: { failIds?: string[] }) => {
      const fail = new Set(opts?.failIds ?? []);
      const current = entries;
      if (current.length === 0) return;

      current.forEach((entry) => {
        updateEntry(entry.id, { status: "pending", progress: 0, error: undefined });
      });

      current.forEach((entry, index) => {
        const shouldFail = fail.has(entry.id) || entry.file.name.toLowerCase().includes("fail");
        let progress = 0;
        const tick = () => {
          progress += 12 + Math.floor(Math.random() * 18);
          if (progress >= 100) {
            if (shouldFail) {
              updateEntry(entry.id, {
                status: "error",
                progress: 100,
                error: "Simulated upload failed. Retry or remove this file.",
              });
            } else {
              updateEntry(entry.id, { status: "success", progress: 100, error: undefined });
            }
            return;
          }
          updateEntry(entry.id, { status: "uploading", progress });
          window.setTimeout(tick, 180 + index * 40);
        };
        window.setTimeout(tick, 120 + index * 80);
      });
    },
    [entries, updateEntry],
  );

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const setDragging = (v: boolean, reject = false) => {
    setDraggingState(v);
    setDragReject(reject);
  };

  const ctx: FileUploadContextValue = {
    entries,
    accept,
    maxSize,
    maxFiles,
    multiple,
    disabled,
    dragging,
    dragReject,
    errors,
    inputRef,
    openPicker,
    addFiles,
    removeFile,
    clear,
    setDragging,
    updateEntry,
    simulateUpload,
  };

  return (
    <FileUploadContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </FileUploadContext.Provider>
  );
}

/* ── Parts ────────────────────────────────────────────────────────────── */

export function FileUploadInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { accept, multiple, disabled, inputRef, addFiles } = useFU();
  const id = useId();
  return (
    <input
      {...props}
      id={props.id ?? id}
      ref={inputRef}
      type="file"
      className={`fu-input-hidden ${props.className ?? ""}`}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      onChange={(e) => {
        if (e.target.files) addFiles(e.target.files);
        props.onChange?.(e);
      }}
    />
  );
}

export function FileUploadDropzone({
  children,
  className,
  variant = "area",
  label = "Upload files",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "area" | "card";
  label?: string;
}) {
  const {
    disabled,
    dragging,
    dragReject,
    openPicker,
    addFiles,
    setDragging,
    accept,
    maxSize,
  } = useFU();
  const dragDepth = useRef(0);

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragDepth.current += 1;
    const items = Array.from(e.dataTransfer.items ?? []);
    const hasFiles = items.some((i) => i.kind === "file");
    if (!hasFiles) return;
    const reject =
      accept && items.some((i) => i.kind === "file" && i.type && !matchesAccept(
        new File([], "x", { type: i.type }),
        accept,
      ));
    setDragging(true, Boolean(reject));
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false, false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDragging(false, false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-label={label}
      className={[
        "fu-dropzone",
        variant === "card" ? "fu-dropzone--card" : "",
        dragging ? "fu-dropzone--active" : "",
        dragReject ? "fu-dropzone--reject" : "",
        disabled ? "fu-dropzone--disabled" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => openPicker()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <FileUploadInput aria-hidden tabIndex={-1} />
      {children ?? (
        <>
          <span className="fu-dropzone-icon" aria-hidden>
            <UploadIcon />
          </span>
          <p className="fu-dropzone-title">Upload files</p>
          <p className="fu-dropzone-desc">
            Drag and drop here, or click to browse
          </p>
          <p className="fu-dropzone-meta">
            {[
              accept ? `Accepts ${accept}` : "All file types",
              maxSize ? `Max ${formatBytes(maxSize)}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </>
      )}
    </div>
  );
}

export function FileUploadTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openPicker, disabled } = useFU();
  return (
    <button
      type="button"
      className={className ?? "fu-btn fu-btn--outline"}
      disabled={disabled || props.disabled}
      onClick={(e) => {
        props.onClick?.(e);
        openPicker();
      }}
      {...props}
    >
      {children ?? "Browse files"}
    </button>
  );
}

export function FileUploadList({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { entries } = useFU();
  if (entries.length === 0 && !children) return null;
  return (
    <ul className={`fu-list ${className ?? ""}`} aria-label="Selected files">
      {children ??
        entries.map((entry) => (
          <FileUploadItem key={entry.id} entry={entry} />
        ))}
    </ul>
  );
}

export function FileUploadItem({
  entry,
  children,
}: {
  entry: UploadEntry;
  children?: React.ReactNode;
}) {
  return (
    <li
      className={[
        "fu-item",
        entry.status === "error" ? "fu-item--error" : "",
        entry.status === "success" ? "fu-item--success" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children ?? (
        <>
          <FileUploadItemPreview entry={entry} />
          <div className="fu-item-meta">
            <FileUploadItemName entry={entry} />
            <FileUploadItemSize entry={entry} />
            {(entry.status === "uploading" ||
              entry.status === "pending" ||
              entry.status === "success" ||
              entry.status === "error") && (
              <>
                <p className={`fu-item-status fu-item-status--${entry.status}`}>
                  {entry.status === "pending"
                    ? "Pending"
                    : entry.status === "uploading"
                      ? `Uploading ${entry.progress}%`
                      : entry.status === "success"
                        ? "Uploaded"
                        : entry.error ?? "Failed"}
                </p>
                <FileUploadItemProgress entry={entry} />
              </>
            )}
          </div>
          <div className="fu-item-actions">
            <FileUploadItemDelete entry={entry} />
          </div>
        </>
      )}
    </li>
  );
}

export function FileUploadItemPreview({ entry }: { entry: UploadEntry }) {
  if (entry.previewUrl) {
    return (
      <span className="fu-item-preview">
        <img src={entry.previewUrl} alt="" />
      </span>
    );
  }
  return (
    <span className="fu-item-preview" aria-hidden>
      <FileIcon />
    </span>
  );
}

export function FileUploadItemName({ entry }: { entry: UploadEntry }) {
  return (
    <p className="fu-item-name" title={entry.file.name}>
      {entry.file.name}
    </p>
  );
}

export function FileUploadItemSize({ entry }: { entry: UploadEntry }) {
  return <p className="fu-item-size">{formatBytes(entry.file.size)}</p>;
}

export function FileUploadItemProgress({ entry }: { entry: UploadEntry }) {
  if (entry.status === "idle") return null;
  return (
    <div
      className="fu-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={entry.progress}
      aria-label={`Upload progress for ${entry.file.name}`}
    >
      <div
        className={[
          "fu-progress-bar",
          entry.status === "error" ? "fu-progress-bar--error" : "",
          entry.status === "success" ? "fu-progress-bar--success" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ width: `${entry.progress}%` }}
      />
    </div>
  );
}

export function FileUploadItemDelete({
  entry,
  label = "Remove file",
}: {
  entry: UploadEntry;
  label?: string;
}) {
  const { removeFile, disabled } = useFU();
  return (
    <button
      type="button"
      className="fu-icon-btn"
      aria-label={`${label}: ${entry.file.name}`}
      disabled={disabled || entry.status === "uploading"}
      onClick={() => removeFile(entry.id)}
    >
      <TrashIcon />
    </button>
  );
}

export function FileUploadErrors() {
  const { errors } = useFU();
  if (!errors.length) return null;
  return (
    <div className="fu-errors" role="alert">
      {errors.map((msg) => (
        <p key={msg} className="fu-error">
          {msg}
        </p>
      ))}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────── */

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 13V3M10 3l-3.5 3.5M10 3l3.5 3.5M4 17h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M5 2.5h5.5L14 6v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M10.5 2.5V6H14" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 3.5h9M5.5 3.5V2.5h3v1M4 3.5l.5 8h5l.5-8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19.5c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Code sample ──────────────────────────────────────────────────────── */

export const FILE_UPLOAD_CODE = `// File Upload · supplai Design System
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadErrors,
} from './FileUpload';

<FileUpload
  multiple
  accept="image/*,.pdf"
  maxSize={10 * 1024 * 1024}
  maxFiles={5}
  onValueChange={(files) => console.log(files)}
>
  <FileUploadDropzone />
  <FileUploadErrors />
  <FileUploadList />
</FileUpload>

// Selection is local File[]; wire onValueChange / simulateUpload to your API.
`;

/* ── Demos ────────────────────────────────────────────────────────────── */

function DemoShell({ children }: { children: React.ReactNode }) {
  return <div className="fu-demo">{children}</div>;
}

function ListWithHeader({
  showAddMore = false,
}: {
  showAddMore?: boolean;
}) {
  const { entries, openPicker, disabled, maxFiles } = useFU();
  const atMax = maxFiles !== undefined && entries.length >= maxFiles;
  return (
    <>
      {entries.length > 0 && (
        <div className="fu-list-head">
          <p className="fu-list-title">
            {entries.length} file{entries.length === 1 ? "" : "s"} selected
            {maxFiles ? ` (max ${maxFiles})` : ""}
          </p>
          {showAddMore && (
            <button
              type="button"
              className="fu-btn fu-btn--outline"
              disabled={disabled || atMax}
              onClick={openPicker}
            >
              Add more
            </button>
          )}
        </div>
      )}
      <FileUploadList />
    </>
  );
}

export function FileUploadPlayground() {
  const [multiple, setMultiple] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [accept, setAccept] = useState<string>("image/*,.pdf");
  const [maxFiles, setMaxFiles] = useState(5);
  const [maxSize] = useState(5 * 1024 * 1024);

  return (
    <div className="fu-play">
      <div className="fu-play-preview">
        <FileUpload
          multiple={multiple}
          disabled={disabled}
          accept={accept || undefined}
          maxFiles={multiple ? maxFiles : 1}
          maxSize={maxSize}
        >
          <FileUploadDropzone />
          <FileUploadErrors />
          <ListWithHeader showAddMore={multiple} />
        </FileUpload>
      </div>
      <div className="fu-play-controls">
        <div className="fu-play-row">
          <span className="fu-play-label">Accept</span>
          {[
            { v: "image/*,.pdf", l: "Images + PDF" },
            { v: "image/*", l: "Images" },
            { v: ".pdf", l: "PDF" },
            { v: "", l: "All" },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              className={`fu-chip${accept === o.v ? " fu-chip--on" : ""}`}
              onClick={() => setAccept(o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>
        <div className="fu-play-row">
          <span className="fu-play-label">Options</span>
          <button
            type="button"
            className={`fu-chip${multiple ? " fu-chip--on" : ""}`}
            onClick={() => setMultiple((v) => !v)}
          >
            Multiple
          </button>
          <button
            type="button"
            className={`fu-chip${disabled ? " fu-chip--on" : ""}`}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </button>
          {[3, 5, 8].map((n) => (
            <button
              key={n}
              type="button"
              className={`fu-chip${maxFiles === n ? " fu-chip--on" : ""}`}
              onClick={() => setMaxFiles(n)}
              disabled={!multiple}
            >
              Max {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NativeInputDemo() {
  const [name, setName] = useState("");
  return (
    <DemoShell>
      <label className="fu-dropzone-desc" style={{ alignSelf: "flex-start" }} htmlFor="fu-native">
        Native file input (type=&quot;file&quot;) using Text Input chrome on the picker button
      </label>
      <input
        id="fu-native"
        className="fu-native"
        type="file"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? "")}
      />
      {name ? <p className="fu-meta-line">Selected: {name}</p> : null}
    </DemoShell>
  );
}

export function AreaDemo() {
  return (
    <DemoShell>
      <FileUpload multiple accept=".pdf,.png,.jpg,.jpeg,.docx" maxSize={10 * 1024 * 1024} maxFiles={10}>
        <FileUploadDropzone variant="area" />
        <FileUploadErrors />
        <FileUploadList />
      </FileUpload>
    </DemoShell>
  );
}

export function CardDemo() {
  return (
    <DemoShell>
      <FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={3} multiple>
        <FileUploadDropzone variant="card">
          <span className="fu-dropzone-icon" aria-hidden>
            <UploadIcon />
          </span>
          <p className="fu-dropzone-title">Attach documents</p>
          <p className="fu-dropzone-desc">
            Compact card upload for forms and settings. Click or drop files here.
          </p>
          <p className="fu-dropzone-meta">PNG, JPG, PDF · Max 5 MB · Up to 3 files</p>
        </FileUploadDropzone>
        <FileUploadErrors />
        <FileUploadList />
      </FileUpload>
    </DemoShell>
  );
}

export function MultipleDemo() {
  return (
    <DemoShell>
      <FileUpload multiple maxFiles={8} maxSize={10 * 1024 * 1024}>
        <FileUploadDropzone />
        <FileUploadErrors />
        <ListWithHeader showAddMore />
      </FileUpload>
      <p className="fu-note">New selections append; duplicates are rejected.</p>
    </DemoShell>
  );
}

export function ListAddMoreDemo() {
  return (
    <DemoShell>
      <FileUpload multiple maxFiles={6} accept="image/*,.pdf" maxSize={8 * 1024 * 1024}>
        <FileUploadDropzone />
        <FileUploadErrors />
        <ListWithHeader showAddMore />
      </FileUpload>
    </DemoShell>
  );
}

export function ActionsDemo() {
  return (
    <DemoShell>
      <FileUpload multiple accept=".pdf,.png,.jpg" maxSize={10 * 1024 * 1024} maxFiles={5}>
        <ActionsPanel />
      </FileUpload>
    </DemoShell>
  );
}

function ActionsPanel() {
  const { entries, clear, simulateUpload } = useFU();
  const finished =
    entries.length > 0 &&
    entries.every((e) => e.status === "success" || e.status === "error");
  const allSuccess = finished && entries.every((e) => e.status === "success");

  return (
    <div className="fu-panel">
      <h3 className="fu-panel-title">Upload supporting documents</h3>
      <p className="fu-panel-desc">
        Add invoices or packing lists. This Storybook demo simulates upload — no network request is made.
      </p>
      <FileUploadDropzone />
      <FileUploadErrors />
      <FileUploadList />
      {allSuccess && (
        <p className="fu-success-banner" role="status">
          All files finished the simulated upload.
        </p>
      )}
      <div className="fu-footer">
        <button type="button" className="fu-btn fu-btn--ghost" onClick={() => clear()}>
          Cancel
        </button>
        <button
          type="button"
          className="fu-btn fu-btn--primary"
          disabled={entries.length === 0}
          onClick={() => simulateUpload()}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export function AvatarUploadDemo() {
  return (
    <DemoShell>
      <FileUpload accept="image/png,image/jpeg,image/webp" maxSize={2 * 1024 * 1024} multiple={false}>
        <AvatarUploader />
        <FileUploadErrors />
      </FileUpload>
    </DemoShell>
  );
}

function AvatarUploader() {
  const { entries, openPicker, removeFile, disabled } = useFU();
  const entry = entries[0];
  return (
    <div className="fu-avatar-wrap">
      <div className="fu-avatar" aria-hidden={!entry}>
        {entry?.previewUrl ? <img src={entry.previewUrl} alt="" /> : <UserIcon />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p className="fu-dropzone-title" style={{ margin: 0 }}>
          Profile photo
        </p>
        <p className="fu-dropzone-desc" style={{ margin: 0 }}>
          PNG, JPG, or WebP · Max 2 MB
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <FileUploadInput />
          <button
            type="button"
            className="fu-btn fu-btn--outline"
            disabled={disabled}
            onClick={openPicker}
          >
            {entry ? "Replace" : "Upload"}
          </button>
          {entry && (
            <button
              type="button"
              className="fu-btn fu-btn--ghost"
              onClick={() => removeFile(entry.id)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ImagePreviewDemo() {
  return (
    <DemoShell>
      <FileUpload accept="image/*" maxSize={5 * 1024 * 1024} multiple={false}>
        <ImageUploader />
        <FileUploadErrors />
      </FileUpload>
    </DemoShell>
  );
}

function ImageUploader() {
  const { entries, openPicker, removeFile } = useFU();
  const entry = entries[0];
  return (
    <>
      <div className="fu-image-preview">
        {entry?.previewUrl ? (
          <img src={entry.previewUrl} alt={entry.file.name} />
        ) : (
          <span>No image selected</span>
        )}
      </div>
      {entry && (
        <p className="fu-meta-line">
          {entry.file.name} · {formatBytes(entry.file.size)}
        </p>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <FileUploadInput />
        <button type="button" className="fu-btn fu-btn--primary" onClick={openPicker}>
          {entry ? "Replace image" : "Choose image"}
        </button>
        {entry && (
          <button type="button" className="fu-btn fu-btn--ghost" onClick={() => removeFile(entry.id)}>
            Remove
          </button>
        )}
      </div>
    </>
  );
}

export function AcceptTypesDemo() {
  return (
    <DemoShell>
      <div style={{ display: "grid", gap: 16 }}>
        <FileUpload accept="image/*" maxSize={5 * 1024 * 1024}>
          <p className="fu-list-title">Images only</p>
          <FileUploadDropzone />
          <FileUploadErrors />
          <FileUploadList />
        </FileUpload>
        <FileUpload accept=".pdf,application/pdf" maxSize={10 * 1024 * 1024}>
          <p className="fu-list-title">PDF only</p>
          <FileUploadDropzone />
          <FileUploadErrors />
          <FileUploadList />
        </FileUpload>
        <FileUpload accept=".pdf,.png,.docx,application/pdf,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document" maxSize={10 * 1024 * 1024} multiple>
          <p className="fu-list-title">PDF, PNG, DOCX</p>
          <FileUploadDropzone />
          <FileUploadErrors />
          <FileUploadList />
        </FileUpload>
        <FileUpload multiple>
          <p className="fu-list-title">All file types</p>
          <FileUploadDropzone />
          <FileUploadErrors />
          <FileUploadList />
        </FileUpload>
      </div>
    </DemoShell>
  );
}

export function MaxSizeDemo() {
  return (
    <DemoShell>
      <FileUpload accept="*/*" maxSize={10 * 1024 * 1024} multiple>
        <FileUploadDropzone>
          <span className="fu-dropzone-icon" aria-hidden>
            <UploadIcon />
          </span>
          <p className="fu-dropzone-title">Max 10 MB per file</p>
          <p className="fu-dropzone-desc">Oversized files are rejected; valid ones stay selected.</p>
          <p className="fu-dropzone-meta">Max size 10 MB</p>
        </FileUploadDropzone>
        <FileUploadErrors />
        <FileUploadList />
      </FileUpload>
    </DemoShell>
  );
}

export function MaxFilesDemo() {
  return (
    <DemoShell>
      <FileUpload multiple maxFiles={5} maxSize={10 * 1024 * 1024}>
        <FileUploadDropzone>
          <span className="fu-dropzone-icon" aria-hidden>
            <UploadIcon />
          </span>
          <p className="fu-dropzone-title">Up to 5 files</p>
          <p className="fu-dropzone-desc">Picker and drag-and-drop share the same limit.</p>
          <p className="fu-dropzone-meta">Max 5 files</p>
        </FileUploadDropzone>
        <FileUploadErrors />
        <ListWithHeader showAddMore />
      </FileUpload>
    </DemoShell>
  );
}

export function ProgressDemo() {
  return (
    <DemoShell>
      <FileUpload multiple maxFiles={4} maxSize={10 * 1024 * 1024}>
        <ProgressPanel />
      </FileUpload>
      <p className="fu-note">
        Simulated progress for Storybook only — not a real server upload. Include &quot;fail&quot; in a
        filename to force an error state.
      </p>
    </DemoShell>
  );
}

function ProgressPanel() {
  const { simulateUpload, entries, clear } = useFU();
  return (
    <>
      <FileUploadDropzone />
      <FileUploadErrors />
      <FileUploadList />
      <div className="fu-footer" style={{ justifyContent: "flex-start" }}>
        <button
          type="button"
          className="fu-btn fu-btn--primary"
          disabled={entries.length === 0}
          onClick={() => simulateUpload()}
        >
          Start simulated upload
        </button>
        <button type="button" className="fu-btn fu-btn--ghost" onClick={clear}>
          Clear
        </button>
      </div>
    </>
  );
}

export function SuccessErrorDemo() {
  return (
    <DemoShell>
      <FileUpload multiple maxFiles={3}>
        <SuccessErrorPanel />
      </FileUpload>
    </DemoShell>
  );
}

function SuccessErrorPanel() {
  const { entries, simulateUpload, clear } = useFU();
  return (
    <>
      <FileUploadDropzone />
      <FileUploadErrors />
      <FileUploadList />
      <div className="fu-footer" style={{ justifyContent: "flex-start" }}>
        <button
          type="button"
          className="fu-btn fu-btn--primary"
          disabled={entries.length === 0}
          onClick={() => simulateUpload()}
        >
          Simulate success
        </button>
        <button
          type="button"
          className="fu-btn fu-btn--outline"
          disabled={entries.length === 0}
          onClick={() =>
            simulateUpload({ failIds: entries.slice(0, 1).map((e) => e.id) })
          }
        >
          Simulate one failure
        </button>
        <button type="button" className="fu-btn fu-btn--ghost" onClick={clear}>
          Clear
        </button>
      </div>
      <p className="fu-note">A failed file does not clear other selections.</p>
    </>
  );
}

export function DisabledDemo() {
  return (
    <DemoShell>
      <FileUpload disabled multiple>
        <FileUploadDropzone />
        <p className="fu-note">Picker and drop are inactive while disabled.</p>
      </FileUpload>
    </DemoShell>
  );
}

export function DragStatesDemo() {
  return (
    <DemoShell>
      <FileUpload accept="image/*" maxSize={5 * 1024 * 1024} multiple>
        <p className="fu-list-title">Drag images here to see active / reject states</p>
        <FileUploadDropzone />
        <FileUploadErrors />
        <FileUploadList />
      </FileUpload>
      <p className="fu-note">
        Default → drag-over (Brand Blue) → reject tint when MIME is detectable and not an image →
        drop to add.
      </p>
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <DemoShell>
      <FileUpload
        multiple
        maxFiles={5}
        value={files}
        onValueChange={setFiles}
        accept="image/*,.pdf"
        maxSize={5 * 1024 * 1024}
      >
        <FileUploadDropzone />
        <FileUploadErrors />
        <FileUploadList />
        <div className="fu-footer" style={{ justifyContent: "flex-start" }}>
          <button type="button" className="fu-btn fu-btn--ghost" onClick={() => setFiles([])}>
            Clear via parent state
          </button>
        </div>
      </FileUpload>
      <p className="fu-meta-line">
        Controlled count: {files.length} ·{" "}
        {files.map((f) => f.name).join(", ") || "(none)"}
      </p>
    </DemoShell>
  );
}

export function CombinedDemo() {
  return (
    <DemoShell>
      <FileUpload
        multiple
        accept="image/*,.pdf,.png,.jpg,.jpeg"
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
      >
        <CombinedPanel />
      </FileUpload>
    </DemoShell>
  );
}

function CombinedPanel() {
  const { entries, clear, simulateUpload, openPicker, maxFiles } = useFU();
  const atMax = maxFiles !== undefined && entries.length >= maxFiles;
  return (
    <div className="fu-panel">
      <h3 className="fu-panel-title">Shipment attachments</h3>
      <p className="fu-panel-desc">
        Images + PDF · Max 10 MB · Up to 5 files · Simulated upload for demo
      </p>
      <FileUploadDropzone />
      <FileUploadErrors />
      {entries.length > 0 && (
        <div className="fu-list-head">
          <p className="fu-list-title">{entries.length} / {maxFiles} selected</p>
          <button
            type="button"
            className="fu-btn fu-btn--outline"
            disabled={atMax}
            onClick={openPicker}
          >
            Add more
          </button>
        </div>
      )}
      <FileUploadList />
      <div className="fu-footer">
        <button type="button" className="fu-btn fu-btn--ghost" onClick={clear}>
          Cancel
        </button>
        <button
          type="button"
          className="fu-btn fu-btn--primary"
          disabled={entries.length === 0}
          onClick={() => simulateUpload()}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export function SpecsDemo() {
  return (
    <div className="fu-specs-grid">
      <div className="fu-spec-card">
        <span className="fu-spec-label">Dropzone</span>
        <span className="fu-spec-value">Dashed 12px · #F8FAFC</span>
      </div>
      <div className="fu-spec-card">
        <span className="fu-spec-label">Active</span>
        <span className="fu-spec-value">Brand Blue ring</span>
      </div>
      <div className="fu-spec-card">
        <span className="fu-spec-label">Error</span>
        <span className="fu-spec-value">#D13145</span>
      </div>
      <div className="fu-spec-card">
        <span className="fu-spec-label">Success</span>
        <span className="fu-spec-value">#519E8A</span>
      </div>
      <div className="fu-spec-card">
        <span className="fu-spec-label">Progress</span>
        <span className="fu-spec-value">4px Brand Blue bar</span>
      </div>
      <div className="fu-spec-card">
        <span className="fu-spec-label">Input</span>
        <span className="fu-spec-value">Native file + dropzone</span>
      </div>
    </div>
  );
}
