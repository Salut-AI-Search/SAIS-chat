<template>
  <q-layout style="background-color: #171719">
    <q-drawer
      v-model="showChats"
      side="left"
      show-if-above
      :width="350"
      :breakpoint="700"
      class="text-white bg-black"
    >
      <q-virtual-scroll
        v-if="!loadingChats"
        :items="chats"
        class="chats-container"
      >
        <template v-slot:before
          ><div
            class="create-chat"
            @click.stop="messages.length == 0 ? () => {} : newChat()"
          >
            <p class="create-plus">+</p>
            <p class="create-text">Новый чат</p>
          </div></template
        >
        <template v-slot="{ item: chat }">
          <div
            class="chat ellipsis-2-lines q-pa-md"
            @click="
              () => {
                selectedChat = chat.chat_id;
                messages = [];
                userInput = '';
                getChatHistory();
              }
            "
          >
            {{ chat.name }}
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
              <h1 v-if="message.from == 'bot'">Ответ SILA.Bot:</h1>
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
          outlined
          rounded
          autogrow
          ref="inputRef"
          @keydown.tab.prevent="acceptSuggestion"
          @keydown.enter.prevent="sendMessage"
          @update:model-value="onInput"
        >
          <template v-slot:append>
            <span v-if="suggestedText" class="suggestion-text">
              {{ suggestedText }}
            </span>
            <!-- <q-btn round flat class="btn" icon="attach_file" /> -->
            <q-btn
              round
              flat
              class="btn"
              icon="send"
              color="white"
              @click="sendMessage"
            />
          </template>
        </q-input>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, watch } from 'vue';

import { debounce } from 'lodash';
import { api } from 'src/boot/axios';
import getChats from 'src/api/getChats';
import { useChatStore } from 'src/stores/chatStore';

const chatStore = useChatStore();

const documentId = ref();

const showChats = ref(true);
const userInput = ref('');

const messages = ref([]);

const chats = ref([]);
const selectedChat = ref(-1);
const loadingResponse = ref(false);
const loadingChats = ref(false);

const sendMessage = async () => {
  messages.value.push({ text: userInput.value, from: 'user' });
  loadingResponse.value = true;
  if (selectedChat.value == -1) {
    await newChat();
  }
  api
    .post('/get_answer', {
      query: userInput.value,
      chat_id: selectedChat.value,
      user_id: '1',
    })
    .then((res) => {
      loadingResponse.value = false;
      messages.value.push({ text: res.data.answer, from: 'bot' });
      userInput.value = '';
    });
};

const getChatHistory = async () => {
  console.log(selectedChat.value);
  await getChats()
    .then((res) => {
      console.log(res.data);
      messages.value = res.data
        .toReversed()
        .map(({ message }) => {
          if (message.includes('Чат создан')) {
            return [{ from: 'user', text: message }];
          } else {
            const arr = message.split('\nОтвет: ');
            const que = arr[0].replace('Вопрос: ', '');
            const ans = arr[1];
            return [
              { from: 'user', text: que },
              { from: 'bot', text: ans },
            ];
          }
        })
        .flat(1);
    })
    .catch((e) => {
      console.error(e);
    });
};

const newChat = async () => {
  await api
    .post('/create_chat', {
      user_id: '1',
      document_id: documentId.value.toString(),
    })
    .then((res) => {
      console.log(res.data);
      selectedChat.value = res.data['chat_id'];
      chats.value = [
        {
          chat_id: res.data['chat_id'],
          last_message: 'Новый чат',
        },
        ...chats.value,
      ];
      getChatHistory();
      // getChats();
    })
    .catch((e) => {
      console.error(e);
    });
};

const inputRef = ref(null);

const debounceduserInput = ref('');
const suggestion = ref('');
const abortController = ref(null);

const debouncedUpdateuserInput = debounce(() => {
  debounceduserInput.value = userInput.value;
  console.log(debounceduserInput.value);
});

function onInput() {
  console.log('allo');
  debouncedUpdateuserInput();
}

watch(debounceduserInput, async (newValue) => {
  if (abortController.value) {
    abortController.value.abort();
  }

  abortController.value = new AbortController();
  const signal = abortController.value.signal;

  try {
    const result = await getSuggestion(newValue, signal);
    suggestion.value = result;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Previous request was cancelled.');
    } else {
      console.error('Error fetching suggestion:', error);
    }
    suggestion.value = '';
  }
});

async function getSuggestion(inputText, signal) {
  // to be finished
  return '';
}

const suggestedText = computed(() => {
  return suggestion.value;
});

function acceptSuggestion() {
  if (suggestedText.value) {
    userInput.value += suggestion.value;
    suggestion.value = '';
  }
}

// watch(
//   vectorStores,
//   () => {
//     console.log(vectorStores);
//   },
//   { deep: true }
// );

onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.forEach((value, key) => {
    if (key == 'documentId') {
      documentId.value = value;
    }
  });
  getChats().then((res) => {
    chats.value = res;
  });
});
</script>

<style lang="scss" scoped>
.chats-container {
  padding-top: 20px;
  padding-left: 5%;
  padding-right: 5%;
  max-height: 100vh;

  // background-color: #28282b;
  height: 100vh;

  .create-chat {
    background-color: #575757;
    cursor: pointer;
    user-select: none;
    border-radius: 14px;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    .create-plus {
      height: 47px;
      width: 28px;
      margin: 0;
      font-size: 25px;
      line-height: 47px;
      margin-left: 15px;
      font-weight: 600;
    }

    .create-text {
      margin: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      font-size: 18px;
      text-align: center;
    }
  }

  .create-chat:hover {
    background-color: #494949;
  }

  .chat {
    height: 72px;
    cursor: pointer;
    white-space: wrap;
    overflow: hidden;
    font-size: 18px;
    line-height: 24px;
    user-select: none;
  }

  .chat:hover {
    background-color: #614e4e;
  }
}

.message-container {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 50px;
  padding-left: 10%;
  padding-right: 10%;
  font-size: 20px;
  padding-bottom: 100px;
  max-height: 100vh;

  .message-user,
  .message-bot {
    margin-bottom: 30px;
  }

  .message-user {
    font-weight: 100;
    letter-spacing: 1px;
  }

  .message-bot {
    h1 {
      font-size: 24px;
      line-height: 36px;
    }
    font-weight: 600;
    p {
      margin: 0;
    }
  }
}

:global(.text-area) {
  padding: 0;
  margin-left: 20px;
}
.user-input {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  background-color: #303133;
  border-radius: 30px;

  .btn {
    width: 20px;
    height: 20px;
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
  width: 30px;
  height: 30px;
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
