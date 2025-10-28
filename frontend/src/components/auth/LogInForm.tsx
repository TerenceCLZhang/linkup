import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const logInFormSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(1, "Required."),
});

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: z.infer<typeof logInFormSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            aria-label={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </fieldset>

      <button type="submit" className="button-primary w-full mt-2">
        Log In
      </button>
    </form>
  );
};

export default LogInForm;
