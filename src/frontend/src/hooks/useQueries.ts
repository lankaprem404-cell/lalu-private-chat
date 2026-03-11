import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage } from "../backend.d";
import { useActor } from "./useActor";

export function useGetMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sender, text }: { sender: string; text: string }) => {
      if (!actor) throw new Error("No actor");
      const timestamp = BigInt(Date.now()) * BigInt(1_000_000);
      await actor.sendMessage(sender, text, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}
