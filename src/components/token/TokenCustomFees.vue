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

  <DashboardCard collapsible-key="customFees">

    <template v-slot:title>
      <div class="h-is-secondary-title mb-2">Custom Fees</div>
    </template>

    <template v-slot:content>
      <Property id="customFeeCreatedAt" :full-width="true">
        <template v-slot:name>Created at</template>
        <template v-slot:value>
          <TimestampValue :nano="true" :show-none="true" :timestamp="fees?.created_timestamp?.toString()"/>
        </template>
      </Property>

      <Property id="fixedFee" :full-width="true">
        <template v-slot:name>Fixed Fees</template>
        <template v-if="hasFixedFees" v-slot:value>
          <div class="h-is-table-compact">
            <FixedFeeTable :analyzer="analyzer"/>
          </div>
        </template>
        <template v-else v-slot:value>
          <span class="has-text-grey">None</span>
        </template>
      </Property>

      <Property v-if="isFungible" id="fractionalFee" :full-width="true">
        <template v-slot:name>Fractional Fees</template>
        <template v-if="hasFractionalFees" v-slot:value>
          <div class="h-is-table-compact">
            <FractionalFeeTable :analyzer="analyzer"/>
          </div>
        </template>
        <template v-else v-slot:value>
          <span class="has-text-grey">None</span>
        </template>
      </Property>

      <Property v-else id="royalteeFee" :full-width="true">
        <template v-slot:name>Percentage & Fallback Fees</template>
        <template v-if="hasRoyaltyFees" v-slot:value>
          <div class="h-is-table-compact">
            <RoyaltyFeeTable class="h-is-table-compact" :analyzer="analyzer"/>
          </div>
        </template>
        <template v-else v-slot:value>
          <span class="has-text-grey">None</span>
        </template>
      </Property>

    </template>

  </DashboardCard>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent, inject, PropType} from 'vue';
import TimestampValue from "@/components/values/TimestampValue.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import Property from "@/components/Property.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import FixedFeeTable from "@/components/token/FixedFeeTable.vue";
import FractionalFeeTable from "@/components/token/FractionalFeeTable.vue";
import RoyaltyFeeTable from "@/components/token/RoyaltyFeeTable.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";

export default defineComponent({

  name: 'TokenCustomFees',

  components: {
    RoyaltyFeeTable,
    FractionalFeeTable,
    FixedFeeTable,
    TimestampValue,
    Property,
    DashboardCard
  },

  props: {
    analyzer: {
      type: Object as PropType<TokenInfoAnalyzer>,
      required: true
    }
  },

  setup(props) {
    const isSmallScreen = inject('isSmallScreen', true)
    const isMediumScreen = inject('isMediumScreen', true)
    const isTouchDevice = inject('isTouchDevice', false)

    return {
      fees: props.analyzer?.customFees,
      hasFixedFees: props.analyzer?.hasFixedFees,
      hasFractionalFees: props.analyzer?.hasFractionalFees,
      hasRoyaltyFees: props.analyzer?.hasRoyaltyFees,
      isFungible: props.analyzer?.isFungible,
      isSmallScreen,
      isMediumScreen,
      isTouchDevice,
      ORUGA_MOBILE_BREAKPOINT
    }
  },
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
</style>
