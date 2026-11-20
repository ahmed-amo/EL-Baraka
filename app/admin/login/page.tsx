import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-card">
        <Image src="/Elbaraka-Logo.png" alt="" width={176} height={176} priority />
        <h1>Administration</h1>
        <p className="sub">EL BARAKA CONSEIL</p>
        <LoginForm />
      </div>
    </div>
  );
}
