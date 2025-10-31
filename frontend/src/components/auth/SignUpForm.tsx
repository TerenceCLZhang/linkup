import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import FormSubmitBtn from "./FormSubmitBtn";

const signUpFormSchema = z.object({
  name: z.string().trim().min(1, "Full name is required."),
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least six characters."),
});

type signUpFormType = z.infer<typeof signUpFormSchema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { signUp, isLoading } = useAuthStore();

  const onSubmit = async (data: signUpFormType) => {
    try {
      await signUp(data.name, data.email, data.password);
      navigate("/verify-email");
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Full Name */}
      <fieldset>
        <label htmlFor="name">Full Name</label>
        <div className="relative">
          <User className="form-icon" />

          <input
            id="name"
            type="text"
            className="form-input"
            disabled={isLoading}
            aria-disabled={isLoading}
            {...register("name")}
          />
        </div>

        {errors.name && <p className="input-error">{errors.name.message}</p>}
      </fieldset>

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
            disabled={isLoading}
            aria-disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
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
      </fieldset>

      <FormSubmitBtn loadingText="Signing Up" notLoadingText="Sign Up" />
    </form>
  );
};

export default SignUpForm;
