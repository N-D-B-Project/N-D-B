import { globSync } from "glob";
import { dirname, sep } from "path";

export default class BaseHandler {
  // eslint-disable-next-line no-empty-function
  public constructor() {}

  public isClass(input) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  public findClass(module) {
    if (module.__esModule) {
      const def = Reflect.get(module, "default");
      if (this.isClass(def)) {
        return def;
      }

      let _class = null;
      for (const prop of Object.keys(module)) {
        const ref = Reflect.get(module, prop);
        if (this.isClass(ref)) {
          _class = ref;
          break;
        }
      }

      return _class;
    }

    return this.isClass(module) ? module : null;
  }

  public get directory() {
    return `${dirname(require.main.filename)}${sep}`;
  }

  public async getFiles(handler: string): Promise<Array<string>> {
    let baseDir: string;
    if (process.env.isCompiled === "true") {
      baseDir = `${this.directory}${handler}/**/*.js`;
    } else {
      baseDir = `${this.directory}${handler}/**/*.ts`;
    }
    const Files = globSync(baseDir);
    Files.forEach(file => delete require.cache[require.resolve(file)]);
    return Files;
  }
}
