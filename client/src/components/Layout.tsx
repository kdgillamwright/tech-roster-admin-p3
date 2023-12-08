import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {

  return (
    <main className="overflow-y-auto min-h-screen p-5 bg-white">

      <div className="font-bold text-xl pb-2.5">_Technology Roster: Course Admin</div>

      {children}

    </main>
  )
}