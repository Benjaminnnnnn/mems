import React, { useContext, useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./Auth.css";

export default function Auth() {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formState, inputHandler, setFormState] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const authSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(data.userId, data.token);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.username.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );
        auth.login(data.userId, data.token);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const switchSignUpHandler = () => {
    if (!isLogin) {
      setFormState(
        {
          ...formState.inputs,
          username: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormState(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const inputs = {
    username: {
      elementType: "input",
      id: "username",
      type: "text",
      label: "Name",
      validators: [VALIDATOR_REQUIRE()],
      errorText: "Please enter a name.",
      onInput: inputHandler,
    },
    email: {
      elementType: "input",
      type: "email",
      id: "email",
      label: "Email",
      errorText: "Please enter a valid email.",
      validators: [VALIDATOR_EMAIL()],
      onInput: inputHandler,
    },
    password: {
      elementType: "input",
      type: "password",
      id: "password",
      label: "Password",
      errorText:
        "Please enter a valid password at least 8 and at most 24 characters long.",
      validators: [VALIDATOR_MINLENGTH(8), VALIDATOR_MAXLENGTH(24)],
      onInput: inputHandler,
    },
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <form>
          {!isLogin && <Input {...inputs.username}></Input>}
          {!isLogin && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please upload an user avatar image."
            ></ImageUpload>
          )}
          <Input {...inputs.email}></Input>
          <Input {...inputs.password}></Input>
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={authSubmitHandler}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button inverse onClick={switchSignUpHandler}>
          Switch to {isLogin ? "Sign up" : "Login"}
        </Button>
      </Card>
    </>
  );
}
