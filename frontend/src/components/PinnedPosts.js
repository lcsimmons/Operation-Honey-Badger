import { Pin } from "lucide-react";

export default function PinnedPosts({ posts }) {
    return (
        <div className="mb-6">
            {/* Flex container for icon + title */}
            <div className="flex items-center space-x-2 mb-2">
                <Pin className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-700">Pinned Announcements</h2>
            </div>

            {/* Render pinned posts */}
            {posts
                .filter((post) => post.pinned)
                .map((post) => (
                    <div key={post.id} className="p-4 border border-yellow-400 bg-yellow-100 rounded-lg mt-3">
                        <div className="flex items-center space-x-3">
                            <img src={post.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border" />
                            <p className="text-sm font-semibold text-gray-800">{post.user}</p>
                            <p className="text-xs text-gray-600">{post.timestamp}</p>
                        </div>
                        <p className="text-gray-900 mt-2">{post.message}</p>
                    </div>
                ))}
        </div>
    );
}
