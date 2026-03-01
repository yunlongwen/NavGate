import bcrypt from 'bcrypt'

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise(resolve => {
    readline.question(query, answer => {
      resolve(answer)
    })
  })
}

async function hashPassword() {
  console.log('\n=== NavGate 密码加密工具 ===\n')
  console.log('提示：密码至少需要 8 个字符\n')

  const password = await question('请输入密码：')
  const confirm = await question('请确认密码：')

  if (password !== confirm) {
    console.log('\n❌ 两次输入的密码不一致！')
    readline.close()
    process.exit(1)
  }

  if (password.length < 8) {
    console.log('\n❌ 密码长度至少为 8 位！')
    readline.close()
    process.exit(1)
  }

  console.log('\n正在加密密码...\n')

  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    console.log('✅ 密码加密成功！\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('加密后的密码：')
    console.log(hashedPassword)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n使用说明：')
    console.log('1. 复制上面的加密密码')
    console.log('2. 将其粘贴到 .env 文件中的 AUTH_PASSWORD 字段')
    console.log('3. 示例：AUTH_PASSWORD=' + hashedPassword)
    console.log('\n注意事项：')
    console.log('- 请妥善保管加密后的密码')
    console.log('- 请勿提交 .env 文件到 Git 仓库')
    console.log('- 原始密码无法从加密密码恢复')
  } catch (error) {
    console.error('\n❌ 加密失败：', error)
    readline.close()
    process.exit(1)
  }

  readline.close()
}

hashPassword()
