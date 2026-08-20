export default function Home() {
  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <p style={{ color: "#666", letterSpacing: "0.08em" }}>REEDSTAR</p>

      <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
        Verifiable internet intelligence.
      </h1>

      <p style={{ fontSize: "20px", lineHeight: 1.6 }}>
        Reedstar turns public-web evidence into clear, useful business
        intelligence.
      </p>

      <a
        href="/blog"
        style={{
          display: "inline-block",
          marginTop: "24px",
          color: "#111",
          fontWeight: 700
        }}
      >
        Read the blog →
      </a>
    </main>
  );
}
