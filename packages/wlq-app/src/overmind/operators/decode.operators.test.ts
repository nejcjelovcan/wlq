import * as t from "io-ts";
import { Overmind, pipe, run } from "overmind";
import { decode } from "./decode.operators";

describe("decode.operators", () => {
  describe("decode", () => {
    const Codec = t.type({ strProp: t.string });

    it("returns Left IoErrors if decoding fails", () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: pipe(
            decode(Codec),
            run((_, value) => {
              expect(value).toEqual({
                _tag: "Left",
                left: {
                  strProp: ["Invalid value", "undefined"]
                }
              });
            })
          )
        }
      });

      // @ts-ignore
      overmind.actions.action({});
    });

    it("returns Right value if decoding succeeds", () => {
      expect.assertions(1);
      const overmind = new Overmind({
        actions: {
          action: pipe(
            decode(Codec),
            run((_, value) => {
              expect(value).toEqual({
                _tag: "Right",
                right: { strProp: "stringValue" }
              });
            })
          )
        }
      });

      // @ts-ignore
      overmind.actions.action({ strProp: "stringValue" });
    });
  });
});
