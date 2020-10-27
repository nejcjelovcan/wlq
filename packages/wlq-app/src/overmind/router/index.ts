import * as actions from "./router.actions";
import { state } from "./router.state";

import onInitialize from "./router.initialize";
import { router as effects } from "./router.effects";

export { onInitialize, state, actions, effects };
