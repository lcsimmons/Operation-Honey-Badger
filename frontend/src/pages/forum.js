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
import { getForumComments } from "./api/apiHelper.js";

export default function Forum() {
  const router = useRouter();
  const { category } = router.query;
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/default.png");
  const [commentText, setCommentText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [replyText, setReplyText] = useState({});
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: "HR Announcements",
      user: "HR Department",
      avatar: "/default.png",
      message: "🚨 Open Enrollment starts Monday! Check emails for details.",
      timestamp: "3 days ago",
      pinned: true,
      replies: [
        { user: "John", avatar: "/default.png", message: "Do we need to do anything if we're not changing our plan?" },
        { user: "HR Department", avatar: "/default.png", message: "Nope, your current plan will auto-renew unless you make changes." },
      ],
    },
    {
      id: 2,
      category: "IT Support",
      user: "Alice",
      avatar: "/default.png",
      message: "💻 VPN issues again? Mine keeps disconnecting randomly.",
      timestamp: "2 hours ago",
      replies: [
        { user: "Greg (IT)", avatar: "/default.png", message: "Try switching to the backup server. The main one is... having issues." },
        { user: "Michael", avatar: "/default.png", message: "Same here, thought it was just me." },
      ],
    },
    {
      id: 3,
      category: "General Chat",
      user: "Emma",
      avatar: "/default.png",
      message: "🎉 Company holiday party is next week! Who’s in? 🍻",
      timestamp: "30 minutes ago",
      replies: [
        { user: "Mike", avatar: "/default.png", message: "Count me in! Do we need to RSVP?" },
        { user: "Lena", avatar: "/default.png", message: "Excited! Is there a theme this year?" },
      ],
    },
    {
      id: 4,
      category: "General Chat",
      user: "Rowan",
      avatar: "/default.png",
      message: "Does anyone know how to reset 2FA?",
      timestamp: "33 minutes ago",
      replies: [
        { user: "Greg (IT)", avatar: "/default.png", message: "Submit a ticket and prepare to wait. IT is… understaffed." },
      ],
    },
    {
      id: 5,
      category: "HR Announcements",
      user: "HR Department",
      avatar: "/default.png",
      message: "Reminder: Performance reviews start next week. If you haven't completed your self-assessment, make something up. No one reads them.",
      timestamp: "5 days ago",
      replies: [
        { user: "Sarah (Marketing)", avatar: "/default.png", message: "Can I just copy-paste last year's?" },
        { user: "HR Department", avatar: "/default.png", message: "We legally cannot advise that. But also… yes." },
      ],
    },
    {
      id: 6,
      category: "IT Support",
      user: "Greg (IT Lead)",
      avatar: "/default.png",
      message: "To whoever named their WiFi 'Opossum Infiltration Unit'—we appreciate the branding, but it’s causing security audits to fail.",
      timestamp: "3 days ago",
      replies: [
        { user: "Kevin (Cybersecurity)", avatar: "/default.png", message: "Would it help if we renamed it 'Definitely Not a Rogue AP'?" },
        { user: "Greg (IT Lead)", avatar: "/default.png", message: "That somehow makes it worse." },
      ],
    },
    {
      id: 7,
      category: "General Chat",
      user: "Derek (Legal)",
      avatar: "/default.png",
      message: "If your work requires 'mild trespassing,' please stop calling it 'social engineering' in reports. The SEC has questions.",
      timestamp: "2 days ago",
      replies: [
        { user: "Nick (Field Ops)", avatar: "/default.png", message: "Okay but what about ‘urban vulnerability assessment’?" },
        { user: "Derek (Legal)", avatar: "/default.png", message: "That’s just trespassing with extra steps." },
      ],
    },
    {
      id: 8,
      category: "IT Support",
      user: "Kevin (Cybersecurity)",
      avatar: "/default.png",
      message: "Can we PLEASE stop naming phishing test emails 'Totally Not A Scam'?",
      timestamp: "3 days ago",
      replies: [
        { user: "Sarah (Marketing)", avatar: "/default.png", message: "I opened one because it was funny. Now I have to do mandatory training again." },
        { user: "Greg (IT Lead)", avatar: "/default.png", message: "That’s the third time this month, Sarah." },
      ],
    },
    {
      id: 9,
      category: "Anonymous Feedback",
      user: "Anonymous",
      avatar: "/default.png",
      message: "Opossum Dynamics is great, but why does my job title keep changing? I was hired as a Security Engineer. Now I’m a 'Tactical Compliance Enforcer.'",
      timestamp: "2 weeks ago",
      replies: [
        { user: "HR Department", avatar: "/default.png", message: "Titles are fluid. Consider it career development." },
      ],
    },
    {
      id: 10,
      category: "Field Operations",
      user: "Operations Lead",
      avatar: "/default.png",
      message: "Reminder: If you get caught during a penetration test, we do NOT bail you out. You knew the risks.",
      timestamp: "5 days ago",
      replies: [
        { user: "Nick (Field Ops)", avatar: "/default.png", message: "So just to be clear… if I’m in jail… that’s a me problem?" },
        { user: "Operations Lead", avatar: "/default.png", message: "Correct." },
      ],
    },
    {
      id: 11,
      category: "AI & Data Science",
      user: "AI Research Team",
      avatar: "/default.png",
      message: "Our AI successfully convinced a real customer support agent that it was human. Should we be worried?",
      timestamp: "1 week ago",
      replies: [
        { user: "Legal Team", avatar: "/default.png", message: "YES." },
        { user: "AI Research Team", avatar: "/default.png", message: "Cool cool cool, no doubt no doubt." },
      ],
    },
    {
      id: 12,
      category: "Cybersecurity",
      user: "Cybersecurity Team",
      avatar: "/default.png",
      message: "Stop running unapproved pen tests on our own VPN. We KNOW it's bad. Let us suffer in peace.",
      timestamp: "3 days ago",
      replies: [
        { user: "Jared (Engineering)", avatar: "/default.png", message: "But what if it gets worse?" },
        { user: "Cybersecurity Team", avatar: "/default.png", message: "It can't. It literally cannot." },
      ],
    }
  ]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatar");

    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setUsername(storedUsername || "Employee");
      setAvatar(storedAvatar || "/default.png");

      //add tge the information for the forum
      
      const res = getForumComments();

      res.then((result) => {
        if(result.status !== 200){
          console.log("There was an error");
          return ;
        }

        const resObj = result.data;

        setPosts(resObj);

        console.log(resObj);
      }).catch((err) => {
        console.log(err);
      })
    }
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleCommentSubmit = () => {
    if (!commentText.trim() && !uploadedFile) return;

    const newPostEntry = {
      id: posts.length + 1,
      category: selectedCategory === "All" ? "General Chat" : selectedCategory,
      user: username,
      avatar: avatar,
      message: commentText,
      timestamp: "Just now",
      likes: 0,
      replies: [],
      file: uploadedFile,
    };

    setPosts([newPostEntry, ...posts]);
    setCommentText("");
    setUploadedFile(null);
  };

  
  const handleLogout = () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
    
      try {
        router.push("/login");
      } catch (err) {
        console.error("Logout redirect failed:", err);
      }
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
              onClick={handleCommentSubmit}
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
                <div key={post.comment_id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-md">{post.forum_category}</span>
                    <img src={post.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border" />
                    <p className="text-sm font-semibold text-gray-800">{post.name}</p>
                    <p className="text-xs text-gray-600">{post.timestamp}</p>
                  </div>
                  <p className="text-gray-900 mt-2">{post.comment}</p>

                  {post.file && (
                    <div className="mt-2">
                      {post.file.includes(".jpg") || post.file.includes(".jpeg") || post.file.includes(".png") || post.file.includes(".gif") ? (
                        <img src={post.file} alt="Uploaded" className="w-full max-w-xs rounded-md mt-2" />
                      ) : (
                        <a href={post.file} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          📂 View Attachment
                        </a>
                      )}
                    </div>
                  )}

                  <EmojiReactions postId={post.id} posts={posts} setPosts={setPosts} />
                  <ReportButton postId={post.id} />

                  {/* Threaded Replies */}
                  <ThreadedReplies postId={post.id} posts={posts} setPosts={setPosts} />
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
