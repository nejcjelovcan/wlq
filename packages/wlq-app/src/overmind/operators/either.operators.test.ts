import { Overmind, pipe, run } from "overmind";
import { fold } from "./either.operators";

describe("either.operators", () => {
  describe("fold", () => {
    it("calls error if either is Left", async () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: fold({
            error: run((_, value) => {
              expect(value).toEqual("error");
            }),
            success: run(() => {
              throw new Error("Should not happen");
            })
          })
        }
      });

      await overmind.actions.action({ _tag: "Left", left: "error" });
    });

    it("calls success if either is Right", async () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: fold({
            error: run(() => {
              throw new Error("Should not happen");
            }),
            success: run((_, value) => {
              expect(value).toEqual("value");
            })
          })
        }
      });

      await overmind.actions.action({ _tag: "Right", right: "value" });
    });

    it("calls neither if error happens earlier in pipeline", async () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: pipe(
            // @ts-ignore
            run(() => {
              throw new Error("Expected error");
            }),
            fold({
              error: run(() => {
                throw new Error("Should not happen");
              }),
              success: run(() => {
                throw new Error("Should not happen");
              })
            })
          )
        }
      });

      await expect(
        // @ts-ignore
        overmind.actions.action({ _tag: "Right", right: "value" })
      ).rejects.toThrowError("Expected error");
    });

    // TODO test either return value (left/right value)
  });
});
