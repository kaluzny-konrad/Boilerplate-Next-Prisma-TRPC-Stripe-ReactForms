import Chat from "@/components/Chat";

type Props = {
  params: {
    id: string; // remember: same name like [id] folder
  };
};

export default async function ChatIdPage({ params }: Props) {
  const { id } = params;

  return (
    <div>
      <Chat id={id} />
    </div>
  );
}
