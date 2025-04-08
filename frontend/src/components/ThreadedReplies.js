import { useState } from "react";

export default function ThreadedReplies({ postId, posts, setPosts, username }) {
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, replies: [...post.replies, { user: username, avatar: "/default.png", message: replyText }] }
          : post
      )
    );
    setReplyText("");
  };

  return (
    <div className="mt-3 pl-6 border-l border-gray-300 space-y-2">
      {(posts.find((post) => post.forum_id === postId)?.replies || []).map((reply, index) => (
        <div key={index} className="flex items-start space-x-3 bg-gray-100 p-2 rounded-lg">
          <img src={reply.avatar} alt="User Avatar" className="w-6 h-6 rounded-full border" />
          <div>
            <p className="text-sm font-semibold text-gray-700">{reply.user}</p>
            <p className="text-gray-800">{reply.message}</p>
          </div>
        </div>
      ))}

      <textarea
        className="w-full p-2 rounded-md text-black mt-2"
        placeholder="Write a reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <button onClick={handleReplySubmit} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
        Reply
      </button>
    </div>
  );
}
