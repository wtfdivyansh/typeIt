"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, LogIn, Hash, BookOpen, Timer } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import CustomSelect from "../custom-select";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoom } from "@/actions/create-room";
import { useRouter } from "next/navigation";

const modeOptions = [
  {
    value: "words",
    label: "Words",
    icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
  },
  {
    value: "time",
    label: "Time",
    icon: <Timer className="w-4 h-4 text-emerald-400" />,
  },
];

export const CreateRoomSchema = z.object({
  roomName: z.string().min(1),
  mode: z.enum(["words", "time"]),
  option: z.enum(["15", "30", "60", "120"]),
});

export default function CreateRoom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof CreateRoomSchema>>({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      roomName: "",
      mode: "words",
      option: "15",
    },
  });

  const selectedMode = useWatch({ control: form.control, name: "mode" });
  console.log(selectedMode);
  const options =
    selectedMode === "words"
      ? [
          {
            value: "15",
            label: "15 words",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
          {
            value: "30",
            label: "30 words",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
          {
            value: "60",
            label: "60 words",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
          {
            value: "120",
            label: "120 words",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
        ]
      : [
          {
            value: "15",
            label: "15 seconds",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
          {
            value: "30",
            label: "30 seconds",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
          {
            value: "60",
            label: "60 seconds",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
          {
            value: "120",
            label: "120 seconds",
            icon: <Timer className="w-4 h-4 text-emerald-400" />,
          },
        ];

  const onSubmit = async (data: z.infer<typeof CreateRoomSchema>) => {
    try {
      setIsLoading(true);
      const { code } = await createRoom(data);
      router.push(`/rooms/${code}`);
      console.log(code);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <motion.div
          key="create"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="roomName"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter room name"
                      className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-500/50 focus:ring-emerald-500/20 pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Hash className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <CustomSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={modeOptions}
                      defaultValue={modeOptions[0].value}
                      label="Mode"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="option"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <CustomSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={options}
                      defaultValue={options[0].value}
                      label="Option"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-medium"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Room...
                </div>
              ) : (
                <div className="flex items-center">
                  <PlusCircle className="w-4 h-4 mr-2" /> Create Room
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </form>
    </Form>
  );
}
