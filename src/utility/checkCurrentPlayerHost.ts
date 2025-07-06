import { PlayerState } from "../App";
import { Player } from "../classes/Player";
import { getUid } from "./getUid";

export const isCurrentPlayerHost = (playerSetup: PlayerState[] | Player[]) => {
    const uid = getUid();
    const hostPlayer = playerSetup.find(p => p.host);
    return uid && hostPlayer?.uid === uid;
}