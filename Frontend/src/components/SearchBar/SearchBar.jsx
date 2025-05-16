import React from "react";
import { Input } from "antd";

const SearchBar = ({ filter, setFilter }) => {
  const handleSearch = (e) => {
    setFilter(e.target.value); // Update the filter value dynamically
  };

  return (
    <div style={{ marginBottom: "20px", width: "100%", textAlign: "center" }}>
      <Input.Search
        placeholder="Search properties by keyword..."
        value={filter}
        onChange={handleSearch}
        enterButton
        allowClear
        style={{ maxWidth: "500px" }}
      />
    </div>
  );
};

export default SearchBar;
