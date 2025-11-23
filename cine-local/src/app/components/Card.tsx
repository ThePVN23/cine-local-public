export default function Card({ children }: { children: React.ReactNode }) {
    return (
      <div
        style={{
          backgroundColor: "#1f2937",
          borderRadius: "0.75rem",
          padding: "0rem",
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        }}
      >
        {children}
      </div>
    );
  }