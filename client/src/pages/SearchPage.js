import React from "react";
import { Persons } from "../modules/Persons";

export const SearchPage = () => {
  
  return (
    <div className="row">
      <div className="col s8 offset-s3">
        <h1>Все пользователи</h1>
        <Persons />
      </div>
    </div>
  );
};
