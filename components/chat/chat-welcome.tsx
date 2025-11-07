import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
};

export const ChatWelcome = ({
  name,
  type
}: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center mb-2">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold text-zinc-800 dark:text-white">
        {type === "channel" ? `#${name} kanalına hoş geldiniz!` : name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `Bu, #${name} kanalının başlangıcı. İlk mesajı sen at!`
          : `${name} ile konuşmanızın başlangıcı.`
        }
      </p>
    </div>
  )
}

