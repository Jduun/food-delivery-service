import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string } from "zod";
import { z } from "@/lib/ru-zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Link, useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { registerRoute } from "@/api/userRouter";

const formSchema = z
  .object({
    login: string().min(5),
    password: string().min(8),
    passwordConfirm: string().min(8),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Пароли не совпадают",
        path: ["passwordConfirm"],
      });
    }
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
      passwordConfirm: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    registerRoute(data.login, data.password, () => {
      form.setError("login", {
        message: "Пользователь с таким логином уже существует",
      });
    }).then((rs) => {
      if (rs) {
        navigate("/login");
      }
    });
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="md:w-[450px]">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start pb-3">
                    <FormLabel className="text-left">Логин</FormLabel>
                    <FormControl className="w-full">
                      <Input placeholder="Введите свой логин" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start pb-3">
                    <FormLabel className="text-left">Пароль</FormLabel>
                    <FormControl className="w-full">
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start pb-3">
                    <FormLabel className="text-left">
                      Подтверждение пароля
                    </FormLabel>
                    <FormControl className="w-full">
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Зарегистрироваться</Button>
              </div>
            </form>
          </Form>
          <div className="flex w-full justify-center pt-6">
            <Link to="/login">
              <Label className="hover:underline">
                <div className="text-center text-sm/normal">
                  Уже зарегистрированы?
                  <br />
                  Войдите
                </div>
              </Label>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
