import { Package } from "read-pkg-up"

interface Options {
  executable?: string
  cwd?: string
}

export declare const resolveBin: (modName: string, options?: Options) => string
export declare const fromRoot: (...p: string[]) => string
export declare const hasFile: (...p: string[]) => boolean
export declare const hasPkgProp: (props: any) => boolean
export declare const isGdScripts: () => boolean
export declare const hasTests: () => boolean
export declare const logMessage: (messsage: string) => void
export declare const logScriptMessage: (script: string) => void
export declare const parseEnv: (
  name: string,
  defaultValue: string | number | boolean,
) => void
export declare const ifAnyDep: <T, Y>(
  deps: string[] | string,
  ifTrue: T,
  ifFalse: Y,
) => T | Y
export declare const appDirectory: string
export declare const pkg: Package
