import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useParams,
  useNavigate } from 'react-router-dom';

const BlogPosts = {
  'first-blog-post': {
    title: 'First Blog Post',
    description: 'Lorem ipsum dolor sit amet, consectetur adip.'
  },
  'second-blog-post': {
    title: 'Second Blog Post',
    description: 'Hello React Router v6'
  }
};

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Home View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

function About() {
  return (
    <div style={{ padding: 20 }}>
      <h2>About View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

function Posts() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Blog</h2>
      <Outlet />
    </div>
  );
}

function PostLists() {
  return (
    <ul>
      {Object.entries(BlogPosts).map(([slug, { title }]) => (
        <li key={slug}>
          <Link to={`/posts/${slug}`}>
            <h3>{title}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Post() {
  const { slug } = useParams();
  const post = BlogPosts[slug];
  if(!post) {
    return <span>The blog post you've requested doesn't exist.</span>;
  }
  const { title, description } = post;
  return (
    <div style={{ padding: 20 }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function NoMatch() {
  return (
    <div style={{ padding: 20 }}>
      <h2>404: Page Not Found</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

function Stats({ user }) {
  const navigate = useNavigate();

  if(!user) {
    return (
      <Navigate to="/login" replace/>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Stats View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

function ProtectedRoute({ user, children }) {
  const navigate = useNavigate();

  if(!user) {
    return (
      <Navigate to="/login" replace/>
    );
  }

  return children;
}

function Login({ onLogin }) {
  const [creds, setCreds] = useState({});
  const navigate = useNavigate();

  function handleLogin() {
    // For demonstration purposes only. Never use these checks in production!
    // Use a proper authentication implementation
    if(creds.username === 'admin' && creds.password === '123') {
      onLogin && onLogin({username: creds.username});
      navigate('/stats');
    }
  }
  return (
    <div style={{ padding: 10 }}>
      <br/>
      <span>Username:</span><br/>
      <input
        type="text"
        onChange={(e) => setCreds({...creds, username: e.target.value})}/><br/>
      <span>Password:</span><br/>
      <input
        type="password"
        onChange={(e) => setCreds({...creds, password: e.target.value})}/><br/><br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function AppLayout() {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  function logOut() {
    setUser(null);
    navigate("/");
  }

  return (
    <>
      <nav style={{ margin: 10 }}>
          <Link to="/" style={{ padding: 5 }}>
          Home
          </Link>
          <Link to="/posts" style={{ padding: 5 }}>
          Posts
          </Link>
          <Link to="/about" style={{ padding: 5 }}>
          About
          </Link>
          <span> | </span>
          { user && <Link to="/stats" style={{ padding: 5 }}>
          Stats
          </Link> }
          { !user && <Link to="/login" style={{ padding: 5 }}>
          Login
          </Link> }
          { user && <span onClick={logOut} style={{ padding: 5, cursor: 'pointer' }}>
          Logout
          </span> }
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />}>
          <Route index element={<PostLists />} />
          <Route path=":slug" element={<Post />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={setUser}/>} />
        <Route path="/stats" element={<ProtectedRoute user={user}><Stats user={user}/></ProtectedRoute>} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
        <AppLayout/>
    </Router>
  );
}

export default App;
