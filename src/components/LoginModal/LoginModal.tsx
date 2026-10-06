import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { useAuth } from "../../context/authContext";
import Modal from "../Modal/Modal";
import "./LoginModal.css";

const MIN_PASSWORD_LENGTH = 6;

function LoginModal() {
  const { closeLogin, login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email")).trim();
    const password = String(data.get("password"));

    setError("");
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register({
          name: String(data.get("name")).trim(),
          surname: String(data.get("surname")).trim(),
          email,
          password,
        });
        toast.success("Account created");
      } else {
        await login(email, password);
        toast.success("Welcome back");
      }

      closeLogin();
    } catch (requestError) {
      const isClientError =
        isAxiosError(requestError) && requestError.response && requestError.response.status < 500;

      if (!isClientError) {
        setError("Something went wrong. Please try again later");
      } else if (isRegister) {
        setError("Could not create the account. This email may already be registered");
      } else {
        setError("Wrong email or password");
      }

      setIsSubmitting(false);
    }
  };

  const title = isRegister ? "Create account" : "Sign in";

  return (
    <Modal label={title} onClose={closeLogin}>
      <form className="login" onSubmit={handleSubmit}>
        <h2 className="login__title">{title}</h2>

        {isRegister && (
          <div className="login__row">
            <label className="login__field">
              <span className="login__label">First name</span>
              <input className="login__input" name="name" autoComplete="given-name" required autoFocus />
            </label>
            <label className="login__field">
              <span className="login__label">Last name</span>
              <input className="login__input" name="surname" autoComplete="family-name" required />
            </label>
          </div>
        )}

        <label className="login__field">
          <span className="login__label">Email</span>
          <input
            className="login__input"
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus={!isRegister}
          />
        </label>

        <label className="login__field">
          <span className="login__label">Password</span>
          <input
            className="login__input"
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? MIN_PASSWORD_LENGTH : undefined}
            required
          />
        </label>

        {error && (
          <p className="login__error" role="alert">
            {error}
          </p>
        )}

        <button className="button button--primary login__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait…" : title}
        </button>

        <p className="login__switch">
          {isRegister ? "Already have an account?" : "New to CinemaGuide?"}{" "}
          <button
            className="login__switch-button"
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </p>
      </form>
    </Modal>
  );
}

export default LoginModal;
