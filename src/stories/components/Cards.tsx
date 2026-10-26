/* eslint-disable react-refresh/only-export-components -- story module exports primitives + demos */
import React, { useState } from "react";
import { Button, ButtonGroup } from "../Button";
import { Progress } from "./Progress";
import { Skeleton } from "./Skeletons";
import { Popover, PopoverContent, PopoverTrigger } from "./Popovers";
import { Avatar } from "./Avatars.mdx";
import { Badge } from "./Badges.mdx";
import { Toggle } from "./Toggles.mdx";
import "./Cards.css";

/* ── Primitives ───────────────────────────────────────────────────────── */

type As = "div" | "section" | "article" | "a";

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: As;
  href?: string;
};

export function Card({ as = "div", className, href, children, ...props }: CardProps) {
  const classes = ["crd", className ?? ""].filter(Boolean).join(" ");
  if (as === "a") {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }
  const Tag = as;
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={["crd-top", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardHeading({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["crd-heading", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

type TitleTag = "h2" | "h3" | "h4" | "p";

export function CardTitle({
  as = "h3",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: TitleTag }) {
  const Tag = as;
  return (
    <Tag className={["crd-title", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </Tag>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={["crd-description", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </p>
  );
}

export function CardAction({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["crd-action", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["crd-content", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={["crd-footer", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

/* ── Bits ─────────────────────────────────────────────────────────────── */

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5l1.2 3.8L13 6.5l-3.8 1.2L8 11.5 6.8 7.7 3 6.5l3.8-1.2L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="3.5" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12.5" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export const CARD_CODE = `// Card · supplai Design System
<Card>
  <CardHeader>
    <CardHeading>
      <CardTitle>Card title</CardTitle>
      <CardDescription>Supporting description</CardDescription>
    </CardHeading>
    <CardAction>
      <Button variant="outlined" intent="neutral" size="sm" label="Action" />
    </CardAction>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>
    <Button variant="filled" intent="primary" size="sm" label="Continue" />
  </CardFooter>
</Card>
`;

/* ── Demos ────────────────────────────────────────────────────────────── */

export function DefaultDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Supporting description for this group of content.</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <p>Main card content sits here. The card itself only supplies the surface.</p>
          </CardContent>
          <CardFooter>
            <span />
            <Button variant="filled" intent="primary" size="sm" label="Action" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function AnatomyDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-mid">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle as="h2">CardTitle</CardTitle>
              <CardDescription>CardDescription</CardDescription>
            </CardHeading>
            <CardAction>
              <Button variant="ghost" intent="primary" size="sm" label="CardAction" />
            </CardAction>
          </CardHeader>
          <CardContent>CardContent</CardContent>
          <CardFooter>
            <span className="crd-meta">CardFooter</span>
          </CardFooter>
        </Card>
        <p className="crd-note">
          CardHeader, CardTitle, CardDescription, CardAction, CardContent, and CardFooter are layout slots. Labels above are documentation only.
        </p>
      </div>
    </div>
  );
}

export function FeatureDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardContent>
            <span className="crd-icon-badge" aria-hidden="true">
              <SparkIcon />
            </span>
            <CardTitle as="h2">Real-time collaboration</CardTitle>
            <CardDescription>
              Work with your team in real time across projects and reviews.
            </CardDescription>
            <p style={{ margin: "16px 0 0" }}>
              <a className="crd-link" href="#collaboration">
                Learn more <ArrowIcon />
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function BillingDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Active subscription</CardTitle>
              <CardDescription>7 days remaining in this cycle.</CardDescription>
            </CardHeading>
            <CardAction>
              <Button variant="outlined" intent="neutral" size="sm" label="Manage" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="crd-kicker">Included credits</p>
            <p className="crd-stat" style={{ fontSize: 22 }}>$42.00 <span style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>/ $50.00</span></p>
            <div style={{ margin: "12px 0 16px" }}>
              <Progress value={84} size="sm" aria-label="Credits used" />
            </div>
            <dl className="crd-rows">
              <div className="crd-row"><dt>API requests</dt><dd>$38.12</dd></div>
              <div className="crd-row"><dt>Compute time</dt><dd>$3.88</dd></div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="filled" intent="primary" size="sm" label="Add credits" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function PromoDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card className="crd-promo">
          <CardContent>
            <span className="crd-icon-badge" aria-hidden="true">
              <SparkIcon />
            </span>
            <CardTitle as="h2">Build faster</CardTitle>
            <CardDescription>
              A clearer way to group work, status, and the next action on one surface.
            </CardDescription>
            <div style={{ marginTop: 16 }}>
              <Button variant="filled" intent="primary" size="sm" label="Explore" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function HeaderFooterDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-mid">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Project settings</CardTitle>
              <CardDescription>Manage access and workspace preferences.</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <p>Project name, members, and visibility live in the body. The footer holds the actions.</p>
          </CardContent>
          <CardFooter>
            <span />
            <div className="crd-footer-actions">
              <Button variant="outlined" intent="neutral" size="sm" label="Cancel" />
              <Button variant="filled" intent="primary" size="sm" label="Save" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function ImageDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <div className="crd-media">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=960&h=540&q=80"
              alt="Ridge above a green valley"
            />
          </div>
          <CardHeader>
            <CardHeading>
              <CardTitle>Coastal ridge</CardTitle>
              <CardDescription>A quiet overlook used in the sample library.</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardFooter>
            <Button href="#ridge" variant="ghost" intent="primary" size="sm" label="View details" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function InfoDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Design tokens</CardTitle>
              <CardDescription>Shared colour, type, and spacing for product UI.</CardDescription>
            </CardHeading>
            <CardAction>
              <Badge size={20} variant="outline" color="neutral">v2.1.21</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <dl className="crd-rows">
              <div className="crd-row"><dt>Package</dt><dd>@supplai/tokens</dd></div>
              <div className="crd-row"><dt>Updated</dt><dd>Today</dd></div>
            </dl>
          </CardContent>
          <CardFooter>
            <a className="crd-link" href="#docs">Docs</a>
            <Button variant="outlined" intent="neutral" size="sm" label="Changelog" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function DashboardDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Monthly revenue</CardTitle>
              <CardDescription>Compared with the previous month.</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <p className="crd-stat">$48,250</p>
            <span className="crd-delta">+12.4% from last month</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function MetricsDemo() {
  const items = [
    { title: "Revenue", value: "$48.2k", delta: "+12%", down: false },
    { title: "Customers", value: "12,842", delta: "+4.2%", down: false },
    { title: "Conversion", value: "8.4%", delta: "−1.1%", down: true },
  ];
  return (
    <div className="crd-stage crd-stage--grid">
      {items.map((item) => (
        <Card key={item.title}>
          <CardContent>
            <p className="crd-kicker">{item.title}</p>
            <p className="crd-stat">{item.value}</p>
            <span className={item.down ? "crd-delta crd-delta--down" : "crd-delta"}>{item.delta}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FormDemo() {
  const [email, setEmail] = useState("designer@example.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle as="h2">Sign in</CardTitle>
              <CardDescription>
                New here? <a className="crd-link" href="#signup">Create an account</a>
              </CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!password) {
                  setMessage("Enter your password.");
                  return;
                }
                setMessage("Signed in locally. No request was sent.");
              }}
            >
              <div className="crd-field">
                <label htmlFor="crd-email">Email</label>
                <input id="crd-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="crd-field">
                <label htmlFor="crd-password">Password</label>
                <input id="crd-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {message ? <p className="crd-note" role="status">{message}</p> : null}
              <Button type="submit" variant="filled" intent="primary" label="Sign in" fullWidth />
              <div className="crd-or">or continue with</div>
              <ButtonGroup>
                <Button type="button" variant="outlined" intent="neutral" label="Google" />
                <Button type="button" variant="outlined" intent="neutral" label="GitHub" />
              </ButtonGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SettingsDemo() {
  const [email, setEmail] = useState(true);
  const [weekly, setWeekly] = useState(false);
  return (
    <div className="crd-stage">
      <div className="crd-mid">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what reaches your inbox.</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <div className="crd-setting">
              <div>
                <strong>Email notifications</strong>
                <span>Account activity and mentions.</span>
              </div>
              <Toggle checked={email} onChange={setEmail} />
            </div>
            <div className="crd-setting">
              <div>
                <strong>Weekly summary</strong>
                <span>A digest every Monday morning.</span>
              </div>
              <Toggle checked={weekly} onChange={setWeekly} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProfileDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardContent>
            <div className="crd-profile">
              <Avatar size={48} fallback="AM" alt="Anna Murreum" />
              <CardTitle as="h2">Anna Murreum</CardTitle>
              <CardDescription>Product designer · Auckland, New Zealand</CardDescription>
              <Badge size={20} color="primary">Design</Badge>
              <Button href="#profile" variant="outlined" intent="neutral" size="sm" label="View profile" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Shared workspace for the design team.</CardDescription>
            </CardHeading>
            <CardAction>
              <Badge size={20} variant="strong" color="success">Active</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="crd-meta">12 members</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function MenuDemo() {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("No action yet");
  const pick = (item: string) => {
    setChoice(item);
    setOpen(false);
  };
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Project Alpha</CardTitle>
              <CardDescription>Last updated 4 minutes ago.</CardDescription>
            </CardHeading>
            <CardAction>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  asChild={false}
                  className="btn btn--ghost btn--sm btn--icon"
                  data-intent="neutral"
                  aria-label="Project actions"
                >
                  <MoreIcon />
                </PopoverTrigger>
                <PopoverContent align="end" width={180} style={{ padding: 8 }}>
                  <div className="crd-menu-list" role="menu">
                    {["Rename", "Duplicate", "Archive", "Delete"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        role="menuitem"
                        className={item === "Delete" ? "crd-menu-item crd-menu-item--danger" : "crd-menu-item"}
                        onClick={() => pick(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <span className="crd-meta" role="status">{choice}</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function LinkCardDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card as="a" href="#project-alpha" className="crd--interactive">
          <CardHeader>
            <CardHeading>
              <CardTitle as="h2">Project Alpha</CardTitle>
              <CardDescription>Opens the project. The whole card is a link, so it has no nested buttons.</CardDescription>
            </CardHeading>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export function ProgressDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Storage</CardTitle>
              <CardDescription>7.2 GB of 10 GB used</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <Progress value={72} aria-label="Storage used" />
            <p className="crd-meta" style={{ marginTop: 8 }}>72%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card aria-busy="true" aria-label="Loading project">
          <CardContent>
            <div className="crd-skel">
              <Skeleton width={48} height={48} circle />
              <Skeleton width="60%" height={16} />
              <Skeleton width="90%" height={12} />
              <Skeleton width="75%" height={12} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function EmptyDemo() {
  return (
    <div className="crd-stage">
      <div className="crd-narrow">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Team members</CardTitle>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <div className="crd-empty">
              <p>No members have been added yet.</p>
              <Button variant="filled" intent="primary" size="sm" label="Add member" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LogisticsDemo() {
  return (
    <div className="crd-stage crd-stage--logistics">
      <Card>
        <CardHeader>
          <CardHeading>
            <p className="crd-kicker">Shipment SHP-20481</p>
            <CardTitle as="h2">Auckland → Sydney</CardTitle>
            <CardDescription>18 pallets · Northline · Departed depot</CardDescription>
          </CardHeading>
          <CardAction>
            <Badge size={20} variant="strong" color="primary">In transit</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Progress value={62} size="sm" aria-label="Route progress" />
          <dl className="crd-rows" style={{ marginTop: 12 }}>
            <div className="crd-row"><dt>Origin</dt><dd>Wiri DC, Auckland</dd></div>
            <div className="crd-row"><dt>Destination</dt><dd>Port Botany, Sydney</dd></div>
            <div className="crd-row"><dt>ETA</dt><dd>Thu 16:40</dd></div>
            <div className="crd-row"><dt>Next stop</dt><dd>Wellington ferry</dd></div>
          </dl>
        </CardContent>
        <CardFooter>
          <span className="crd-meta">Updated 12 min ago</span>
          <div className="crd-footer-actions">
            <Button variant="outlined" intent="neutral" size="sm" label="Documents" />
            <Button variant="filled" intent="primary" size="sm" label="Track" />
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardHeading>
            <p className="crd-kicker">Exception EX-118</p>
            <CardTitle as="h2">Held at customs</CardTitle>
            <CardDescription>Container MSCU 442190 · Melbourne</CardDescription>
          </CardHeading>
          <CardAction>
            <Badge size={20} variant="strong" color="warning">Action needed</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="crd-rows">
            <div className="crd-row"><dt>Hold reason</dt><dd>Missing commercial invoice</dd></div>
            <div className="crd-row"><dt>Free time left</dt><dd>36 hours</dd></div>
            <div className="crd-row"><dt>Demurrage</dt><dd>$180 / day after</dd></div>
          </dl>
        </CardContent>
        <CardFooter>
          <div className="crd-footer-actions">
            <Button variant="outlined" intent="neutral" size="sm" label="Upload invoice" />
            <Button variant="filled" intent="error" size="sm" label="Escalate" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export function SpecsDemo() {
  const rows = [
    ["Surface", "White · 1px #E2E8F0"],
    ["Radius", "12px"],
    ["Elevation", "None — border only"],
    ["Title", "16px / 700"],
    ["Description", "13px / #64748B"],
    ["Padding", "20px header and footer"],
  ];
  return (
    <div className="crd-specs">
      {rows.map(([label, value]) => (
        <div key={label} className="crd-spec-card">
          <span className="crd-spec-label">{label}</span>
          <span className="crd-spec-value">{value}</span>
        </div>
      ))}
    </div>
  );
}
