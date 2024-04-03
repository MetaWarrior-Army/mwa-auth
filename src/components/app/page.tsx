import { ReactNode } from "react"
import { APP_BASE_URL } from '@/utils/app/constants'

export function InfoBanner({signOutRedirect}:{
  signOutRedirect?:string,
}) {
  return (
    <>
    <div className="pt-8 text-base font-semibold leading-7">
      <p><a href="https://www.metawarrior.army" className="text-yellow-500 hover:text-yellow-700">MetaWarrior Army &rarr;</a></p>
      {signOutRedirect ? 
        <>
          <p>
            <a href={APP_BASE_URL+'/logout?redirect='+signOutRedirect} className="text-slate-500 hover:text-slate-700">
              Logout &rarr;</a>
          </p>
        </>
        : <></>
      }      
    </div>
    </>
  )
}

export function Modal(props: { children: ReactNode }) {
  return(
    <div className="relative dark:bg-gray-800 dark:text-slate-200 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
      <div className="mx-auto max-w-screen">
        <div className="divide-y divide-gray-300/50">
          {props.children}
        </div>
      </div>
    </div>
  )
}


// Depends on being wrapped by Web3Providers
export function FrameHeader({title}:{
  title?: string,
}) {
  return (
    <div className="flex w-full justify-between p-3">
        <div className="">
          <h1 className="text-2xl text-yellow-500 p-5">{title}</h1>
        </div>
        <div className="">
        </div>
      </div>
  )
}

