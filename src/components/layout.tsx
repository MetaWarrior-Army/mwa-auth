import { ReactNode } from "react"
import Image from 'next/image'

export function Page(props: { children: ReactNode }) {
  return(
    <main className="flex font-mono min-h-screen flex-col items-center justify-between p-5">
      {props.children}
    </main>
  )
}

export function Header ({title}:{
  title: string
}) {
  return (
    <div className="flex">
      <div className="w-full text-start">
        <Image src="https://www.metawarrior.army/media/img/logo.png" alt="github_icon" width={300} height={10}/>
      </div>
      <div className="text-xs text-slate-300 text-end font-bold w-full">
        <p>{title}</p>
      </div>
      
    </div>
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
    <div className="text-xs flex align-top">
      <a href="https://www.metawarrior.army" className="">
        <Image src="https://www.metawarrior.army/media/img/icon.png" alt="mwa_icon" width={25} height={25}/>
      </a> 
      | 
      <a href="https://www.metawarrior.army/privacy" className="text-yellow-500 hover:text-yellow-700">Privacy Policy</a> 
      | 
      <a href="https://www.metawarrior.army/tos" className="text-yellow-500 hover:text-yellow-700">Terms of Service</a> 
      | 
      <a href="https://github.com/metawarrior-army" className="" target="_blank">
        <Image src="https://www.metawarrior.army/media/img/github-mark.png" alt="github_icon" width={25} height={25}/>
      </a>
    </div>
  )
}
