import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar.js";
import Link from "next/link";

export default function Forum() {
  const router = useRouter();
  const { category } = router.query; // Read category from URL query
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/default.png");
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatar");

    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setUsername(storedUsername || "Employee");
      setAvatar(storedAvatar || "/default.png");
    }
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category); // Set category from query
    }
  }, [category]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      category: "HR Announcements",
      user: "HR Department",
      avatar: "/default.png",
      message: "Reminder: Open Enrollment for health benefits starts next Monday. Check your emails for details.",
      timestamp: "3 days ago",
      replies: [
        { user: "John", avatar: "/default.png", message: "Thanks for the reminder! Will there be an info session?" },
        { user: "HR Department", avatar: "/default.png", message: "Yes, a Zoom Q&A session is scheduled for Friday at 2 PM." },
      ],
    },
    {
      id: 2,
      category: "IT Support",
      user: "Alice",
      avatar: "/default.png",
      message: "Anyone else having issues with the VPN? It keeps disconnecting randomly.",
      timestamp: "2 hours ago",
      replies: [
        { user: "David (IT)", avatar: "/default.png", message: "Try switching to the backup server. We're investigating the issue." },
        { user: "Michael", avatar: "/default.png", message: "Yep, same issue here. Hope IT finds a fix soon!" },
      ],
    },
    {
      id: 3,
      category: "General Chat",
      user: "Emma",
      avatar: "/default.png",
      message: "Who’s joining the company holiday party? The invite says free drinks! 🍻",
      timestamp: "30 minutes ago",
      replies: [
        { user: "Mike", avatar: "/default.png", message: "Count me in! Do we need to RSVP?" },
      ],
    },
  ]);

  const [replyText, setReplyText] = useState({});
  const [commentText, setCommentText] = useState("");

  const handleReplyChange = (postId, text) => {
    setReplyText((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  const handleReplySubmit = (postId) => {
    if (!replyText[postId] || replyText[postId].trim() === "") return;

    const newReply = {
      user: username,
      avatar: avatar,
      message: replyText[postId],
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, replies: [...post.replies, newReply] } : post
      )
    );

    setReplyText((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    const newPostEntry = {
      id: posts.length + 1,
      category: selectedCategory,
      user: username,
      avatar: avatar,
      message: commentText,
      timestamp: "Just now",
      replies: [],
    };

    setPosts([newPostEntry, ...posts]);
    setCommentText("");
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      {/* Sidebar */}
      <Sidebar selectedCategory={selectedCategory} />
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-gray-700 shadow-md rounded-lg p-6">
          {/* Company Branding */}
          <div className="text-center mb-4">
            <img src="/opossumdynamics.jpg" alt="Company Logo" className="w-24 mx-auto" />
            <p className="text-gray-400 italic mt-2">"Innovation, Distraction, Opossum Action™"</p>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">Opossum Forum - Welcome {username}! 👋</h1>

          {/* Profile & Logout */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src={avatar} 
                alt="User Avatar" 
                className="w-12 h-12 rounded-full border" 
                onError={(e) => e.target.src = "/default.png"}
              />
              <p className="text-lg font-semibold text-white">{username}</p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* New Comment Input */}
          <div className="mb-6 p-4 bg-gray-600 rounded-lg">
            <textarea
              className="w-full p-2 rounded-md text-black"
              placeholder="Write a new post..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Post
            </button>
          </div>

          {/* Forum Posts */}
          <div className="space-y-6">
            {posts
              .filter((post) => selectedCategory === "All" || post.category === selectedCategory)
              .map((post) => (
                <div key={post.id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-md">{post.category}</span>
                    <img src={post.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border" />
                    <p className="text-sm font-semibold text-gray-800">{post.user}</p>
                    <p className="text-xs text-gray-600">{post.timestamp}</p>
                  </div>
                  <p className="text-gray-900 mt-2">{post.message}</p>

                  {/* Replies */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-3 pl-6 border-l border-gray-300 space-y-2">
                      {post.replies.map((reply, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <img src={reply.avatar} alt="User Avatar" className="w-6 h-6 rounded-full border" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{reply.user}</p>
                            <p className="text-gray-800">{reply.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="mt-3">
                    <textarea
                      className="w-full p-2 rounded-md text-black"
                      placeholder="Write a reply..."
                      value={replyText[post.id] || ""}
                      onChange={(e) => handleReplyChange(post.id, e.target.value)}
                    />
                    <button
                      onClick={() => handleReplySubmit(post.id)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}