import React, { useEffect, useReducer } from "react";

import { validate } from "../../util/validators";
import "./Input.css";

const ACTION_TYPES = {
  CHANGE: "CHANGE",
  TOUCH: "TOUCH",
};

function inputReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.CHANGE:
      return {
        ...state,
        value: action.payload.value,
        isValid: validate(action.payload.value, action.payload.validators),
      };
    case ACTION_TYPES.TOUCH:
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
}

export default function Input(props) {
  const {
    id,
    elementType,
    type,
    placeholder,
    label,
    rows,
    validators,
    errorText,
    onInput,
    initialValue,
    initialValid,
  } = props;

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue || "",
    isValid: initialValid || false,
    isTouched: false,
  });

  useEffect(() => {
    onInput(id, inputState.value, inputState.isValid);
  }, [id, inputState.value, inputState.isValid, onInput]);

  function onChangeHandler(event) {
    dispatch({
      type: ACTION_TYPES.CHANGE,
      payload: {
        value: event.target.value,
        validators: validators,
      },
    });
  }

  function onTouchHandler() {
    dispatch({
      type: ACTION_TYPES.TOUCH,
    });
  }

  const element =
    elementType === "input" ? (
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={onChangeHandler}
        value={inputState.value}
        onBlur={onTouchHandler}
      />
    ) : (
      <textarea
        id={id}
        rows={rows || 3}
        placeholder={placeholder}
        onChange={onChangeHandler}
        value={inputState.value}
        onBlur={onTouchHandler}
      ></textarea>
    );

  return (
    <section
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
    </section>
  );
}
