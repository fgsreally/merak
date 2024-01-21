import { Link, Outlet, Route, Routes } from "react-router-dom";
import { MerakApp, MerakImport, MerakScope } from "merak-react";
import { lazy } from "react";

const Block = lazy(() => import("./block"));

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index id={"tohome"} element={<Home />} />
          <Route path="about" id={"toabout"} element={<About />} />
          <Route path="lazy" id={"tolazy"} element={<Lazy />} />
        </Route>
      </Routes>
    </div>
  );
}

export function Lazy() {
  return (
    <>
      Scope:
      <MerakScope name='scope' fakeGlobalVar="block_scope">
        <Block label='scope'></Block>
      </MerakScope>

      Import:
      <MerakImport name='import' fakeGlobalVar="block_import" source="http://localhost:5173/src/block.tsx" props={{label:'import'}}>


      </MerakImport>
    </>
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
          <li>
            <Link to="/lazy">Lazy</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

function About() {
  function hook(msg: string) {
    return () => console.log(msg);
  }
  return (
    <>
      <MerakApp
        name="vite_vue"
        url="http://localhost:4004"
        class="micro"
        route="/about"
        props={{ data: "data from main" }}
        afterMount={hook("aftermount")}
        beforeMount={hook("beforemount")}
        beforeUnmount={hook("beforeunmount")}
        afterUnmount={hook("afterunmount")}
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
