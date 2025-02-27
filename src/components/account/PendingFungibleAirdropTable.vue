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

  <o-table
      :data="props.controller.rows.value"
      :loading="props.controller.loading.value"
      :paginated="props.controller.paginated.value ?? props.fullPage"
      backend-pagination
      pagination-order="left"
      :range-before="0"
      :range-after="0"
      :total="props.controller.totalRowCount.value"
      :current-page="props.controller.currentPage.value"
      :per-page="props.controller.pageSize.value"
      @page-change="props.controller.onPageChange"
      @cellClick="handleClick"

      :hoverable="true"
      :narrowed="true"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      v-model:checked-rows="checkedRows"
      :checkable="props.checkEnabled"

      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
  >
    <o-table-column v-slot="{ row }" field="token_id" label="Token ID">
      <TokenIOL :token-id="row.token_id"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="name" label="Name">
      <TokenCell class="is-inline-block" :token-id="row.token_id" :property="TokenCellItem.tokenName"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="symbol" label="Symbol">
      <TokenCell class="is-inline-block" :token-id="row.token_id" :property="TokenCellItem.tokenSymbol"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="amount" label="Amount">
      <TokenAmount
          v-if="! row.serial_number"
          :amount="BigInt(row.amount)"
          :token-id="row.token_id"
      />
    </o-table-column>

    <o-table-column v-slot="{ row }" field="sender" label="Sender">
      <div>{{ row.sender_id }}</div>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="timestamp" label=" Airdrop Time">
      <TimestampValue v-bind:timestamp="row.timestamp.from"/>
    </o-table-column>

    <template v-slot:bottom-left>
      <TablePageSize
          v-if="props.fullPage"
          v-model:size="props.controller.pageSize.value"
          :storage-key="AppStorage.ACCOUNT_TOKENS_TABLE_PAGE_SIZE_KEY"
      />
    </template>

  </o-table>

  <TablePageSize
      v-if="!props.controller.paginated.value
      && props.controller.showPageSizeSelector.value
      && !props.checkEnabled
      && props.fullPage"
      v-model:size="props.controller.pageSize.value"
      :storage-key="AppStorage.ACCOUNT_TOKENS_TABLE_PAGE_SIZE_KEY"
      style="width: 102px; margin-left: 4px"
  />

  <EmptyTable v-if="!props.controller.totalRowCount.value"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType, watch} from 'vue';
import {TokenAirdrop} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {routeManager} from "@/router";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {AppStorage} from "@/AppStorage";
import {PendingAirdropTableController} from "@/components/account/PendingAirdropTableController";
import TokenAmount from "@/components/values/TokenAmount.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<PendingAirdropTableController>,
    required: true
  },
  checkEnabled: {
    type: Boolean,
    required: true
  },
  fullPage: {
    type: Boolean,
    default: false
  },
})

const checkedRows = defineModel("checkedAirdrops", {
  type: Object as PropType<TokenAirdrop[]>,
  default: [] as TokenAirdrop[]
})

watch([props.controller.rows, () => props.checkEnabled], () => checkedRows.value.splice(0))

onMounted(() => {
  props.controller.mount()
})
onBeforeUnmount(() => {
  props.controller.unmount()
})

const handleClick = (airdrop: TokenAirdrop, c: unknown, i: number, ci: number, event: MouseEvent) => {
  if (airdrop.token_id) {
    routeManager.routeToToken(airdrop.token_id, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
