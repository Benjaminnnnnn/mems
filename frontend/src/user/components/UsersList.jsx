import React from "react";

import Card from "../../shared/components/UIElements/Card";
import UserItem from "./UserItem";
import "./UsersList.css";

export default function UsersList(props) {
  if (props.items.length === 0) {
    return (
      <section className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </section>
    );
  } else {
    return (
      <ul className="users-list">
        {props.items.map((user) => (
          <UserItem key={user.id} user={user}></UserItem>
        ))}
      </ul>
    );
  }
}
