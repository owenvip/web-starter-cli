/*
 * @Descripttion: 
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-10-21 15:53:01
 */
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import Generator from './generator'
interface Option {
  force?: boolean
} 

async function init (name: string, options: Option) {
  const targetDir  = path.join(process.cwd(), name)
  // 判断目录是否已经存在
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
       const { overwrite } = await inquirer.prompt([
        {
          type: 'input',
          name: 'overwrite',
          message: 'directory already exists, overwrite it?(y/n)',
        }
      ])
      if (overwrite.toLocaleLowerCase() === 'y') {
        await fs.remove(targetDir)
      } else {
        return
      }
    }
  }
  // 创建项目
  const generator = new Generator(name, targetDir);
  // 开始创建项目
  generator.create()
}

export default init