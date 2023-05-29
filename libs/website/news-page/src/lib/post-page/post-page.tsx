export function PostPage({ post }) {
  return (
    <div>
      post-page works!
      <div>{post.title}</div>
      <div>{post.userId}</div>
      <div>{post.id}</div>
      <div>{post.body}</div>
    </div>
  );
}
