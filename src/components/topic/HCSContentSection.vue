<!--
  -
  - Hedera Mirror Node Explorer
  -
  - Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -
  -->

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCard v-if="props.topicMemo" collapsible-key="hcs1Content">

    <template v-slot:title>
      <span class="h-is-secondary-title">HCS-1 Content</span>
    </template>

    <template #content>
      <Property id="hash" :full-width="true">
        <template v-slot:name>Hash</template>
        <template v-slot:value>
          {{ props.topicMemo?.hash }}
          <div v-if="hashMatch" class="icon is-small ml-1" id="check-mark">
            <i class="fas fa-check has-text-success"/>
          </div>
          <InfoTooltip
              v-else
              class="ml-1"
              :label="isAssetIncomplete ? INCOMPLETE_ASSET_TOOLTIP : HASH_MISMATCH_TOOLTIP"
          />
        </template>
      </Property>
      <Property id="compression" :full-width="true">
        <template v-slot:name>Compression</template>
        <template v-slot:value>
          {{ props.topicMemo?.algo }}
        </template>
      </Property>
      <Property id="encoding" :full-width="true">
        <template v-slot:name>Encoding</template>
        <template v-slot:value>
          {{ props.topicMemo?.encoding }}
        </template>
      </Property>
      <Property v-if="hcs1DataType" id="mime-type" :full-width="true">
        <template v-slot:name>MIME Type</template>
        <template v-slot:value>
          {{ hcs1DataType }}
        </template>
      </Property>
      <Property v-if="hashMatch && (hcs1DataURL || jsonContent)" id="preview" :full-width="true">
        <template v-slot:name>Preview</template>
        <template v-slot:value>
          <MediaContent
              v-if="hcs1DataURL"
              :url="hcs1DataURL"
              :type="hcs1DataType"
              :size="200"
              :auto="false"
          />
          <BlobValue
              v-else-if="jsonContent"
              :blob-value="jsonContent"
              :show-none="true"
              :base64="true"
              :pretty="true"
          />
        </template>
      </Property>
    </template>
  </DashboardCard>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import DashboardCard from "@/components/DashboardCard.vue";
import Property from "@/components/Property.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {HCSTopicMemo} from "@/utils/HCSTopicMemo.ts";
import MediaContent from "@/components/MediaContent.vue";
import {HCSAsset} from "@/utils/cache/HCSAsset.ts";
import InfoTooltip from "@/components/InfoTooltip.vue";

const props = defineProps({
  topicMemo: {
    type: Object as PropType<HCSTopicMemo | null>,
    default: null
  },
  hcs1Asset: {
    type: Object as PropType<HCSAsset | null>,
    default: null
  }
})

const INCOMPLETE_ASSET_TOOLTIP =
    'This topic contains too many messages for the HCS-1 content to be fully retrieved. ' +
    'The hash cannot be checked and the preview of the content is not available.'

const HASH_MISMATCH_TOOLTIP =
    'The HCS-1 content was fully retrieved but its hash does not match the hash from the topic memo. ' +
    'The preview of the content is hence not available.'

const isAssetIncomplete = computed(() =>
    props.hcs1Asset === null
    || props.hcs1Asset.content === null
)

const hashMatch = computed(() =>
    props.topicMemo !== null
    && props.hcs1Asset !== null
    && props.topicMemo.hash === props.hcs1Asset.hash
)

const hcs1DataType = computed(() =>
    props.hcs1Asset ? props.hcs1Asset.type : null
)

const jsonContent = computed(() => {
  let result: string | null
  if (
      props.hcs1Asset?.content
      && hcs1DataType.value !== null
      && (hcs1DataType.value.startsWith('application/json'))
  ) {
    result = Buffer.from(props.hcs1Asset.content).toString()
  } else {
    result = null
  }
  return result
})

const hcs1DataURL = computed(() => {
  let result: string | null
  if (
      props.hcs1Asset
      && hcs1DataType.value !== null
      && (
          hcs1DataType.value.startsWith('image')
          || hcs1DataType.value.startsWith('video')
          || hcs1DataType.value.startsWith('audio')
      )
  ) {
    result = props.hcs1Asset.getDataURL()
  } else {
    result = null
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
