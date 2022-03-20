import React, { useState } from 'react'
import { Input, Button, message, Tooltip } from 'antd'
import Avatar from './avatar'
import './index.css'

/**
 * 游戏连接demo
 */
const Game = () => {
  const [uid, setUid] = useState('')
  const [users, setUsers] = useState([])
  const [avatarId, setAvatarId] = useState(0)
  const [wsObj, setWSObj] = useState(undefined)
  const [showLogin, setShowLogin] = useState(true)
  const [emojiStatus, setEmojiStatus] = useState({})
  const [isAttacking, setIsAttacking] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // 登录
  const handleLogin = () => {
    const user = uid.trim()
    if (!user) {
      return message.error('必须输入用户名')
    }
    const avatar = Math.floor(Math.random() * 13)
    const initialX = Math.floor(Math.random() * window.innerWidth * 0.8)
    const initialY = Math.floor(Math.random() * window.innerHeight * 0.8)
    const initialPositon = { x: initialX, y: initialY }
    const wsConnect = new WebSocket(`ws://localhost:3100/ws?demo=game&uid=${user}&avatarId=${avatar}&position=${JSON.stringify(initialPositon)}`)
    setWSObj(wsConnect)
    setAvatarId(avatar)
    setPosition(initialPositon)

    // 登录成功后显示聊天室内容
    wsConnect.onopen = () => setShowLogin(false)
    // 接收广播消息
    wsConnect.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      // 登录消息
      if (data.type === 'login') {
        setUsers(data.users)
        message.info(`「${data.uid}」加入游戏啦`)
      }
      // 离线消息
      if (data.type === 'close') {
        message.info(`「${data.uid}」离开游戏啦`)
        setUsers(data.users)
      }
      // 移动消息
      if (data.type === 'move') {
        setUsers(data.users)
      }
      // 攻击消息
      if (data.type === 'attack') {
        message.error(`「${data.sourceUid}」攻击了你`)
        setIsAttacking(true)
        setTimeout(() => {
          setIsAttacking(false)
        }, 2000);
      }
      // 发表情消息
      if (data.type === 'emoji') {
        const emojis = { ...emojiStatus, [data.uid]: data.emojiId }
        setEmojiStatus(emojis)
        setTimeout(() => {
          const emojis = { ...emojiStatus, [data.uid]: undefined }
          setEmojiStatus(emojis)
        }, 1500)
      }
    }
  }

  // 玩家控制移动
  const handleMove = (e) => {
    const currPosition = { x: e.clientX, y: e.clientY }
    const msg = { uid, position: currPosition, type: 'move' }
    setPosition(currPosition)
    wsObj.send(JSON.stringify(msg))
  }

  // 攻击处理逻辑
  const handleAttack = (e, targetUid) => {
    e.preventDefault()
    e.stopPropagation()
    wsObj.send(JSON.stringify({ uid, targetUid, type: 'attack' }))
  }

  // 发送表情
  const handleEmoji = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const emojiId = Math.floor(Math.random() * 13)
    wsObj.send(JSON.stringify({ uid, emojiId, type: 'emoji' }))
  }

  return (
    <div>
      {/* 简陋的登录界面 */}
      {showLogin && (
        <div className="chatRoomLogin">
          <Input placeholder="请输入用户名" value={uid} onChange={(e) => setUid(e.target.value)} />
          <Button type="primary" onClick={handleLogin}>进入游戏</Button>
        </div>
      )}

      {/* 游戏主页面内容 */}
      {!showLogin && (
        <div className="game" onClick={handleMove}>
          {/* 玩家自身 */}
          <div
            onClick={handleEmoji}
            style={{ top: position.y, left: position.x }}
            className={`user self ${isAttacking && 'attacked'}`}
          >
            <Avatar avatarId={avatarId} emojiId={emojiStatus[uid]} />
            <p>{uid}</p>
          </div>
          {/* 同屏其他玩家 */}
          {users.map((user) => {
            if (user.uid !== uid) {
              return (
                <div
                  key={user.uid}
                  className="user other"
                  onClick={(e) => handleAttack(e, user.uid)}
                  style={{ top: user.position.y, left: user.position.x }}
                >
                  <Tooltip title="点击该玩家即可发起攻击">
                    <Avatar avatarId={user.avatarId} emojiId={emojiStatus[user.uid]} />
                    <p>{user.uid}</p>
                  </Tooltip>
                </div>
              )
            } else {
              return ''
            }
          })}
        </div>
      )}
    </div>
  )
}

export default Game
