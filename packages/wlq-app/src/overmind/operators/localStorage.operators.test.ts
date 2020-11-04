import * as e from "fp-ts/Either";
import { Overmind, pipe, run } from "overmind";
import { LocalStorageError } from "../effects/localStorage";
import { getJsonFromLocalStorage } from "./localStorage.operators";

describe("localStorage.operators", () => {
  describe("getJsonFromLocalStorage", () => {
    it("retrieves and parses json from localStorage", async () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: pipe(
            getJsonFromLocalStorage("key"),
            run((_, value) => {
              expect(value).toEqual({ _tag: "Right", right: { test: 123 } });
            })
          )
        },
        effects: {
          localStorage: {
            getItem: () => '{"test":123}'
          }
        }
      });

      await overmind.actions.action();
    });
    it("returns Left if JSON parsing failed", async () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: pipe(
            getJsonFromLocalStorage("key"),
            run((_, value) => {
              if (e.isRight(value)) throw new Error("Unexpected right");
              expect(value.left).toBeInstanceOf(SyntaxError);
            })
          )
        },
        effects: {
          localStorage: {
            getItem: () => '{"test":123 invalidjson}'
          }
        }
      });

      await overmind.actions.action();
    });
    it("returns Left if no token in storage", async () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: pipe(
            getJsonFromLocalStorage("key"),
            run((_, value) => {
              if (e.isRight(value)) throw new Error("Unexpected right");
              expect(value.left).toBeInstanceOf(LocalStorageError);
            })
          )
        },
        effects: {
          localStorage: {
            getItem: () => {
              throw new LocalStorageError("Does not exist");
            }
          }
        }
      });

      await overmind.actions.action();
    });
  });
});
