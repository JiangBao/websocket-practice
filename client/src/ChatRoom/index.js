import React, { useState, useEffect } from 'react'
import { Input, Button, message, Alert } from 'antd'
import ChatMsg from './message'
import './index.css'

/**
 * 聊天室demo
 */
const ChatRoom = () => {
  const [uid, setUid] = useState('')
  const [msg, setMsg] = useState('')
  const [wsObj, setWSObj] = useState(undefined)
  const [showLogin, setShowLogin] = useState(true)
  const [chatRecord, setChatRecord] = useState([])

  // 销毁连接
  useEffect(() => {
    return () => wsObj && wsObj.close()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 登录
  const handleLogin = () => {
    const user = uid.trim()
    if (!user) {
      return message.error('必须输入用户名')
    }
    const wsConnect = new WebSocket(`ws://localhost:3100/ws?demo=chat&uid=${user}`)
    setWSObj(wsConnect)

    // 登录成功后显示聊天室内容
    wsConnect.onopen = () => setShowLogin(false)
    // 接收广播消息
    wsConnect.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      if (data.type === 'chat' || data.type === 'login') {
        setChatRecord(prev => [...prev, data])
      }
    }
  }

  // 发送消息
  const handleSendMsg = (e) => {
    e.preventDefault()
    const data = {
      type: 'chat',
      uid: uid.trim(),
      time: Date.now(),
      msg: e.target.value,
    }
    setMsg('')
    wsObj.send(JSON.stringify(data))
  }

  return (
    <div>
      {/* 简陋的登录演示 */}
      {showLogin && (
        <div className="chatRoomLogin">
          <Input placeholder="请输入用户名" value={uid} onChange={(e) => setUid(e.target.value)} />
          <Button type="primary" onClick={handleLogin}>进入聊天室</Button>
        </div>
      )}

      {/* 聊天室内容 */}
      {!showLogin && (
        <div className="chatRoom">
          <Alert message={`「${uid.trim()}」网络一线牵，珍惜这段缘`} style={{ textAlign: 'center' }} />
          {/* 消息展示区域 */}
          <div className="chatRoomContent">
            {chatRecord.map((record) => (
              <ChatMsg
                self={uid.trim()}
                source={record.uid}
                type={record.type}
                msg={record.msg}
                time={record.time}
              />
            ))}
          </div>
          {/* 输入框区域 */}
          <div className="chatRoomInput">
            <Input.TextArea
              value={msg}
              bordered={false}
              placeholder="点击输入聊天内容，enter 键发送"
              onPressEnter={handleSendMsg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatRoom
