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

import {EntityCache} from "@/utils/cache/EntityCache"

export abstract class SerialCache<K, E> extends EntityCache<K, E> {

    private currentKey: K|null = null

    //
    // Cache
    //

    public async lookup(key: K): Promise<E> {

        let result = this.promises.get(key)
        if (result == undefined) {
            while (this.currentKey !== null) {
                await this.promises.get(this.currentKey)
            }
            this.currentKey = key
            const p = super.lookup(key)
            try {
                result = Promise.resolve(await p)
            } finally {
                this.currentKey = null
            }
        }

        return result
    }

}
