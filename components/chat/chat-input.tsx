"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Member, Profile } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";
import { MentionAutocomplete } from "@/components/chat/mention-autocomplete";
import { findMentionedMembers, hasMentionEveryone } from "@/lib/mention-utils";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
  members?: (Member & { profile: Profile })[];
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({
  apiUrl,
  query,
  name,
  type,
  members = [],
}: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [mentionSearch, setMentionSearch] = useState<{
    active: boolean;
    term: string;
    position: { top: number; left: number };
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      // Find mentioned members
      const mentionedMemberIds = findMentionedMembers(values.content, members);
      const mentionEveryone = hasMentionEveryone(values.content);

      await axios.post(url, {
        ...values,
        mentions: mentionedMemberIds,
        mentionEveryone,
      });

      form.reset();
      setMentionSearch(null);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    // Check for @ mention
    const textBeforeCursor = value.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch && members.length > 0) {
      const rect = e.target.getBoundingClientRect();
      setMentionSearch({
        active: true,
        term: mentionMatch[1],
        position: {
          top: 60, // Position above input
          left: rect.left,
        },
      });
    } else {
      setMentionSearch(null);
    }

    form.setValue("content", value);
  };

  const handleMentionSelect = (member: Member & { profile: Profile } | { id: string; profile: { name: string } }) => {
    const currentValue = form.getValues("content");
    const newValue = currentValue.replace(/@\w*$/, `@${member.profile.name} `);
    form.setValue("content", newValue);
    setMentionSearch(null);
    inputRef.current?.focus();
  };

  // Close mention autocomplete on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mentionSearch?.active) {
        setMentionSearch(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mentionSearch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  {/* Mention Autocomplete */}
                  {mentionSearch?.active && (
                    <MentionAutocomplete
                      searchTerm={mentionSearch.term}
                      members={members}
                      onSelect={handleMentionSelect}
                      position={mentionSearch.position}
                      isOpen={mentionSearch.active}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-6 w-6 bg-discord-bg-hover hover:bg-discord-bg-active transition-all duration-200 hover:scale-110 rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-discord-text-secondary" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-discord-bg-hover border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-discord-text-primary placeholder:text-discord-text-muted rounded-lg"
                    placeholder={`Mesaj gönder #${name}`}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

