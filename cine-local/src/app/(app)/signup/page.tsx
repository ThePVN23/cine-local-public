import Header from "../../components/Header";
import SignupForm from "../../components/SignupForm";
import { auth } from "@/auth";

export default async function SignupPage() {
  const session = await auth()
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      
      <SignupForm />
    </div>
  );
}
