import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UsersList from "../components/UsersList";

export default function Users() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    console.log(process.env.REACT_APP_BACKEND_URL);
    const loadUsers = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );
        setLoadedUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers}></UsersList>}
    </>
  );
}
