import ChatAddForm from "@/components/ChatAddForm";
import ChatNew from "@/components/ChatNew";
import Chats from "@/components/Chats";

export default function ChatPage() {

  

  return (
    <div className="flex max-h-[80vh]">
      {/* left side */}
      <div className="hidden lg:flex lg:w-1/4 lg:flex-col gap-4 p-4">
          <ChatAddForm />
          <Chats />
      </div>

      {/* right side */}
      <div className="flex-1">
        <ChatNew />
      </div>
    </div>
  );
}
