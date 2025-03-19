import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useUserRoutes } from "@/api/userRoutes";

const formSchema = z.object({
  login: z.string().min(5),
  password: z.string().min(8),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginRoute, saveToken } = useUserRoutes(navigate);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    loginRoute(data.login, data.password, () => {
      form.setError("password", {
        message: "Неверный логин или пароль",
      });
    })
      .then((rs) => {
        if (rs) {
          saveToken(rs.data.token);
        }
      })
      .catch();
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="md:w-[450px]">
        <CardHeader>
          <CardTitle>Вход</CardTitle>
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

              <div className="flex justify-end">
                <Button type="submit">Войти</Button>
              </div>
            </form>
          </Form>
          <div className="flex w-full justify-center pt-6">
            <Link to="/register">
              <Label className="hover:underline">
                <div className="text-center text-sm/normal">
                  Вы ещё не зарегистрированы?
                  <br />
                  Зарегистрируйтесь
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
