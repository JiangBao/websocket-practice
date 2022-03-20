import React from 'react'
import dayjs from 'dayjs'
import { Image, Tooltip } from 'antd'
import SelfPic from '../static/user-self.png'
import OtherPic from '../static/user-other.png'
import './index.css'

/**
 * 聊天信息展示组件
 */
const ChatMsg = ({ self, source, type, msg, time }) => {
  // 登录信息
  const LoginMsg = () => {
    return (
      <div className="loginMsg">
        「{source}」加入聊天，欢迎他/她
      </div>
    )
  }
  // 自己发送的信息
  const SelfMsg = () => {
    return (
      <div className="selfMsg">
        <div className="msgWrap">{msg}</div>
        <Tooltip
          placement="left"
          mouseEnterDelay={1}
          title={`「${source}」发送于 ${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}`}
        >
          <Image className="userAvatar" src={SelfPic} preview={false} />
        </Tooltip>
      </div>
    )
  }
  // 别人发送的信息
  const OtherMsg = () => {
    return (
      <div className="otherMsg">
        <Tooltip
          placement="right"
          mouseEnterDelay={1}
          title={`「${source}」发送于 ${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}`}
        >
          <Image className="userAvatar" src={OtherPic} preview={false} />
        </Tooltip>
        <div className="msgWrap">{msg}</div>
      </div>
    )
  }

  if (type === 'login') {
    return <LoginMsg />
  } else if (self === source) {
    return <SelfMsg />
  } else {
    return <OtherMsg />
  }
}

export default ChatMsg
