import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
    </div>
  )
}

