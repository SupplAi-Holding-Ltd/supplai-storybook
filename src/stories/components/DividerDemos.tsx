import { Badge } from "./Badges.mdx";
import { Button } from "../Button";
import { Card, CardContent, CardHeader, CardHeading, CardTitle } from "./Cards";
import { Divider } from "./Dividers";

export const DIVIDER_CODE = `import { Divider } from "./Dividers";

<Divider />
<Divider orientation="vertical" />`;

export function HorizontalDemo() {
  return (
    <div className="dvd-stage">
      <div className="dvd-stack">
        <div>
          <p className="dvd-title">Account details</p>
          <p className="dvd-meta">Name, email, and company.</p>
        </div>
        <Divider />
        <div>
          <p className="dvd-title">Security settings</p>
          <p className="dvd-meta">Password, sessions, and sign-in.</p>
        </div>
      </div>
    </div>
  );
}

export function VerticalDemo() {
  return (
    <div className="dvd-stage">
      <div className="dvd-row">
        <span>Overview</span>
        <Divider orientation="vertical" />
        <span>Activity</span>
        <Divider orientation="vertical" />
        <span>Settings</span>
      </div>
    </div>
  );
}

export function PlainTextDemo() {
  return (
    <div className="dvd-stage">
      <div className="dvd-split">
        <Divider />
        <span>OR</span>
        <Divider />
      </div>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="dvd-stage">
      <div className="dvd-split">
        <Divider />
        <Badge size={20} color="primary" variant="soft">New</Badge>
        <Divider />
      </div>
    </div>
  );
}

export function FormDemo() {
  return (
    <div className="dvd-stage">
      <div className="dvd-actions">
        <Button label="Continue with email" variant="outlined" intent="neutral" fullWidth />
        <div className="dvd-split">
          <Divider />
          <span>OR</span>
          <Divider />
        </div>
        <Button label="Continue with Google" variant="filled" intent="primary" fullWidth />
      </div>
    </div>
  );
}

export function SectionDemo() {
  return (
    <div className="dvd-stack" style={{ maxWidth: 480 }}>
      <div>
        <p className="dvd-title">Profile</p>
        <p className="dvd-meta">Manage your personal information.</p>
      </div>
      <Divider />
      <div>
        <p className="dvd-title">Notifications</p>
        <p className="dvd-meta">Choose which notifications you receive.</p>
      </div>
    </div>
  );
}

export function CardDemo() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>Account</CardTitle>
          </CardHeading>
        </CardHeader>
        <CardContent>
          <div className="dvd-stack">
            <p className="dvd-title">Personal information</p>
            <Divider />
            <div>
              <p className="dvd-title">Security</p>
              <p className="dvd-meta">Password and authentication</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MenuDemo() {
  return (
    <div className="dvd-menu" role="group" aria-label="Project actions">
      <button type="button">Edit</button>
      <button type="button">Duplicate</button>
      <Divider />
      <button type="button">Archive</button>
      <button type="button" className="dvd-menu-danger">Delete</button>
    </div>
  );
}

export function SpecsDemo() {
  const rows = [
    ["Colour", "Grey / 300"],
    ["Token", "--color-grey-300"],
    ["Thickness", "1px"],
    ["Default", "Horizontal"],
    ["Vertical", "Parent height"],
    ["Margin", "None"],
  ];
  return (
    <div className="dvd-specs-grid">
      {rows.map(([label, value]) => (
        <div key={label} className="dvd-spec-card">
          <p className="dvd-spec-label">{label}</p>
          <p className="dvd-spec-value">{value}</p>
        </div>
      ))}
    </div>
  );
}
