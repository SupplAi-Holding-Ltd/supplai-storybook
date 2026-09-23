import React from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import { format, addDays, subDays, subMonths, startOfDay } from 'date-fns';
import 'react-day-picker/style.css';
import './Calendars.css';

export const CALENDAR_CODE = `// Calendar · supplai Design System
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

// mode: single | range | multiple

function Calendar({ mode = 'single', ...props }) {
  const [selected, setSelected] = useState();
  return (
    <div className="cld-shell">
      <DayPicker
        animate
        navLayout="around"
        showOutsideDays
        mode={mode}
        selected={selected}
        onSelect={setSelected}
        {...props}
      />
    </div>
  );
}
`;

export const TIME_SLOTS = [
  '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
  '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
  '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
];

export const BUSY_SLOTS = new Set(['10:00 AM', '10:15 AM', '1:00 PM', '2:30 PM']);

export const CalendarShell = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={['cld-shell', className].filter(Boolean).join(' ')}>{children}</div>
);

const calProps = {
  animate: true as const,
  navLayout: 'around' as const,
  showOutsideDays: true as const,
};

export function CalendarPlayground() {
  const [mode, setMode] = React.useState<'single' | 'range'>('single');
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });

  return (
    <div className="cldp-wrap">
      <div className="cldp-preview">
        <CalendarShell>
          {mode === 'single' ? (
            <DayPicker
              {...calProps}
              mode="single"
              selected={selected}
              onSelect={setSelected}
              footer={selected ? `Selected: ${format(selected, 'PPP')}` : 'Pick a day.'}
            />
          ) : (
            <DayPicker
              {...calProps}
              mode="range"
              selected={range}
              onSelect={setRange}
              footer={
                range?.from
                  ? `${format(range.from, 'MMM d')}${range.to ? ` – ${format(range.to, 'MMM d')}` : ''}`
                  : 'Pick a range.'
              }
            />
          )}
        </CalendarShell>
      </div>
      <div className="cldp-controls">
        <div className="cldp-ctrl-group">
          <span className="cldp-ctrl-label">Mode</span>
          <div className="cldp-chips">
            {(['single', 'range'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`cldp-chip ${mode === m ? 'cldp-chip--on' : ''}`}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SingleCalendar() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  return (
    <CalendarShell>
      <DayPicker {...calProps} mode="single" selected={selected} onSelect={setSelected} />
    </CalendarShell>
  );
}

export function RangeCalendar() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  });
  return (
    <CalendarShell>
      <DayPicker {...calProps} mode="range" selected={range} onSelect={setRange} />
    </CalendarShell>
  );
}

export function PresetsCalendar() {
  const today = startOfDay(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>({ from: today, to: today });
  const [preset, setPreset] = React.useState('Today');

  const apply = (label: string, from: Date, to: Date) => {
    setPreset(label);
    setRange({ from, to });
  };

  const presets = [
    { label: 'Today', from: today, to: today },
    { label: 'Last 7 Days', from: subDays(today, 6), to: today },
    { label: 'Last 30 Days', from: subDays(today, 29), to: today },
    { label: 'Last 3 Months', from: subMonths(today, 3), to: today },
    { label: 'Last 6 Months', from: subMonths(today, 6), to: today },
    { label: 'Last 12 Months', from: subMonths(today, 12), to: today },
  ];

  return (
    <div className="cld-split">
      <div className="cld-presets">
        <span className="cld-presets-label">Select date</span>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            className={`cld-preset ${preset === p.label ? 'cld-preset--on' : ''}`}
            onClick={() => apply(p.label, p.from, p.to)}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          className={`cld-preset ${preset === 'Custom' ? 'cld-preset--on' : ''}`}
          onClick={() => setPreset('Custom')}
        >
          Custom
        </button>
      </div>
      <CalendarShell>
        <DayPicker
          {...calProps}
          mode="range"
          selected={range}
          onSelect={(r) => {
            setRange(r);
            setPreset('Custom');
          }}
          defaultMonth={range?.from}
        />
      </CalendarShell>
    </div>
  );
}

export function TimePickerCalendar() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState('10:00 AM');
  return (
    <div className="cld-split cld-split--time">
      <CalendarShell>
        <DayPicker {...calProps} mode="single" selected={selected} onSelect={setSelected} />
      </CalendarShell>
      <div className="cld-times cld-times--panel">
        <span className="cld-presets-label">Select time</span>
        <div className="cld-times-scroll">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              className={`cld-time ${time === slot ? 'cld-time--on' : ''}`}
              onClick={() => setTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DoubleCalendar() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 10),
  });
  return (
    <CalendarShell className="cld-shell--wide">
      <DayPicker {...calProps} mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />
    </CalendarShell>
  );
}

