import Chat from "@/components/Chat";
import Chats from "@/components/Chats";
import { cn } from "@/lib/utils";

type Props = {
  params: {
    id: string; // remember: same name like [id] folder
  };
};

export default async function ChatIdPage({ params }: Props) {
  const { id } = params;

  return (
    <div className="flex">
      {/* left side */}
      <div className="hidden lg:flex lg:w-1/4">
        <div className="flex-1">
          <Chats />
        </div>
      </div>

      {/* right side */}
      <div className="flex-1">
        <Chat id={id} />
      </div>
    </div>
  );
}
