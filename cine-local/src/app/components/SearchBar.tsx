import { useState } from "react";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "2rem" }}>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "1rem 1.5rem",
          borderRadius: "9999px",
          backgroundColor: "white",
          color: "#111827",
          fontSize: "1.125rem",
          border: "none",
          outline: "none"
        }}
      />
    </div>
  );
}
