import { Operator, mutate, filter } from "overmind";
import { RouterPage } from "./router.state";

// export const closeUserModal: <T>() => Operator<T> = () =>
//   mutate(function closeUserModal({ state }) {
//     state.modalUser = null;
//   });

export const setPage: <T>(page: RouterPage) => Operator<T> = page =>
  mutate(function setPage({ state }) {
    state.router.currentPage = page;
  });

// export const shouldLoadUsers: <T>() => Operator<T> = () =>
//   filter(function shouldLoadUsers({ state }) {
//     return !Boolean(state.users.length);
//   });

// export const loadUsers: <T>() => Operator<T> = () =>
//   mutate(async function loadUsers({ state, effects }) {
//     state.isLoadingUsers = true;
//     state.users = await effects.api.getUsers();
//     state.isLoadingUsers = false;
//   });

// export const loadUserWithDetails: () => Operator<{ id: string }> = () =>
//   mutate(async function loadUserWithDetails({ state, effects }, params) {
//     state.isLoadingUserDetails = true;
//     state.modalUser = await effects.api.getUserWithDetails(params.id);
//     state.isLoadingUserDetails = false;
//   });
