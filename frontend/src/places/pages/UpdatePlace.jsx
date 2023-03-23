import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

export default function UpdatePlace() {
  const placeId = useParams().placeId;
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [place, setPlace] = useState();
  const [formState, inputHandler, setFormState] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setPlace(data);
        setFormState(
          {
            title: {
              value: data.title,
              isValid: true,
            },
            description: {
              value: data.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlace();
  }, [setFormState, sendRequest, placeId]);

  let inputs;
  if (place) {
    inputs = {
      title: {
        id: "title",
        type: "text",
        label: "Title",
        elementType: "input",
        validators: [VALIDATOR_REQUIRE()],
        errorText: "Please enter a valid title.",
        onInput: inputHandler,
        initialValue: place.title,
        initialValid: true,
      },
      description: {
        id: "description",
        label: "Description",
        elementType: "textarea",
        validators: [VALIDATOR_MINLENGTH(5)],
        errorText: "Please enter a valid description (at least 5 characters).",
        onInput: inputHandler,
        initialValue: place.description,
        initialValid: true,
      },
    };
  }

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );

      // redirect back to the user places page
      history.push(`/${auth.userId}/places`);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (!place && !error) {
    return (
      <section className="center">
        <Card>Could not find place!</Card>
      </section>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {!isLoading && place && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input {...inputs.title}></Input>
          <Input {...inputs.description}></Input>
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </>
  );
}
