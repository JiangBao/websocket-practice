import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

/**
 * 主页：几个演示页面的索引
 */
const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="home">
      <div className="linkWrap" onClick={() => navigate('/carousel')}>
        事件轮播
      </div>
      <div className="linkWrap" onClick={() => navigate('/chatroom')}>
        聊天室
      </div>
      <div className="linkWrap" onClick={() => navigate('/game')}>
        游戏
      </div>
    </div>
  )
}

export default Home
