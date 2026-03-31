import { useState } from "react";
import { CreateUserSchema } from "@my-project/shared";
import { createUser } from "../api/users";

export function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate on the CLIENT with the exact same schema used on the server
    const result = CreateUserSchema.safeParse({ name, email });
    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        name: formatted.name?._errors ?? [],
        email: formatted.email?._errors ?? [],
      });
      return;
    }

    setErrors({});
    try {
      await createUser(result.data);
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      {errors.name?.map((e) => <p key={e} style={{ color: "red" }}>{e}</p>)}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {errors.email?.map((e) => <p key={e} style={{ color: "red" }}>{e}</p>)}
      <button type="submit">Create User</button>
    </form>
  );
}