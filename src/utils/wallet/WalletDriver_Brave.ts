/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {WalletDriver_Ethereum} from "@/utils/wallet/WalletDriver_Ethereum";

export class WalletDriver_Brave extends WalletDriver_Ethereum {

    //
    // Public
    //

    public constructor() {
        super("Brave Wallet",
            "https://brave.com/static-assets/images/optimized/brave-branding-assets/images/brave-logo-color-RGB_reversed.png",
            "https://brave.com/static-assets/images/brave-logo-no-shadow.png",
            "com.brave.wallet")
    }
}
