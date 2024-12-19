import React from "react";

const BlogSection = ({ posts, onNewPost }) => {
  const handleNewPost = () => {
    // Optionally, you can add logic to submit a new post
    // After submission, call the `onNewPost` function to refresh
    onNewPost();
  };

  return (
    <section id="blog-section">
      <h2>Blog Posts</h2>
      <button onClick={handleNewPost} style={{ marginBottom: "20px" }}>
        Refresh Posts
      </button>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={`http://localhost:5000${post.image}`}
                alt={post.title}
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            )}
            <p>
              <em>Posted on {new Date(post.date).toLocaleString()}</em>
            </p>
          </div>
        ))
      ) : (
        <p>No posts yet. Be the first to post!</p>
      )}
    </section>
  );
};

export default BlogSection;
