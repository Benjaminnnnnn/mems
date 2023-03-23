import React from "react";

import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

export default function PlaceList(props) {
  if (props.items.length === 0) {
    return (
      <section className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </section>
    );
  } else {
    return (
      <ul className="place-list">
        {props.items.map((place) => {
          return (
            <PlaceItem
              key={place.id}
              place={place}
              onDelete={props.onDelete}
            ></PlaceItem>
          );
        })}
      </ul>
    );
  }
}