export function FooterCalendar() {
  const [draft, setDraft] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const [applied, setApplied] = React.useState<DateRange | undefined>(draft);

  return (
    <div className="cld-panel">
      <CalendarShell>
        <DayPicker {...calProps} mode="range" selected={draft} onSelect={setDraft} />
      </CalendarShell>
      <div className="cld-footer">
        <span className="cld-footer-meta">
          {applied?.from
            ? `${format(applied.from, 'MMM d')}${applied.to ? ` – ${format(applied.to, 'MMM d, yyyy')}` : ''}`
            : 'No date applied'}
        </span>
        <div className="cld-footer-actions">
          <button type="button" className="cld-btn cld-btn--ghost" onClick={() => setDraft(applied)}>
            Cancel
          </button>
          <button type="button" className="cld-btn cld-btn--primary" onClick={() => setApplied(draft)}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export function DropdownCalendar() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  return (
    <CalendarShell>
      <DayPicker
        {...calProps}
        mode="single"
        captionLayout="dropdown"
        selected={selected}
        onSelect={setSelected}
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
      />
    </CalendarShell>
  );
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => i);

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ManualTimeCalendar() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [hour, setHour] = React.useState(9);
  const [minute, setMinute] = React.useState(30);
  const [meridiem, setMeridiem] = React.useState<'AM' | 'PM'>('AM');
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);

  const timeLabel = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem}`;

  const placeDropdown = React.useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.left });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    placeDropdown();
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('scroll', placeDropdown, true);
    window.addEventListener('resize', placeDropdown);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', placeDropdown, true);
      window.removeEventListener('resize', placeDropdown);
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, placeDropdown]);

  const dropdown = open
    ? createPortal(
        <div
          ref={popRef}
          className="cld-tpicker cld-tpicker--portal"
          role="dialog"
          aria-label="Choose time"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="cld-tpicker-col" role="listbox" aria-label="Hour">
            {HOURS_12.map((h) => (
              <button
                key={h}
                type="button"
                role="option"
                aria-selected={hour === h}
                className={`cld-tpicker-item ${hour === h ? 'cld-tpicker-item--on' : ''}`}
                onClick={() => setHour(h)}
              >
                {String(h).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="cld-tpicker-col" role="listbox" aria-label="Minute">
            {MINUTES_60.map((m) => (
              <button
                key={m}
                type="button"
                role="option"
                aria-selected={minute === m}
                className={`cld-tpicker-item ${minute === m ? 'cld-tpicker-item--on' : ''}`}
                onClick={() => setMinute(m)}
              >
                {String(m).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="cld-tpicker-col cld-tpicker-col--meridiem" role="listbox" aria-label="AM or PM">
            {(['AM', 'PM'] as const).map((period) => (
              <button
                key={period}
                type="button"
                role="option"
                aria-selected={meridiem === period}
                className={`cld-tpicker-item ${meridiem === period ? 'cld-tpicker-item--on' : ''}`}
                onClick={() => setMeridiem(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="cld-panel cld-panel--pop">
      <CalendarShell>
        <DayPicker {...calProps} mode="single" selected={selected} onSelect={setSelected} />
      </CalendarShell>
      <div className="cld-manual">
        <label className="cld-manual-label" htmlFor="cld-time-display">
          Enter time
        </label>
        <div className="cld-timefield" ref={rootRef}>
          <input
            id="cld-time-display"
            className="cld-timefield-input"
            type="text"
            readOnly
            value={timeLabel}
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          />
          <button
            type="button"
            className="cld-timefield-clock"
            aria-label={open ? 'Close time picker' : 'Open time picker'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <ClockIcon />
          </button>
        </div>
        {dropdown}
        <p className="cld-manual-hint">
          {selected ? format(selected, 'EEE, MMM d') : 'Pick a date'} · {timeLabel}
        </p>
      </div>
    </div>
  );
}

export function AvailabilityCalendar() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState('9:30 AM');
  return (
    <div className="cld-split cld-split--avail">
      <div className="cld-avail-cal">
        <CalendarShell>
          <DayPicker {...calProps} mode="single" selected={selected} onSelect={setSelected} />
        </CalendarShell>
        {selected && <p className="cld-avail-date">{format(selected, 'MMM d, EEE')}</p>}
      </div>
      <div className="cld-times">
        <span className="cld-presets-label">Availability</span>
        <div className="cld-times-scroll">
          {TIME_SLOTS.map((slot) => {
            const busy = BUSY_SLOTS.has(slot);
            return (
              <button
                key={slot}
                type="button"
                disabled={busy}
                className={`cld-time ${time === slot ? 'cld-time--on' : ''} ${busy ? 'cld-time--busy' : ''}`}
                onClick={() => !busy && setTime(slot)}
              >
                <span>{slot}</span>
                {busy && <span className="cld-busy-tag">Busy</span>}
              </button>
            );
          })}
        </div>
        <div className="cld-footer-actions" style={{ marginTop: 12 }}>
          <button type="button" className="cld-btn cld-btn--ghost">
            Cancel
          </button>
          <button type="button" className="cld-btn cld-btn--primary">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
