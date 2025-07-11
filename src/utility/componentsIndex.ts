import { FireballComponent } from "../powerComponents/attackPowerComponents/FireballComponent";
import { LiquidateAssets } from "../powerComponents/attackPowerComponents/LiquidateAssetsComponent";
import { MindBlastComponent } from "../powerComponents/attackPowerComponents/MindBlastComponent";
import { PraiseMeComponent } from "../powerComponents/attackPowerComponents/PraiseMeComponent";
import { ToTheFaceComponent } from "../powerComponents/attackPowerComponents/ToTheFaceComponent";
import { WhirlingAxesComponent } from "../powerComponents/attackPowerComponents/WhirlingAxesComponent";
import { DiscardTargetComponent } from "../powerComponents/DiscardTargetComponent";
import { MultipleTargetComponent } from "../powerComponents/MultipleTargetComponent";
import { SinglePlayerTargetComponent } from "../powerComponents/SinglePlayerTargetComponent";
import { SingleShieldTargetComponent } from "../powerComponents/SingleShieldTargetComponent";

export const componentIndex: Record<string, any> = {
    "Sneak Attack": SingleShieldTargetComponent,
    "Charm": SingleShieldTargetComponent,
    "Mighty Toss": SingleShieldTargetComponent,
    "Definitely Just a Mirror": SingleShieldTargetComponent,
    "Hugs": SingleShieldTargetComponent,
    "Vamperic Touch": SinglePlayerTargetComponent,
    "Mind Games": SinglePlayerTargetComponent,
    "Divine Inspiration": DiscardTargetComponent,
    "Banishing Smite": null,
    "Battle Roar": null,
    "Tell me about your Mother": null,
    "Owl Bear Boogie": null,
    "Death Ray": null,
    "It's Not a Trap": MultipleTargetComponent,
    "Mind Blast": MindBlastComponent,
    "Liquidate Assets": LiquidateAssets,
    "To the Face!": ToTheFaceComponent,
    "Fireball": FireballComponent,
    "Whirling Axes": WhirlingAxesComponent,
    "Praise Me": PraiseMeComponent,
    "Clever Disguise": null,
}