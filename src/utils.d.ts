interface Options {
  executable?: string
  cwd?: string
}

export declare const appDirectory: string
export declare const resolveBin: (modName: string, options?: Options) => string
export declare const fromRoot: (...p: string[]) => string
export declare const hasFile: (...p: string[]) => boolean
export declare const hasPkgProp: (props: any) => boolean
export declare const ifAnyDep: (deps: any, t: any, f?: any) => any
export declare const parseEnv: (name: string, def: any) => any
export declare const envIsSet: (name: string) => boolean | "" | undefined
export declare const isGdScripts: () => boolean
export declare const hasTests: () => boolean
export declare const logScriptMessage: (script: string) => void
