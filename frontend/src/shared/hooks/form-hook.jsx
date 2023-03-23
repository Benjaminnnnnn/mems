import { useCallback, useReducer } from "react";

const TYPES = {
  INPUT_CHANGE: "INPUT_CHANGE",
  SET_FORM_STATE: "SET_FORM_STATE",
};

function formReducer(state, action) {
  switch (action.type) {
    case TYPES.INPUT_CHANGE:
      let formIsValid = true;

      for (const input in state.inputs) {
        if (!state.inputs[input]) {
          continue;
        }

        if (input === action.payload.input) {
          formIsValid = formIsValid && action.payload.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[input].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.payload.input]: {
            value: action.payload.value,
            isValid: action.payload.isValid,
          },
        },
        isValid: formIsValid,
      };
    case TYPES.SET_FORM_STATE:
      return {
        inputs: action.payload.inputs,
        isValid: action.payload.isValid,
      };

    default:
      return state;
  }
}

export const useForm = (initialInputs, initialValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: TYPES.INPUT_CHANGE,
      payload: {
        input: id,
        value: value,
        isValid: isValid,
      },
    });
  }, []);

  const setFormState = useCallback((inputData, formValidity) => {
    dispatch({
      type: TYPES.SET_FORM_STATE,
      payload: {
        inputs: inputData,
        isValid: formValidity,
      },
    });
  }, []);

  return [formState, inputHandler, setFormState];
};
