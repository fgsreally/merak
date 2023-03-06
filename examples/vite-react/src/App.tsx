import { NavLink, Route, BrowserRouter as Router } from 'react-router-dom'
import './App.css'

function Nav() {
  return (
    <nav>
    <NavLink to="/home">首页</NavLink> | <NavLink to="/dialog">弹窗</NavLink> |{' '}
    <NavLink to="/location">路由</NavLink> | <NavLink to="/communication">通信</NavLink> |{' '}
    <NavLink to="/state">状态</NavLink>
  </nav>

  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router basename={basename}>
          <div>
            <Nav />
            <img src={logo} className="App-logo" alt="logo" />

              <Route exact path="/home">
                <Home />
              </Route>
              <Route path="/dialog">
                <Dialog />
              </Route>
              <Route path="/location">
                <Location />
              </Route>
              <Route path="/communication">
                <Communication />
              </Route>
              <Route path="/state">
                <State />
              </Route>

          </div>
        </Router>
      </header>
    </div>
  )
}

export default App
