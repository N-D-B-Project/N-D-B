import NDBClient from "@/Core/NDBClient"
import { glob } from "glob"
import { dirname, sep } from "path"
import { promisify } from "util"
const globProm = promisify(glob)

export default class BaseHandler {
  public constructor(private client: NDBClient) {
    this.client = client
  }

  public isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    )
  }

  public findClass(module: any) {
    if (module.__esModule) {
      const def = Reflect.get(module, "default")
      if (this.isClass(def)) {
        return def
      }

      let _class = null
      for (const prop of Object.keys(module)) {
        const ref = Reflect.get(module, prop)
        if (this.isClass(ref)) {
          _class = ref
          break
        }
      }

      return _class
    }

    return this.isClass(module) ? module : null
  }

  public get directory() {
    return `${dirname(require.main.filename)}${sep}`
  }

  public async getFiles(handler: string): Promise<Array<string>> {
    var baseDir: string
    if (process.env.isCompiled === "true")
      baseDir = `${this.directory}${handler}/**/*.js`
    else baseDir = `${this.directory}${handler}/**/*.ts`
    const Files = await globProm(baseDir)
    Files.forEach(file => delete require.cache[require.resolve(file)])
    return Files
  }
}
