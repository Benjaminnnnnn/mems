import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";

export default function UserPlaces() {
  const { userId } = useParams();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState();
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setPlaces(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {!isLoading && places && (
        <PlaceList items={places} onDelete={placeDeleteHandler}></PlaceList>
      )}
    </>
  );
}
