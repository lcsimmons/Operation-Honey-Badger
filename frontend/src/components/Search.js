import { useState } from "react";

export default function Search({ allPosts, setFilteredPosts }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (!term) {
            setFilteredPosts(allPosts);
            return;
        }

        const filtered = allPosts?.filter((post) =>
            post.message.toLowerCase().includes(term) ||
            post.category.toLowerCase().includes(term)
        );

        setFilteredPosts(filtered);
    };

    return (
        <input
            type="text"
            placeholder="Search for posts..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 rounded-md text-black w-1/3"
        />
    );
}
