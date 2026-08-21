type KeyTakeawayProps = {
  children: React.ReactNode;
};

export default function KeyTakeaway({ children }: KeyTakeawayProps) {
  return (
    <aside className="key-takeaway">
      <strong>Key takeaway</strong>
      <div>{children}</div>
    </aside>
  );
}