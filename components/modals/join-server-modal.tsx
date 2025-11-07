"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  inviteUrl: z.string().min(1, {
    message: "Davet linki gereklidir."
  }).url({
    message: "Geçerli bir link giriniz."
  })
});

export const JoinServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const [error, setError] = useState("");

  const isModalOpen = isOpen && type === "joinServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteUrl: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const extractInviteCode = (url: string) => {
    try {
      // Extract invite code from URL
      // Supports: http://localhost:3000/invite/ABC123
      //           localhost:3000/invite/ABC123
      //           /invite/ABC123
      //           ABC123
      
      const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
      const parts = urlObj.pathname.split('/');
      const inviteCode = parts[parts.length - 1];
      
      if (inviteCode && inviteCode.length > 5) {
        return inviteCode;
      }
      
      // If just code provided
      if (url.length > 5 && !url.includes('/')) {
        return url;
      }
      
      return null;
    } catch {
      // If not a valid URL, check if it's just the code
      if (url.length > 5 && !url.includes('/')) {
        return url;
      }
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError("");
      const inviteCode = extractInviteCode(values.inviteUrl);
      
      if (!inviteCode) {
        setError("Geçersiz davet linki!");
        return;
      }

      // Navigate to invite page
      router.push(`/invite/${inviteCode}`);
      form.reset();
      onClose();
    } catch (error) {
      console.log(error);
      setError("Bir hata oluştu!");
    }
  }

  const handleClose = () => {
    form.reset();
    setError("");
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Bir Sunucuya Katıl
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Var olan bir sunucuya katılmak için aşağıya bir davet gir
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="inviteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Davet Bağlantısı
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="http://localhost:3000/invite/abc123..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {error && (
                      <p className="text-xs text-rose-500 mt-1">{error}</p>
                    )}
                  </FormItem>
                )}
              />
              <div className="text-xs text-zinc-500 space-y-1">
                <p className="font-semibold">Davetler şöyle görünür:</p>
                <p className="text-[11px] bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                  hTKzmak
                </p>
                <p className="text-[11px] bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                  http://localhost:3000/invite/hTKzmak
                </p>
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="ghost"
                  disabled={isLoading}
                >
                  Geri
                </Button>
                <Button 
                  variant="default" 
                  disabled={isLoading}
                  type="submit"
                >
                  Sunucuya Katıl
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

