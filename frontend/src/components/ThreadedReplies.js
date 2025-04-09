import { useState } from "react";
import { createForumComment } from "../pages/api/apiHelper";

const base64Encode = (str) => {
  return btoa(
    new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
};

export default function ThreadedReplies({ postId, posts, setPosts, username }) {
  const [replyText, setReplyText] = useState({});

  const avatar = localStorage.getItem("avatar") || "/default.png";

  const detectInjection = (input) => {
    const xssPattern = /(<script.*?>.*?<\/script>|<svg.*?on\w+=.*?>|javascript:|<iframe.*?>)/gi;
    const sqlPattern = /('|--|;|--|\b(OR|SELECT|DROP|UNION|INSERT|DELETE|UPDATE)\b)/gi;
    return xssPattern.test(input) || sqlPattern.test(input);
  };

  const handleCommentSubmit = async (postId) => {
    const reply = replyText[postId];
    const username = localStorage.getItem("username");

    if (!reply || !reply.trim()) return;
    if (detectInjection(reply)) return;

    const commentBody = {
      username: base64Encode(username),
      forum_id: base64Encode(postId),
      comment: base64Encode(reply),
    };

    try {
      const response = await createForumComment(commentBody);

      if (response.status === 200) {
        const newComment = {
          ...response.data,
          user: username,
          avatar: avatar,
          message: reply,
        };

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.forum_id === postId
              ? { ...post, replies: [...post.replies, newComment] }
              : post
          )
        );

        setReplyText((prev) => ({ ...prev, [postId]: "" }));
      } else {
        console.error("Failed to create comment");
      }
    } catch (err) {
      console.error("Error creating comment:", err);
    }
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
        value={replyText[postId] || ""}
        onChange={(e) => setReplyText((prev) => ({ ...prev, [postId]: e.target.value }))}
      />
      <button
        onClick={() => handleCommentSubmit(postId)}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Reply
      </button>
    </div>
  );
}
