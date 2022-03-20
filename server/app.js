const Koa = require('koa')
const dayjs = require('dayjs')
const router = require('koa-router')()
const websockify = require('koa-websocket')

const app = websockify(new Koa())

/**
 * 模拟数据库，存储连接状态
 */
const chatRoom = {}
const gameRoom = {}

/**
 * 获取游戏房间当前玩家数据
 */ 
const getGameUser = (gameRoom) => {
  return Object.keys(gameRoom).map((uid) => {
    return {
      uid: gameRoom[uid].uid,
      avatarId: gameRoom[uid].avatarId,
      position: gameRoom[uid].position,
    }
  })
}

/**
 * ws 连接路由
 */
router.all('/ws', (ctx) => {
  const { uid, demo, position, avatarId } = ctx.query
  // 模拟轮播事件：定时像连接用户推送模拟事件数据
  if (demo === 'carousel') {
    let count = 0
    setInterval(() => {
      count += 1
      const msg = {
        type: 'carousel',
        msg: `第${count}条事件，触发时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
      }
      ctx.websocket.send(JSON.stringify(msg))
    }, 5000)
  }
  // 聊天室
  if (demo === 'chat') {
    chatRoom[uid] = ctx
    // 广播登录消息
    Object.keys(chatRoom).forEach((uid) => {
      chatRoom[uid].websocket.send(JSON.stringify({ uid: ctx.query.uid, type: 'login' }))
    })
    // 广播聊天消息
    ctx.websocket.on('message', (message) => {
      Object.keys(chatRoom).forEach((uid) => {
        chatRoom[uid].websocket.send(message)
      })
    })
  }
  // 游戏
  if (demo === 'game') {
    // 缓存玩家数据
    gameRoom[uid] = { ctx, uid, avatarId, position: JSON.parse(position) }

    // 广播登录消息
    Object.keys(gameRoom).forEach((uid) => {
      gameRoom[uid].ctx.websocket.send(JSON.stringify({
        type: 'login',
        uid: ctx.query.uid,
        users: getGameUser(gameRoom),
      }))
    })
    // 广播离线消息
    ctx.websocket.on('close', () => {
      delete gameRoom[ctx.query.uid]
      Object.keys(gameRoom).forEach((uid) => {
        gameRoom[uid].ctx.websocket.send(JSON.stringify({
          type: 'close',
          uid: ctx.query.uid,
          users: getGameUser(gameRoom),
        }))
      })
    })
    // 玩家消息处理：移动、攻击、发表情
    ctx.websocket.on('message', (message) => {
      const data = JSON.parse(message)
      // 广播移动消息
      if (data.type === 'move') {
        gameRoom[data.uid].position = data.position
        Object.keys(gameRoom).forEach((uid) => {
          gameRoom[uid].ctx.websocket.send(JSON.stringify({
            type: 'move',
            uid: ctx.query.uid,
            users: getGameUser(gameRoom),
          }))
        })
      }
      // 向玩家推送被攻击消息
      if (data.type === 'attack') {
        gameRoom[data.targetUid].ctx.websocket.send(JSON.stringify({
          type: 'attack',
          sourceUid: data.uid,
        }))
      }
      // 广播发表情的消息
      if (data.type === 'emoji') {
        Object.keys(gameRoom).forEach((uid) => {
          gameRoom[uid].ctx.websocket.send(JSON.stringify({
            type: 'emoji',
            uid: data.uid,
            emojiId: data.emojiId,
          }))
        })
      }
    })
  }
})

// 使用路由
app.ws
  .use(router.routes())
  .use(router.allowedMethods())

// 监听端口
app.listen(3100, () => {
  console.log('服务启动成功，端口3100')
})