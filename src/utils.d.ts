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
export declare const logScriptMessage: (script: string) => void
