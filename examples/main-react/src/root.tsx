import { Link, Outlet, Route, Routes } from "react-router-dom";
import { MerakApp } from "merak-react";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index id={"tohome"} element={<Home />} />
          <Route path="about" id={"toabout"} element={<About />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

function About() {
  return (
    <>
      <MerakApp
        name="vite_vue"
        url="http://localhost:4004"
        class="micro"
        route="/about"
        props={{ data: "data from main" }}
      ></MerakApp>
    </>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
