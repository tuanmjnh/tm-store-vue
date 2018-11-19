<template>
  <v-layout class="align-center justify-center">
    <v-flex xs12 sm4>
      <v-card>
        <!-- <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img> -->
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Login Application</h3>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field v-model="loginForm.email" label="username"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field type="password" v-model="loginForm.password" label="password"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <div class="spacer"></div>
                <v-checkbox v-model="loginForm.remember" label="Remember"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="spacer"></div>
          <v-btn flat color="primary" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { FBAuth } from "@/plugins/firebaseInit.js";
export default {
  data: () => ({
    loading: false,
    loginForm: {
      email: "",
      password: "",
      remember: false
    }
  }),
  created() {
    if (this.$store.state.$isAuth) this.$router.push("/");
    else this.$router.push("/auth");
  },
  methods: {
    login() {
      this.performingRequest = true;
      FBAuth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
        .then(users => {
          this.$store.state.$isAuth = true
          // this.$store.commit("auth/authUpdate", users.user);
          // this.performingRequest = false;
          this.$router.push("/dashboard");
        }).catch(error => {
          console.log(error);
          this.$store.dispatch('message', { text: error.message, color: 'error' })
          this.performingRequest = false;
          this.errorMsg = error.message;
        });
    }
  }
}
</script>

<style>
</style>
