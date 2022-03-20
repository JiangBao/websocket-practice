import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Game from './Game'
import Carousel from './Carousel'
import ChatRoom from './ChatRoom'
import './index.css'

/**
 * 路由布局
 */
const Layout = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/carousel" element={<Carousel />} />
        <Route path="/chatroom" element={<ChatRoom />} />
      </Routes>
    </Router>
  )
}

ReactDOM.render(
  <Layout />,
  document.getElementById('root')
)
