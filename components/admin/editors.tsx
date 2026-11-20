"use client";

import { toast } from "sonner";
import { addAdmin, changePassword, saveSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function run(action: (data: FormData) => Promise<{ ok: boolean } | void>, data: FormData) {
  const result = await action(data);
  if (result && "ok" in result && !result.ok) {
    toast.error("Vérifiez les champs");
    return;
  }
  toast.success("Enregistré");
}

export function SettingsForm({
  fields,
  liveDot = false,
}: {
  fields: { name: string; label: string; value: string | number; area?: boolean }[];
  liveDot?: boolean;
}) {
  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        void run(saveSettings, new FormData(event.currentTarget));
      }}
    >
      {fields.map((field) => (
        <label key={field.name} className="grid gap-1 text-sm">
          <span className="font-medium">{field.label}</span>
          {field.area ? (
            <Textarea name={field.name} defaultValue={String(field.value)} />
          ) : (
            <Input name={field.name} defaultValue={String(field.value)} />
          )}
        </label>
      ))}
      <label className="flex items-center gap-2 text-sm md:col-span-2">
        <input name="showLiveDot" type="checkbox" defaultChecked={liveDot} />
        Afficher le point « En service » (uniquement si le client confirme une présence 24/7)
      </label>
      <Button type="submit" className="md:col-span-2 w-fit">
        Enregistrer les paramètres
      </Button>
    </form>
  );
}

export function PasswordForms() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          void run(changePassword, new FormData(form)).then(() => form.reset());
        }}
      >
        <h3 className="font-semibold">Changer le mot de passe</h3>
        <Label>Mot de passe actuel</Label>
        <Input name="currentPassword" type="password" required minLength={8} />
        <Label>Nouveau mot de passe</Label>
        <Input name="newPassword" type="password" required minLength={10} />
        <Button type="submit">Mettre à jour</Button>
      </form>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          void run(addAdmin, new FormData(form)).then(() => form.reset());
        }}
      >
        <h3 className="font-semibold">Ajouter un administrateur</h3>
        <Input name="name" placeholder="Nom" required />
        <Input name="email" type="email" placeholder="E-mail" required />
        <Input name="password" type="password" placeholder="Mot de passe" required minLength={10} />
        <Button type="submit">Créer</Button>
      </form>
    </div>
  );
}
