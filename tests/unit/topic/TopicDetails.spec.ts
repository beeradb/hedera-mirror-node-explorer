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

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "../../../src/router";
import axios from "axios";
import TopicDetails from "../../../src/pages/TopicDetails.vue";
import TopicMessageTable from "../../../src/components/topic/TopicMessageTable.vue";
import DashboardCard from "../../../src/components/DashboardCard.vue"
import NotificationBanner from "../../../src/components/NotificationBanner.vue"
import {SAMPLE_DELETED_TOPIC, SAMPLE_TOPIC, SAMPLE_TOPIC_DUDE_MESSAGES, SAMPLE_TOPIC_MESSAGES} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "../../../src/utils/HMSF";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TopicDetails.vue", () => {

    it("Should display topic details and messages", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios);

        const testTopic = SAMPLE_TOPIC.topic_id
        const matcher1 = "/api/v1/topics/" + testTopic
        mock.onGet(matcher1).reply(200, SAMPLE_TOPIC)
        const matcher2 = "/api/v1/topics/" + testTopic + "/messages"
        mock.onGet(matcher2).reply(200, SAMPLE_TOPIC_MESSAGES)

        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                topicId: testTopic
            },
        });
        await flushPromises()
        // console.log(wrapper.html())

        expect(wrapper.findComponent(NotificationBanner).exists()).toBe(false)

        const cards = wrapper.findAllComponents(DashboardCard)
        expect(cards.length).toBe(2)

        const card1 = cards[0]
        expect(card1.text()).toMatch(RegExp("^Topic " + testTopic))
        expect(card1.get('#memoValue').text()).toMatch('Mirror Node acceptance test: 2024-06-04T13:31:14.587755893Z Create Topic')
        expect(card1.get('#valid-fromValue').text()).toMatch('1:32:45.8418 PMJun 4, 2024, UTC')
        expect(card1.get('#valid-untilValue').text()).toMatch('None')
        expect(card1.get('#creation-dateValue').text()).toMatch('1:31:15.0767 PMJun 4, 2024, UTC')
        expect(card1.get('#auto-renew-periodValue').text()).toMatch('92d 14h 13min 20s')
        expect(card1.get('#auto-renew-accountValue').text()).toMatch('0.0.31393')
        expect(card1.get('#admin-keyValue').text()).toMatch('c249 a323 c878 f5b5 e2da ccda 6d73 1e6f dc32 f870 228d 1cd4 fae5 59d9 47db c36cCopyED25519')
        expect(card1.get('#submit-keyValue').text()).toMatch('8ebc 7a7f a141 bae1 4ce7 6669 f6f9 1d53 3f33 65d6 a9a4 6574 1f7e 6e4a bbf7 aaf3CopyED25519')

        const card2 = cards[1]
        const table = card2.findComponent(TopicMessageTable)
        expect(table.exists()).toBe(true)
        expect(table.findAll('tr').length).toBe(3)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/topics/" + testTopic,
            "api/v1/topics/" + testTopic + "/messages",
            "api/v1/topics/" + testTopic + "/messages?limit=100&order=asc",
            "api/v1/network/nodes",
            "api/v1/contracts/" + SAMPLE_TOPIC.auto_renew_account,
        ])

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should update when topic id changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios);

        const testTopic1 = SAMPLE_TOPIC_MESSAGES.messages[0].topic_id
        let matcher = "/api/v1/topics/" + testTopic1 + "/messages"
        mock.onGet(matcher).reply(200, SAMPLE_TOPIC_MESSAGES)

        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                topicId: testTopic1
            },
        });
        await flushPromises()

        expect(wrapper.text()).toMatch(RegExp("^Topic " + testTopic1))
        expect(wrapper.findComponent(TopicMessageTable).find('tbody').findAll('tr')[0].text())
            .toBe("66:06:30.0653 PMJan 13, 2022, UTCbackgroundMessage")

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/topics/" + testTopic1,
            "api/v1/topics/" + testTopic1 + "/messages",
            "api/v1/topics/" + testTopic1 + "/messages?limit=100&order=asc",
        ])

        const testTopic2 = SAMPLE_TOPIC_DUDE_MESSAGES.messages[0].topic_id
        matcher = "/api/v1/topics/" + testTopic2 + "/messages"
        mock.onGet(matcher).reply(200, SAMPLE_TOPIC_DUDE_MESSAGES)

        await wrapper.setProps({
            topicId: testTopic2
        })
        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch(RegExp("^Topic " + testTopic2))
        expect(wrapper.findComponent(TopicMessageTable).find('tbody').findAll('tr')[0].text())
            .toBe("16:05:45.8654 PMJan 13, 2022, UTC  ~T��_New message_1")

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/topics/" + testTopic1,
            "api/v1/topics/" + testTopic1 + "/messages",
            "api/v1/topics/" + testTopic1 + "/messages?limit=100&order=asc",
            "api/v1/topics/" + testTopic2,
            "api/v1/topics/" + testTopic2 + "/messages?limit=100&order=asc",
            "api/v1/topics/" + testTopic2 + "/messages",
        ])

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should detect invalid topic ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios);

        const invalidTopicId = "0.0.0.1000"
        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                topicId: invalidTopicId
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.get("#notificationBanner").text()).toBe("Invalid topic ID: " + invalidTopicId)

        expect(fetchGetURLs(mock)).toStrictEqual([])

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should flag deleted topic", async () => {

        const mock = new MockAdapter(axios);

        const testTopic = SAMPLE_DELETED_TOPIC.topic_id
        const matcher1 = "/api/v1/topics/" + testTopic
        mock.onGet(matcher1).reply(200, SAMPLE_DELETED_TOPIC)
        const matcher2 = "/api/v1/topics/" + testTopic + "/messages"
        mock.onGet(matcher2).reply(200, SAMPLE_TOPIC_MESSAGES)
        const wrapper = mount(TopicDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                topicId: testTopic
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        const cards = wrapper.findAllComponents(DashboardCard)
        expect(cards.length).toBe(2)

        const card1 = cards[0]
        expect(card1.text()).toMatch(RegExp("^Topic " + testTopic))
        const banner = card1.get("#notificationBanner")
        // expect(banner.exists()).toBe(true)
        expect(banner.text()).toMatch("Topic is deleted")

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/topics/" + testTopic,
            "api/v1/topics/" + testTopic + "/messages",
            "api/v1/network/nodes",
            "api/v1/contracts/" + SAMPLE_TOPIC.auto_renew_account,
        ])

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });
});
