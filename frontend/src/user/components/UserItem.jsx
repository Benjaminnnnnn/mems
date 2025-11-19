import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import { ASSET_URL } from "../../shared/util/env";
import "./UserItem.css";

export default function UserItem(props) {
  const imageUrl =
    props.user.image && props.user.image.startsWith("http")
      ? props.user.image
      : `${ASSET_URL}/${props.user.image}`;

  return (
    <li className="user-item">
      <section className="user-item__content">
        <Link to={`/${props.user.id}/places`}>
          <section className="user-item__image">
            <Avatar
              image={imageUrl}
              alt={props.user.name}
            ></Avatar>
          </section>
          <section className="user-item__info">
            <h2>{props.user.name}</h2>
            <h3>
              {props.user.places.length}{" "}
              {props.user.places.length === 1 ? "Place" : "Places"}
            </h3>
          </section>
        </Link>
      </section>
    </li>
  );
}
