/*
 * @Descripttion: 
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-10-22 10:57:30
 */

import ora from 'ora'
import chalk from 'chalk'
import inquirer from 'inquirer'
import gitDown from 'download-git-repo'
import { promisify } from 'util'

enum LANG {
  REACT = 'react',
  VUE = 'main',
  VUEJS = 'vue-js',
}

type Fn = (...arg: unknown[]) => Promise<void>

// 添加加载动画
async function loading(fn: Fn , message: string, ...args: unknown[]) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();
  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result; 
  } catch (error) {
    // 状态为修改为失败
    spinner.fail('Request failed, refetch ...')
    throw error
  } 
}

class Generator {
  public name;
  public targetDir;
  private fetchGitRepo
  constructor (name: string, targetDir: string){
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    this.fetchGitRepo = promisify(gitDown) as Fn
  }

  async getLang() {
    const choices = [
      {
        name: 'react',
        value: LANG.REACT,
      },
      {
        name: 'vue3+ts',
        value: LANG.VUE,
      },
      {
        name: 'vue3+js',
        value: LANG.VUEJS,
      },
    ]
    const { lang } = await inquirer.prompt({
      name: 'lang',
      type: 'list',
      choices,
      message: 'Place choose a framework to create project'
    })
    return lang
  }

  // 下载远程模板
  async download(branch: LANG){
    // 1）仓库地址
    const requestUrl = `owenvip/web-starter#${branch}`;
    // 2）下载
    return await loading(
      this.fetchGitRepo,
      'waiting download template',
      requestUrl,
      this.targetDir
    )
  }

  async create(){
    const lang = await this.getLang()
    await this.download(lang)
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\ncd ${chalk.cyan(this.name)}`)
    console.log('\r\nnpm install')
    console.log('npm start\r\n')
  }
}

export default Generator