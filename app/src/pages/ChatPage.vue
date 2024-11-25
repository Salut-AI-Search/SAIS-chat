<template>
  <q-layout class="body">
    <q-drawer
      v-model="showChats"
      side="left"
      show-if-above
      :breakpoint="700"
      width="400"
      class="drawer text-white"
    >
      <div
        class="popup"
        ref="popup"
        :style="{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y}px`,
          display: isPopupVisible ? 'block' : 'none',
        }"
      >
        <q-virtual-scroll
          :items="chatStore.vectorStores"
          style="height: 300px; width: 200px"
        >
          <template v-slot="{ item }">
            <div class="item" @click="handlerCreateChat(item)">{{ item }}</div>
          </template>
        </q-virtual-scroll>
      </div>
      <q-virtual-scroll
        v-if="!loadingChats"
        :items="chats"
        class="chats-container"
      >
        <template v-slot:before
          ><div class="create-chat" @click="togglePopup">
            <p class="create-text">Новый чат</p>
          </div>
        </template>
        <template v-slot="{ item: chat }">
          <div class="chat ellipsis-1-line" @click="handlerSelectChat(chat)">
            <p>{{ chat.name }}</p>
          </div>
        </template>
      </q-virtual-scroll>
      <q-inner-loading :showing="loadingChats">
        <q-spinner-gears size="50px" style="color: #706dd1" />
      </q-inner-loading>
    </q-drawer>
    <q-page-container>
      <q-page class="row items-center justify-evenly">
        <div class="drawer-btn-container column justify-center q-mr-lg">
          <q-btn
            class="drawer-btn"
            flat
            round
            dense
            color="white"
            :icon="showChats ? 'chevron_left' : 'chevron_right'"
            size="20px"
            @click="showChats = !showChats"
          />
        </div>
        <div>
          <q-virtual-scroll
            v-if="messages.length != 0"
            v-slot="{ item: message }"
            :items="messages"
            class="message-container"
          >
            <div
              :class="message.from == 'user' ? 'message-user' : 'message-bot'"
            >
              {{ message.text }}
            </div>
          </q-virtual-scroll>
          <div v-else>
            <p class="no-chat-title">Салют!</p>
            <p class="no-chat-description">Задайте интересующий Вас вопрос</p>
          </div>
        </div>
        <q-inner-loading :showing="loadingResponse">
          <q-spinner-gears size="50px" style="color: #706dd1" />
        </q-inner-loading>

        <q-input
          v-model="userInput"
          class="user-input absolute-bottom q-mb-lg"
          input-class="text-area"
          borderless
          rounded
          autogrow
          ref="inputRef"
          color="white"
          label-color="white"
          @keydown.tab.prevent="acceptSuggestion"
          @keydown.enter.prevent="sendMessage"
          @update:model-value="onInput"
        >
          <template v-slot:append>
            <span v-if="suggestedText" class="suggestion-text">
              {{ suggestedText }}
            </span>
            <!-- <q-btn round flat class="btn" icon="attach_file" /> -->
            <q-btn round flat class="btn" icon="send" @click="sendMessage" />
          </template>
        </q-input>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  ref,
  computed,
  onMounted,
  watch,
  onUnmounted,
  useTemplateRef,
} from 'vue';

import { api } from 'src/boot/axios';
import { useChatStore } from 'src/stores/chatStore';
import useChats from 'src/api/composables/useChats';
import moment from 'moment';
import { useHint } from 'src/composables/useHint';
import { usePopup } from 'src/composables/usePopup';

const { apiGetChats, apiCreateChat, apiGetMessages, apiSendMessage } =
  useChats();

const inputRef = useTemplateRef('inputRef');
const userInput = ref('');

const { onInput, acceptSuggestion } = useHint(userInput);

const popup = useTemplateRef('popup');

const { isPopupVisible, popupPosition, togglePopup } = usePopup(popup);

const chatStore = useChatStore();
const selectedVecName = ref();
const selectedChat = ref({});

const showChats = ref(true);

const messages = ref([]);
const chats = ref([]);

const loadingResponse = ref(false);
const loadingChats = ref(false);

const handlerSelectChat = (chat) => {
  selectedChat.value = chat;
  messages.value = [];
  userInput.value = '';
  getChatHistory();
};

const handlerCreateChat = (vecName) => {
  chats.value.unshift({ id: -1, name: 'Новый чат' });
  selectedVecName.value = vecName;
  handlerSelectChat({ id: -1, name: 'Новый чат' });
  isPopupVisible.value = false;
};

