"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/actions/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await createAccount(data);
      if (res?.error) throw new Error(res.error);

      toast.success("Account created successfully");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Initial Balance */}
            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">
                  {errors.balance.message}
                </p>
              )}
            </div>

            {/* Default Account Switch */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <label htmlFor="isDefault" className="text-base font-medium">
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
