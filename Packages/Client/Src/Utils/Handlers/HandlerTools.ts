import { dirname, sep } from "path";

export default class HandlerTools {
  public constructor() {}

  public isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  public findClass(module: any) {
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
}
