import React, { useEffect, useState } from 'react'
import { Badge, Avatar, Divider } from 'antd'
import './index.css'

/**
 * 事件轮播demo
 */
const Carousel = () => {
  const [msgs, setMsgs] = useState([])

  // 页面加载完直接连接 ws 服务
  useEffect(() => {
    const wsObj = new WebSocket('ws://localhost:3100/ws?demo=carousel')
    
    wsObj.onopen = () => {
      console.log('websocket连接成功')
    }

    wsObj.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      setMsgs(prev => [data.msg, ...prev])
    }

    return () => wsObj.close()
  }, [])

  return (
    <div className="carousel">
      {/* 徽标数，小红点 */}
      <div className="badgeWrap">
        <p>小红点</p>
        <Badge count={msgs.length}>
          <Avatar shape="square" size="large" />
        </Badge>
      </div>
      {/* 日志实时轮播 */}
      <div className="contentWrap">
        <p>日志轮播</p>
        {msgs.map((v) => (
          <>
            <div key={v}>{v}</div>
            <Divider />
          </>
        ))}
      </div>
    </div>
  )
}

export default Carousel
