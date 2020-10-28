import { IoValidationError } from "@wlq/wlq-core";
import { catchError, Operator } from "overmind";

export const redirectToIndexOnValidationError: () => Operator = () =>
  catchError(
    (
      {
        actions: {
          router: { open }
        }
      },
      error
    ) => {
      if (error instanceof IoValidationError) {
        open({ path: "/" });
      } else {
        throw error;
      }
    }
  );
