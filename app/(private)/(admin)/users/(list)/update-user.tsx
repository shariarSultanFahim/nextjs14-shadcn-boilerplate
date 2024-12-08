"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import handleResponse from "@/lib/response.utils";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import moment from "moment";
import { useGetUserById } from "@/lib/actions/users/user-by-id";
import { useUpdateUser } from "@/lib/actions/users/update-user";
import { useState } from "react";

const UpdateUserSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name must be at least 1 character.",
  }),
  last_name: z.string().min(1, {
    message: "Last name must be at least 1 character.",
  }),
  bio: z.string().optional(),
  dob: z.any().optional(),
  phone: z
    .string()
    .min(11, {
      message: "Phone number must be at least 11 characters.",
    })
    .max(11, { message: "Phone number cannot exceed 11 characters." }),
  secondary_phone: z.string().optional(),
  secondary_email: z.string().optional(),
  address: z.string().min(1, {
    message: "Address must be at least 1 character.",
  }),
  secondary_address: z.string().optional(),
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  user_role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
  is_active: z.boolean(),
});

type UsersFormValues = z.infer<typeof UpdateUserSchema>;

interface UpdateUserProps {
  id: number;
  children: React.ReactNode;
}

export function UpdateUser({
  children,
  id,
}: Readonly<{
  children?: React.ReactNode;
  id: number | string;
}>) {
  const [open, setOpen] = useState(false);

  const { data: user,isLoading } = useGetUserById(id);

  const [userData,setUserData] = useState(user?.data)

  const form = useForm<UsersFormValues>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
        first_name: userData?.data.profile.first_name || "",
        last_name: userData?.data.profile.last_name || "",
        bio: userData?.data.profile.bio || "",
        dob: userData?.data.profile.dob || null,
        phone: userData?.data.profile.phone || "",
        secondary_phone: userData?.data.profile.secondary_phone || "",
        secondary_email: userData?.data.profile.secondary_email || "",
        address: userData?.data.profile.address || "",
        secondary_address: userData?.data.profile.secondary_address || "",
        email: userData?.data.email || "",
        password: "",
        user_role: userData?.data.user_role || null,
        is_active: userData?.data.is_active || true,
    },
    mode: "onChange",
  });

  const { mutateAsync: update, isPending } = useUpdateUser();

  async function onSubmit(data: UsersFormValues) {
    form.clearErrors();
    const res = await handleResponse(() => update({ id: id, data }), [200]);
    if (res.status) {
      toast("Updated!", {
        description: `User has been updated successfully.`
      });
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof UsersFormValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error updating user. Please try again.`,
          action: {
            label: "Retry",
            onClick: () => onSubmit(data),
          },
        });
      } else {
        toast("Error!", {
          description: res.message,
          action: {
            label: "Retry",
            onClick: () => onSubmit(data),
          },
        });
      }
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
          {children || <Button>Update</Button>}
        </SheetTrigger>
        <SheetContent className="max-h-screen overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Update User</SheetTitle>
            <SheetDescription>
              Complete the form below to update the user information.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mt-6 px-1"
            >
              <div className="flex flex-row items-start gap-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Enter bio"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your bio. It is optional.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date: Date | undefined) => {
                              if (date) {
                                field.onChange(format(date, "yyyy-MM-dd"));
                              }
                            }}
                            fromYear={moment().year() - 100}
                            toYear={moment().year()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input placeholder="017XXXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="017XXXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your secondary phone. It is optional.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="example@domain.co" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="secondary_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@domain.co" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your secondary email. It is optional.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 6 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1*</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="1234 Main St, City, Country"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your primary address. It must be a valid address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Address</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="1234 Main St, City, Country"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your secondary address. It is optional. If you
                      enter any address it must be a valid address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <div className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Switch
                          id="is_active"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="is_active">Active Status</Label>
                    </div>
                    <FormDescription>
                      Active status will determine if the employee is active or
                      not.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant={"ghost"}>Cancel</Button>
                </SheetClose>
                <Button type="submit" disabled={isPending}>
                  Save
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
