import { useQuery } from "react-query";
import axios from "axios";

// Fetch properties with optional keyword
const fetchProperties = async (keyword) => {
  const url = keyword
    ? "http://127.0.0.1:8080/properties/search/"
    : "http://127.0.0.1:8080/properties"; // Default to fetch all properties
  const { data } = await axios.get(url, {
    params: keyword ? { keyword } : {}, // Attach keyword only if provided
  });
  return data;
};

const useProperties = (keyword = "") => {
  return useQuery(["properties", keyword], () => fetchProperties(keyword), {
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    keepPreviousData: true,   // Keeps old data while fetching new data for smooth UI updates
  });
};

export default useProperties;
