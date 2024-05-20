import ChatAddForm from "@/components/ChatAddForm";
import Chats from "@/components/Chats";

export default function ChatPage() {
  return (
    <div>
      <h1>Open Chats</h1>
      <Chats />

      <ChatAddForm />
    </div>
  );
}
