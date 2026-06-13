import React from 'react';
import "../global.css"

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
      <p>This is the main page of my Next.js app.</p>
      <p>Click on the links in the navigation to explore more.</p>
      <nav>
        <ul>
          <li><a href="/signup">Sign Up</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
