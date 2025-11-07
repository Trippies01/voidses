"use client";

import { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";
import { useNoiseCancellation } from "@/hooks/use-noise-cancellation";

export const KrispController = () => {
  const room = useRoomContext();
  const { isEnabled, enableForRoom, disableForRoom } = useNoiseCancellation();

  useEffect(() => {
    if (!room) return;

    if (isEnabled) {
      enableForRoom(room);
    } else {
      disableForRoom(room);
    }
  }, [isEnabled, room, enableForRoom, disableForRoom]);

  return null;
};
