import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";

export default function NewPlace() {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const placeSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("placeImage", formState.inputs.image.value);

      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        "POST",
        formData,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      // redirect to another page on success
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const inputs = {
    title: {
      id: "title",
      type: "text",
      label: "Title",
      elementType: "input",
      validators: [VALIDATOR_REQUIRE()],
      errorText: "Please enter a valid title.",
      onInput: inputHandler,
    },
    description: {
      id: "description",
      label: "Description",
      elementType: "textarea",
      validators: [VALIDATOR_MINLENGTH(5)],
      errorText: "Please enter a valid description (at least 5 characters).",
      onInput: inputHandler,
    },
    adress: {
      id: "address",
      type: "text",
      label: "Address",
      elementType: "input",
      validators: [VALIDATOR_REQUIRE()],
      errorText: "Please enter a valid address.",
      onInput: inputHandler,
    },
    image: {
      id: "image",
      errorText: "Please upload an place image",
      onInput: inputHandler,
    },
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <Input {...inputs.title}></Input>
        <Input {...inputs.description}></Input>
        <Input {...inputs.adress}></Input>
        <ImageUpload {...inputs.image}></ImageUpload>
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </>
  );
}
