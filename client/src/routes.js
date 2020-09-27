import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { FriendsPage } from "./pages/FriendsPage";
import { DialogPage } from "./pages/DialogPage";
import { DialogListPage } from "./pages/DialogListPage";
import { AuthPage } from "./pages/AuthPage";
import { RegPage } from "./pages/RegPage";

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    
    return (
      <Switch>
        <Route path="/search-friend" exact>
          <SearchPage />
        </Route>
        <Route path="/friends" exact>
          <FriendsPage />
        </Route>
        <Route path="/dialogs-list">
          <DialogListPage />
        </Route>
        <Route path="/dialog/:id">
          <DialogPage />
        </Route>
        <Redirect to="/dialogs-list" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/login">
        <AuthPage />
      </Route>
      <Route path="/register">
        <RegPage />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};
