
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema for login form
const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const { isSubmitting } = form.formState;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log("Tentando login via LoginForm com:", data.email);
      await login(data.email, data.password);
      // O redirecionamento acontecerá no AuthContext após verificação do perfil
    } catch (error: any) {
      console.error('Erro de login:', error);
      
      // Mensagens de erro específicas e mais informativas
      if (error.message) {
        if (error.message.includes("inativa")) {
          toast.error('Sua conta está inativa. Entre em contato com o administrador.');
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error('Credenciais inválidas. Verifique seu email e senha.');
        } else if (error.message.includes("Organização SALT não encontrada")) {
          toast.error('Erro no sistema: Organização padrão não configurada. Contate o suporte.');
        } else if (error.message.includes("Perfil do usuário não encontrado")) {
          toast.error('Erro no sistema: Perfil de usuário não encontrado. Contate o suporte.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao fazer login. Verifique suas credenciais.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">CRM Login</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="salt@example.com ou ghf@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={isPasswordVisible ? "text" : "password"} 
                        placeholder="Use 'password' para demo" 
                        {...field} 
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-0 top-0 h-10 w-10"
                      >
                        {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Fazendo login...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
