/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
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

import {EntityID} from "@/utils/EntityID";
import {CID} from "multiformats";

export function blob2URL(blob: string | null, ipfsGateway: string | null): string | null {

    let result: string | null

    if (blob !== null) {
        if (isSecureURL(blob)) {
            result = blob
        } else if (ipfsGateway && blob.startsWith('ipfs://') && blob.length > 7) {
            result = `${ipfsGateway}${blob.substring(7)}`
        } else if (ipfsGateway && isIPFSHash(blob)) {
            result = `${ipfsGateway}${blob}`
        } else {
            result = null
        }
    } else {
        result = null
    }
    return result
}

export function blob2Topic(blob: string | null): string | null {
    let result: string | null
    let id: string

    if (blob !== null) {
        if (blob.startsWith('hcs://') && blob.length > 6) {
            const i = blob.lastIndexOf('/');
            id = blob.substring(i + 1);
        } else {
            id = blob
        }
        if (EntityID.parse(id) !== null) {
            result = id
        } else {
            result = null
        }
    } else {
        result = null
    }
    return result
}

export function isSecureURL(blob: string): boolean {
    let isValid: boolean
    try {
        const url = new URL(blob)
        isValid = url.protocol == "https:"
    } catch {
        isValid = false
    }
    return isValid
}

export function isIPFSHash(blob: string): boolean {
    let isValid: boolean
    try {
        CID.parse(blob)
        isValid = true
    } catch {
        isValid = false
    }
    return isValid
}
