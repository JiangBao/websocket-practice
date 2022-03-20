import React from 'react'
import { Image } from 'antd'
import Avatar01 from '../static/avatar01.png'
import Avatar02 from '../static/avatar02.png'
import Avatar03 from '../static/avatar03.png'
import Avatar04 from '../static/avatar04.png'
import Avatar05 from '../static/avatar05.png'
import Avatar06 from '../static/avatar06.png'
import Avatar07 from '../static/avatar07.png'
import Avatar08 from '../static/avatar08.png'
import Avatar09 from '../static/avatar09.png'
import Avatar10 from '../static/avatar10.png'
import Avatar11 from '../static/avatar11.png'
import Avatar12 from '../static/avatar12.png'
import Avatar13 from '../static/avatar13.png'

const EMOJIS = ['😎', '👽', '🤬', '👍', '👎', '🧑🏼‍💻', '🐶', '🐷', '🦁', '🏀', '🥇', '💊', '🎉']
const AVATARS = [
  Avatar01,
  Avatar02,
  Avatar03,
  Avatar04,
  Avatar05,
  Avatar06,
  Avatar07,
  Avatar08,
  Avatar09,
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar13,
]

/**
 * 头像管理
 */
const GameAvatar = ({ avatarId = 0, emojiId }) => {
  const avatarSrc = AVATARS[avatarId]

  return (
    <div>
      <Image src={avatarSrc} preview={false} />
      {typeof emojiId !== 'undefined' && (
        <div className="emoji">{EMOJIS[emojiId]}</div>
      )}
    </div>
  )
}

export default GameAvatar
