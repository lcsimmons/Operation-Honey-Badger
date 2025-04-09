import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import ThreadedReplies from "../components/ThreadedReplies";
import EmojiReactions from "../components/EmojiReactions";
import FileUpload from "../components/FileUpload";
import ReportButton from "../components/ReportButton";
import PinnedPosts from "../components/PinnedPosts";
import Search from "../components/Search";
import Link from "next/link";
import { Bell, Info, Wrench, LogOut } from "lucide-react";
import { getForumComments, createForumPost, getForumPosts } from "./api/apiHelper.js";

export default function Forum() {
  const router = useRouter();
  const { category } = router.query;
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/default.png");
  const [commentText, setCommentText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [alertMessage, setAlertMessage] = useState("");
  const [replyText, setReplyText] = useState({});
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatar");
  
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
  
    setUsername(storedUsername || "Employee");
    setAvatar(storedAvatar || "/default.png");
  
    const fetchData = async () => {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          getForumPosts(),
          getForumComments(),
        ]);
  
        if (postsRes.status !== 200 || commentsRes.status !== 200) {
          console.error("Error fetching posts or comments");
          return;
        }
  
        const postsData = postsRes.data;
        const commentsData = commentsRes.data;

        const commentsByForumId = commentsData.reduce((acc, comment) => {
          const forumId = comment.forum_id;
          if (!acc[forumId]) acc[forumId] = [];
          acc[forumId].push({
            user: comment.username,
            avatar: comment.avatar,
            message: comment.comment,
            timestamp: comment.timestamp,
          });
          return acc;
        }, {});
        
        const postsWithReplies = postsData.map((post) => ({
          ...post,
          replies: commentsByForumId[post.forum_id] || [],
        }));
  
        setPosts(postsWithReplies);
      } catch (err) {
        console.error("Unexpected error", err);
      }
    };
  
    fetchData();
  }, []);
  
  // useEffect(() => {
  //   const isLoggedIn = localStorage.getItem("loggedIn");
  //   const storedUsername = localStorage.getItem("username");
  //   const storedAvatar = localStorage.getItem("avatar");

  //   if (!isLoggedIn) {
  //     router.push("/login");
  //   } else {
  //     setUsername(storedUsername || "Employee");
  //     setAvatar(storedAvatar || "/default.png");

  //     //add tge the information for the forum
      
  //     const res = getForumComments();

  //     res.then((result) => {
  //       if(result.status !== 200){
  //         console.log("There was an error");
  //         return ;
  //       }

  //       const resObj = result.data;

  //       setPosts(resObj);

  //       console.log(resObj);
  //     }).catch((err) => {
  //       console.log(err);
  //     })
  //   }
  // }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const [uploadedFile, setUploadedFile] = useState(null);

  const base64Encode = (str) => {
    return btoa(new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), ""));
  };  

  const handlePostSubmit = async () => {
    if (!commentText.trim()) return;
  
    if (detectInjection(commentText)) return;
  
    const postBody = {
      username: base64Encode(username),
      title: base64Encode("Untitled"),
      description: base64Encode(commentText),
      forum_category: base64Encode(selectedCategory === "All" ? "General Chat" : selectedCategory),
      is_pinned: base64Encode("0")
    };
  
    try {
      const response = await createForumPost(postBody);
  
      if (response.status === 200) {
        const newPost = {
          ...response.data,
          avatar: avatar,
          replies: [],
          likes_count: 0
        };
  
        setPosts([newPost, ...posts]);
        setCommentText("");
        setUploadedFile(null);
      } else {
        console.error("Failed to create post");
      }
    } catch (err) {
      console.error("Error creating forum post:", err);
      return { status: 500, data: { error: "Request failed" } };
    }
    
  };
  

  
  const handleLogout = (forumId) => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
    
      try {
        router.push("/login");
      } catch (err) {
        console.error("Logout redirect failed:", err);
      }
  };

  // TO DO: Write backend for this 
  const handleLike = () => {
    console.log("Liked!")
    return
  }

  const detectInjection = (input) => {
    const xssPattern = /(<script.*?>.*?<\/script>|<svg.*?on\w+=.*?>|javascript:|<iframe.*?>)/gi;
    const sqlPattern = /('|--|;|--|\b(OR|SELECT|DROP|UNION|INSERT|DELETE|UPDATE)\b)/gi;

    setAlertMessage("");

    if (xssPattern.test(input)) {
      console.warn("🚨 XSS Attempt Detected:", input);
      setTimeout(() => setAlertMessage("🚨 XSS Attack Detected! 🚨"), 50);
      return true;
    }
    if (sqlPattern.test(input)) {
      console.warn("🚨 SQL Injection Attempt Detected:", input);
      setTimeout(() => setAlertMessage("🚨 SQL Injection Attempt Detected! 🚨"), 50);
      return true;
    }

    return false;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 p-4 text-white flex items-center">
        {/* Left: Logo & Search Bar */}
        <div className="flex items-center flex-1 gap-x-10">
          <h1 className="text-xl font-bold flex-shrink-0">Co.</h1>
          <div className="max-w-lg w-full">
            <Search allPosts={[]} setFilteredPosts={() => { }} />
          </div>
        </div>

        {/* Right: Notification & Settings Icons */}
        <div className="flex items-center space-x-4">
          <button className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button>
            <Info className="w-5 h-5" />
          </button>
          <button>
            <Wrench className="w-5 h-5" />
          </button>
          <button onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar selectedCategory={selectedCategory} />

        {/* Main Content */}
        <div className="flex-1 p-6 max-w-4xl mx-auto bg-gray-100 shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-black mb-4">Welcome Back, {username}!</h1>

          {/* New Post Section */}
          <div className="bg-gray-200 p-4 rounded-lg flex items-center space-x-4">
            <img src={avatar} alt="User Avatar" className="w-12 h-12 rounded-full border" />
            <textarea
              className="w-full p-2 rounded-md text-black"
              placeholder="Type a Message..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <FileUpload setUploadedFile={setUploadedFile} />
            <button
              onClick={handlePostSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Share
            </button>
          </div>

          {/* Pinned Announcements */}
          <PinnedPosts posts={posts} />

          {/* Posts */}
          <div className="mt-6 space-y-6">
            {posts
              .filter((post) => selectedCategory === "All" || post.forum_category === selectedCategory)
              .map((post) => (
                <div key={post.forum_id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-md">
                      {post.forum_category}
                    </span>
                    <img src={post.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border" />
                    <p className="text-sm font-semibold text-gray-800">{post.name}</p>
                    <p className="text-xs text-gray-600">{post.timestamp}</p>
                  </div>

                  <h3 className="text-lg text-black font-bold mt-2">{post.title}</h3>
                  <p className="text-gray-900 mt-1">{post.description}</p>

                  {post.file && (
                    <div className="mt-2">
                      {[".jpg", ".jpeg", ".png", ".gif"].some((ext) => post.file.includes(ext)) ? (
                        <img src={post.file} alt="Uploaded" className="w-full max-w-xs rounded-md mt-2" />
                      ) : (
                        <a
                          href={post.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          📂 View Attachment
                        </a>
                      )}
                    </div>
                  )}

                  {/* <EmojiReactions postId={post.forum_id} posts={posts} setPosts={setPosts} /> */}
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => handleLike(post.forum_id)}>
                    <span className="text-lg">👍</span>
                    <span>{post.likes_count}</span>
                  </div>

                  <ReportButton postId={post.forum_id} />

                  {/* Threaded Replies */}
                  <ThreadedReplies postId={post.forum_id} posts={posts} setPosts={setPosts} username={username} />
                </div>
              ))}
          </div>

        </div>

        {/* Suggested Contacts (Right Sidebar) */}
        <div className="hidden lg:block w-64 p-4 bg-white text-gray-800 shadow-md rounded-lg m-6">
          <h2 className="text-lg font-semibold mb-3">Suggested Contacts</h2>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <p className="text-sm">Emma Whitton</p>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <p className="text-sm">Melanie Pearce</p>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <p className="text-sm">Rebecca Taylor</p>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <p className="text-sm">Annmarie Thomson</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
