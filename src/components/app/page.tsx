import { ReactNode } from "react"

export function QuestionsBanner() {
  return (
    <div className="pt-8 text-base font-semibold leading-7">
      <p className="text-slate-200">Questions?</p>
      <p><a href="#" className="text-yellow-500 hover:text-yellow-700">Answers &rarr;</a></p>
    </div>
  )
}

export function Modal(props: { children: ReactNode }) {
  return(
    <div className="relative dark:bg-gray-800 dark:text-slate-200 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
      <div className="mx-auto max-w-md">
        <div className="divide-y divide-gray-300/50">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export function SignOutModal({redirect}:{
  redirect: string
}){
  return (
    <div id="signout" className="flex p-2">
      <button 
        className="bg-slate-950 p-2 w-full text-slate-500 rounded-lg shadow-xl border-solid border-2 hover:border-dotted border-slate-500"
        onClick={() => {window.location.href='/signout?redirect_to='+redirect}}>Sign Out</button>
    </div>
  )
}
