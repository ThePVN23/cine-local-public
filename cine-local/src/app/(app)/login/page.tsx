import Header from "../../components/Header";
import LoginForm from "../../components/LoginForm";
import { auth } from "@/auth";

export default async function LoginPage() {
  const session = await auth();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      
      <LoginForm />
    </div>
  );
}
