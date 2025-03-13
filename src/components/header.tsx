import { Bell, Bot, Crown, Keyboard, KeyboardIcon, Settings, User, Users } from "lucide-react"

export default function Header() {
  return (
    <div className="h-10 w-full fixed top-0 flex flex-row p-8 justify-between items-center text-white">
      <div className="flex flex-row justify-center items-center gap-x-2">
        <KeyboardIcon className="text-white" />
        <h1 className="flex font-mono text-gray-200 ">
          Type<span className="text-sky-300">It</span>
        </h1>
      </div>
      <div className="flex flex-row gap-x-4 text-gray-300">
        <Keyboard className="w-5 h-5 hover:text-neutral-300 cursor-pointer text-neutral-500 hover:scale-110 transition-transform duration-200" />
        <Crown className="w-5 h-5 hover:text-neutral-300 cursor-pointer text-neutral-500 hover:scale-110 transition-transform duration-200" />
        <Bot className="w-5 h-5 hover:text-neutral-300 cursor-pointer text-neutral-500 hover:scale-110 transition-transform duration-200" />
        <Users className="w-5 h-5 hover:text-neutral-300 cursor-pointer text-neutral-500 hover:scale-110 transition-transform duration-200" />
        <Settings className="w-5 h-5 hover:text-neutral-300 cursor-pointer text-neutral-500 hover:scale-110 transition-transform duration-200" />
      </div>

      <div className="flex items-center gap-4">
        <User className="w-5 h-5 hover:text-neutral-300 cursor-pointer text-neutral-500 hover:scale-110 transition-transform duration-200" />
      </div>
    </div>
  );
}