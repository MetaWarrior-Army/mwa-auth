import { ReactNode } from "react"
import { APP_BASE_URL } from '@/utils/app/constants'
import { ProfileBanner } from "../web3/web3"

export function InfoBanner({signOutRedirect}:{
  signOutRedirect?:string,
}) {
  return (
    <>
    <div className="flex justify-between items-center pt-8 text-base font-semibold">
      <div>
        <ProfileBanner/>
      </div>
      <div>
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
      
    </div>
    </>
  )
}

export function Modal(props: { children: ReactNode }) {
  return(
    <div className={"relative bg-slate-800 text-slate-200 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"}>
      <div className="mx-auto max-w-screen">
        <div className="flex-col justify-start items-end">
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
    <div className="flex w-full justify-between items-start p-3">
        <div className="">
          <h1 className="text-2xl text-yellow-500 p-5">{title}</h1>
        </div>
        <div className="">
          <p className="text-4xl">🔐</p>
        </div>
      </div>
  )
}

