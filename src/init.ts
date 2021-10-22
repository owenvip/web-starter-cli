/*
 * @Descripttion: 
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-10-21 15:53:01
 */
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'

interface Option {
  force?: boolean
}

async function init (name: string, options: Option) {
  const targetDir  = path.join(process.cwd(), name)
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
       const { overwrite } = await inquirer.prompt([
        {
          type: 'input',
          name: 'overwrite',
          message: 'target directory already exists, overwrite it?(y/n)',
          default: 'n'
        }
      ])
      if (!overwrite) {
        return;
      } else if (overwrite.toLocaleLowerCase() === 'y') {
        await fs.remove(targetDir)
      }
    }
  }
}

export default init