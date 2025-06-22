import { PlayerState } from "../App";
import { getUid } from "./getUid";

export const isCurrentPlayerHost = (playerSetup: PlayerState[]) => {
    const uid = getUid();
    const hostPlayer = playerSetup.find(p => p.host);
    return uid && hostPlayer?.uid === uid;
}