
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Copy, Check, EyeOff, Eye, RefreshCw, UserPlus } from 'lucide-react';
import { toast } from "sonner";
import { UserRole, Organization } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { generatePassword, copyToClipboard } from "@/utils/passwordUtils";

interface CreateUserFormProps {
  organizations: Organization[];
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ organizations, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generateRandomPassword, setGenerateRandomPassword] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    password: generatePassword(),
    firstName: '',
    lastName: '',
    organizationId: '',
    role: 'USER' as UserRole,
  });

  const regeneratePassword = () => {
    setFormData(prev => ({...prev, password: generatePassword()}));
    setCopied(false);
  };

  const handleCopyPassword = async () => {
    const success = await copyToClipboard(formData.password);
    if (success) {
      setCopied(true);
      toast.success('Senha copiada para a área de transferência');
      
      // Reset copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Falha ao copiar senha');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { email, password, firstName, lastName, organizationId, role } = formData;
      
      // Validar campos
      if (!email || (!password && !generateRandomPassword) || !firstName || !lastName || !organizationId || !role) {
        throw new Error('Todos os campos são obrigatórios');
      }
      
      // Gerar senha aleatória se a opção estiver marcada
      const finalPassword = generateRandomPassword ? formData.password : password;
      
      // Criar usuário na autenticação
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: finalPassword,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          organization: (organizations.find(org => org.id === organizationId)?.code) || null,
          role
        }
      });
      
      if (error) throw error;
      
      toast.success('Usuário criado com sucesso!');
      setOpen(false);
      setFormData({
        email: '',
        password: generatePassword(),
        firstName: '',
        lastName: '',
        organizationId: '',
        role: 'USER',
      });
      
      // Notificar componente pai
      onSuccess();
    } catch (error: any) {
      toast.error(`Erro ao criar usuário: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus size={16} />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Crie um novo usuário no sistema. Após a criação, o usuário poderá fazer login.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input 
                id="lastName" 
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="generatePasswordSwitch">Gerar senha aleatória</Label>
              <Switch 
                id="generatePasswordSwitch" 
                checked={generateRandomPassword} 
                onCheckedChange={setGenerateRandomPassword} 
              />
            </div>
            
            {generateRandomPassword ? (
              <div className="relative mt-2">
                <Input 
                  id="generatedPassword" 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  readOnly
                  className="pr-20"
                />
                <div className="absolute right-1 top-1 flex gap-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 w-8"
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={regeneratePassword}
                    className="h-8 w-8"
                    title="Gerar nova senha"
                  >
                    <RefreshCw size={14} />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCopyPassword}
                    className="h-8 w-8"
                    title="Copiar senha"
                  >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Esta senha será enviada ao usuário. Eles poderão alterá-la após o login.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required={!generateRandomPassword}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-10 w-10"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organization">Organização</Label>
            <Select 
              value={formData.organizationId}
              onValueChange={value => setFormData({...formData, organizationId: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma organização" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Perfil</Label>
            <Select 
              value={formData.role}
              onValueChange={value => setFormData({...formData, role: value as UserRole})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MASTER">MASTER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Usuário'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
