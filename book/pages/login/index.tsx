import LoginForm from "@/components/client/auth/LoginForm";
import Head from "next/head";

export default function Login() {
  return (
    <div>
      <Head>
        <title>Online Bookstore Registration</title>
        <meta name="description" content="Register to our online bookstore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mt-20 mb-20">
        <LoginForm />
      </div>
    </div>
  );
}