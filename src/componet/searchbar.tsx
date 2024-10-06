// src/components/SearchBar.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users`
      );
      const filteredResults = response.data.filter((user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300);

  useEffect(() => {
    debouncedFetchData(query);
    return () => {
      debouncedFetchData.cancel(); // Cleanup function to cancel debounce
    };
  }, [query]);

  return (
    <div className="max-w-md mx-auto mt-10">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <div>Loading...</div>}
      <ul className="mt-4">
        {results.map((user) => (
          <li key={user.id} className="p-2 border-b border-gray-200">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
