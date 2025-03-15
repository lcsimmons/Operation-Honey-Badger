export default function EmojiReactions({ postId, posts, setPosts }) {
    const reactions = ["👍", "❤️", "😂", "😡", "🎉"];

    const handleReaction = (emoji) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, likes: (post.likes || 0) + 1, reaction: emoji } : post
            )
        );
    };

    return (
        <div className="flex space-x-2 mt-2">
            {reactions.map((emoji) => (
                <buttonkey={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-lg hover:scale-110 transition transform">
                    {emoji}
                </button>
            ))}
        </div>
    );
}
