import ChatAddForm from "@/components/Chat/ChatAddForm";
import ChatWrapper from "@/components/Chat/ChatWrapper";
import Chats from "@/components/Chat/Chats";

type Props = {
  params: {
    id: string; // remember: same name like [id] folder
  };
};

export default async function ChatIdPage({ params }: Props) {
  const { id } = params;

  return (
    <div className="flex max-h-[80vh]">
      {/* left side */}
      <div className="hidden lg:flex lg:w-1/4 lg:flex-col gap-4 p-4">
          <ChatAddForm />
          <Chats />
      </div>

      {/* right side */}
      <div className="flex-1">
        <ChatWrapper id={id} />
      </div>
    </div>
  );
}
