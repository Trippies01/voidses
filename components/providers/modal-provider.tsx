"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { JoinServerModal } from "@/components/modals/join-server-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { CreateCategoryModal } from "@/components/modals/create-category-modal";
import { EditCategoryModal } from "@/components/modals/edit-category-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <JoinServerModal />
      <EditServerModal />
      <DeleteServerModal />
      <LeaveServerModal />
      <MembersModal />
      <CreateChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <CreateCategoryModal />
      <EditCategoryModal />
      <DeleteMessageModal />
      <MessageFileModal />
    </>
  );
};

