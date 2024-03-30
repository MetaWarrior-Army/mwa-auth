import { ReactNode } from "react"

export function Page(props: { children: ReactNode }) {
  return(
    <main className="flex font-mono min-h-screen flex-col items-center justify-between p-5">
      {props.children}
    </main>
  )
}

export function Header () {
  return (
    <p className="text-xl text-yellow-500">Login to <span className="text-lg font-bold">MetaWarrior Army</span></p> 
  )
}

export function Frame(props: { children: ReactNode }) {
  return (
    <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12">
          <div className="absolute inset-0 bg-center">
          </div>
          {props.children}
        </div>
    </div>
  )
}

export function Footer () {
  return (
    <p className="text-xs">home | terms of service | privacy policy | github</p>
  )
}
