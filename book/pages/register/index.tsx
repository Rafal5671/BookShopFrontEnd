import RegisterForm from "@/components/RegisterForm";
import Head from "next/head";

export default function Register() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Head>
        <title>Online Bookstore Registration</title>
        <meta name="description" content="Register to our online bookstore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-20 mb-20">
        <RegisterForm />
      </div>
    </div>
  );
}
