import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import FormSubmitBtn from "./FormSubmitBtn";

const logInFormSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password required."),
});

type logInFormType = z.infer<typeof logInFormSchema>;

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<logInFormType>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { logIn, isLoading } = useAuthStore();

  const onSubmit = async (data: logInFormType) => {
    try {
      await logIn(data.email, data.password);
      navigate("/verify-email");
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email Address */}
      <fieldset>
        <label htmlFor="email">Email</label>
        <div className="relative">
          <Mail className="form-icon" />
          <input
            id="email"
            type="text"
            className="form-input"
            inputMode="email"
            disabled={isLoading}
            aria-disabled={isLoading}
            {...register("email")}
          />
        </div>

        {errors.email && <p className="input-error">{errors.email.message}</p>}
      </fieldset>

      {/* Password */}
      <fieldset>
        <label htmlFor="password">Password</label>
        <div className="relative">
          <Lock className="form-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input"
            disabled={isLoading}
            aria-disabled={isLoading}
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
          <p className="input-error">{errors.password.message}</p>
        )}

        <Link to={"/forgot-password"} className="text-sm link-blue mt-1">
          Forgot Password
        </Link>
      </fieldset>

      <FormSubmitBtn loadingText="Logging In" notLoadingText="Log In" />
    </form>
  );
};

export default LogInForm;
