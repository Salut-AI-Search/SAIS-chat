<template>
  <q-layout>
    <q-page-container>
      <q-page class="column items-center">
        <form class="inputs-container column">
          <div>
            <p>Логин</p>
            <q-input v-model="login" outlined class="input" color="black" />
          </div>
          <div>
            <p>Пароль</p>
            <q-input
              v-model="password"
              outlined
              class="input"
              color="black"
              type="password"
            />
          </div>
        </form>
        <q-btn class="login-btn" label="Войти" outline @click="handleLogin" />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useAuth from 'src/api/composables/useAuth';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

const { apiLogin } = useAuth();
const router = useRouter();

const login = ref();
const password = ref();
const errorMessage = ref('');

const handleLogin = () => {
  if (login.value && password.value) {
    apiLogin(login.value, password.value)
      .then((res) => {
        Cookies.set('jwtToken', res);
        router.push({ name: 'chat' });
      })
      .catch((e) => {
        errorMessage.value = e;
      });
  }
};
</script>

<style lang="scss" scoped>
.inputs-container {
  margin-top: 200px;
  width: 500px;
  gap: 40px;

  p {
    font-size: 26px;
  }
}

.error-message {
  margin-top: 20px;
  font-size: 22px;
  color: red;
}

.login-btn {
  margin-top: 60px;
  width: 200px;
  border-radius: 24px;
}
</style>
