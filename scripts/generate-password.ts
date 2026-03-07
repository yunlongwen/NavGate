import bcrypt from 'bcrypt'

async function generatePasswordHash() {
  const password = 'admin123' // 默认密码
  const saltRounds = 10

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log(hashedPassword)
  } catch (error) {
    console.error('加密失败：', error)
    process.exit(1)
  }
}

generatePasswordHash()
