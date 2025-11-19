import React, { useContext, useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { API_URL, ASSET_URL } from "../../shared/util/env";
import "./PlaceItem.css";

export default function PlaceItem(props) {
  const auth = useContext(AuthContext);
  const { id, image, title, description, address, creator, location } =
    props.place;
  const imageUrl =
    image && image.startsWith("http") ? image : `${ASSET_URL}/${image}`;

  const [showMap, setShowMap] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  function openMapHandler() {
    setShowMap(true);
  }

  function closeMapHandler() {
    setShowMap(false);
  }

  function openConfirmHandler() {
    setShowConfirmDelete(true);
  }

  function closeConfirmHandler() {
    setShowConfirmDelete(false);
  }

  async function confirmDelete() {
    setShowConfirmDelete(false);
    try {
      await sendRequest(
        `${API_URL}/places/${id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      props.onDelete(id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClassName="place-item__modal-content"
        footerClassName="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close Map</Button>}
      >
        <section className="map-container">
          <Map center={location} zoom={16}></Map>
        </section>
      </Modal>
      <Modal
        show={showConfirmDelete}
        onCancel={closeConfirmHandler}
        header="Are you sure?"
        footerClassName="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={closeConfirmHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Do you want to delete this place? Please note that this action cannot
          be undone!
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <section className="place-item__image">
            <img src={imageUrl} alt={title} />
          </section>
          <section className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </section>
          <section className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>

            {auth.userId === creator && (
              <Button to={`/places/${id}`}>EDIT</Button>
            )}
            {auth.userId === creator && (
              <Button danger onClick={openConfirmHandler}>
                DELETE
              </Button>
            )}
          </section>
        </Card>
      </li>
    </>
  );
}
