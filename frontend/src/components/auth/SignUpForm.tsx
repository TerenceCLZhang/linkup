import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpFormSchema = z.object({
  name: z.string().trim().min(1, "Full name is required."),
  email: z.email("Invalid email address."),
  password: z.string().min(6, "Password must be at least six characters."),
});

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: z.infer<typeof signUpFormSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Full Name */}
      <fieldset className="fieldset">
        <label htmlFor="name">Full Name</label>
        <div className="relative">
          <User className="form-icon" />

          <input
            id="name"
            type="text"
            className="form-input"
            {...register("name")}
          />
        </div>

        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </fieldset>

      {/* Email Address */}
      <fieldset className="fieldset">
        <label htmlFor="email">Email</label>
        <div className="relative">
          <Mail className="form-icon" />
          <input
            id="email"
            type="text"
            className="form-input"
            {...register("email")}
          />
        </div>

        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </fieldset>

      {/* Password */}
      <fieldset className="fieldset">
        <label htmlFor="password">Password</label>
        <div className="relative">
          <Lock className="form-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input"
            {...register("password")}
          />
          <button
            type="button"
            className="bg-transparent p-0 absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            <button
              type="button"
              className="bg-transparent p-0 absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </button>
        </div>

        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </fieldset>

      <button type="submit" className="button-primary w-full mt-2">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