const sendMessage = async () => {
  messages.value.push({ text: userInput.value, from: 'user' });
  loadingResponse.value = true;
  let chat_id;
  if (selectedChat.value.id == -1) {
    await apiCreateChat(selectedVecName.value).then((res) => {
      chat_id = res.data.chat_id;
      chats.value[0].id = chat_id;
    });
  } else {
    chat_id = selectedChat.value.id;
  }

  await apiSendMessage({ user_input: userInput.value, chat_id }).then((res) => {
    loadingResponse.value = false;
    messages.value.push({
      text: res.data,
      created_at: moment(),
      from: 'bot',
    });
    chats.value[0].name = userInput.value;
    userInput.value = '';
  });
};

const getChatHistory = async () => {
  console.log('selected a chat', selectedChat.value);
  await apiGetMessages(selectedChat.value.id)
    .then((res) => {
      console.log(res.data);
      messages.value = res.data.map(({ to_user_id, text, created_at }) => {
        return {
          from: to_user_id ? 'bot' : 'user',
          text,
          created_at: moment(created_at),
        };
      });
    })
    .catch((e) => {
      console.error(e);
    });
};

const getChats = async () => {
  await apiGetChats().then((res) => {
    chats.value = res.reverse();
  });
};

onMounted(() => {
  getChats();
});
</script>

<style lang="scss" scoped>
.body {
  background-color: #0d0312;
}
.popup {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  padding: 16px;

  .item {
    color: black;
  }
}
:global(.q-drawer) {
  background-color: #15021e;
  border-top-right-radius: 35px;
  border-bottom-right-radius: 35px;
  border-top: 3px solid transparent;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  background: linear-gradient(#15021e, #15021e) padding-box,
    linear-gradient(to bottom, #4000ff, #ff8800) border-box;
  direction: rtl;
}

.chats-container {
  padding-top: 20px;
  max-height: 100vh;
  direction: ltr;

  // background-color: #28282b;
  height: calc(100vh - 6px);

  .create-chat {
    background-color: #20103a;
    cursor: pointer;
    user-select: none;
    border-radius: 24px;
    margin-top: 40px;
    margin-bottom: 40px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;

    .create-text {
      margin: 0;
      padding-top: 18px;
      padding-bottom: 18px;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
  }

  .create-chat:hover {
    background-color: #331957;
  }

  .chat {
    height: 70px;
    cursor: pointer;
    white-space: wrap;
    overflow: hidden;
    user-select: none;
    border-top: 1px solid transparent;
    background: linear-gradient(#15021e, #15021e) padding-box,
      linear-gradient(
          to right,
          transparent,
          rgba(255, 255, 255, 0.6),
          transparent
        )
        border-box;

    p {
      margin: none;
      font-size: 16px;
      line-height: 24px;
      padding-top: 23px;
      padding-bottom: 23px;
      padding-left: 10%;
    }
  }

  .chat:hover {
    background: linear-gradient(#280438, #280438) padding-box,
      linear-gradient(
          to right,
          transparent,
          rgba(255, 255, 255, 0.6),
          transparent
        )
        border-box;
  }
}

.message-container {
  position: absolute;
  top: 166px;
  left: 0;
  padding-left: 16%;
  padding-right: 16%;
  font-size: 20px;
  padding-bottom: 100px;
  height: calc(100vh - 166px);
  width: 100%;

  .message-user,
  .message-bot {
    margin-bottom: 40px;
    color: white;
  }

  .message-user {
    font-weight: 300;
    color: #c0c0c0;
    letter-spacing: -0.8px;
    font-size: 20px;
  }

  .message-bot {
    font-weight: bold;
    font-size: 24px;
  }
}

:global(.text-area) {
  padding: 0;
  margin-left: 20px;
  color: white;
}
.user-input {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid transparent;
  background: linear-gradient(#15021e, #15021e) padding-box,
    linear-gradient(0.4turn, #4000ff, #ff8800) border-box;
  border-radius: 30px;

  .btn {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    color: #bbbbbb;
  }
}

.drawer-btn-container {
  position: absolute;
  left: 20px;
  height: 100vh;
  width: min-content;
  z-index: 2;
}

.drawer-btn {
  width: 50px;
  height: 50px;
}

.no-chat-title {
  color: white;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
}

.no-chat-description {
  color: white;
  text-align: center;
  font-size: 16px;
  font-weight: 100;
}
</style>
