/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEPLOY_MODE?: 'github-pages' | 'gist' | 'backend'
  readonly VITE_API_BASE_URL?: string
  readonly VITE_GIST_ID?: string
  readonly VITE_GITHUB_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const content: string
  export default content
}

declare module '@fontsource/roboto/300.css'
declare module '@fontsource/roboto/400.css'
declare module '@fontsource/roboto/500.css'
declare module '@fontsource/roboto/700.css'
