<template lang="pug">
  .name_input_area
    span.prefix
      | 名前：
    .fixed_name( v-if="!inputting")
      | {{fullName === "" ? "ななし(ランキング登録されません)" : fullName}}
    button.change_button(@click="setInputMode", v-if="!inputting")
      | 変更
    input.name_input_box(type="text", @blur="onBlur", v-model="rawName", v-if="inputting" ref="name_input_box")
</template>

<script lang="ts">
import Vue from "vue";
import jsSHA from "jssha";
export default {
  name: "NameInputArea",
  data: function() {
    return {
      rawName: "",
      inputting: false
    };
  },
  mounted: function() {
    if (localStorage.rawName) {
      this.rawName = localStorage.rawName;
    }
    console.log("loaded name!");
    this.setName();
  },
  computed: {
    fullName: function() {
      const splitted = this.rawName.replace(/📛/g, "").split("#");
      const displayName = splitted[0];
      if (splitted.length === 1) {
        return displayName;
      }
      const target = splitted.slice(1).join("");
      const sha = new jsSHA("SHA-256", "TEXT");
      sha.update(target);
      const sliced = sha.getHash("B64").slice(0, 10);
      return `${displayName}📛${sliced}`;
    }
  },
  methods: {
    onBlur: function() {
      this.inputting = false;
      localStorage.rawName = this.rawName;
      this.$emit("inputStateChanged", false);
      this.setName();
    },
    setInputMode: function() {
      this.inputting = true;
      this.$emit("inputStateChanged", true);
      // inputtingをオンにしても次のフレームまで待たないとまだ入力欄は作られない
      Vue.nextTick( ()=> {
        this.$refs.name_input_box.focus()
      });
      console.log(this.$refs);
    },
    setName: function() {
      this.$emit("setName", this.fullName);
    }
  }
};
</script>

<style lang='scss' scoped>
.name_input_area {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 50%;
  .prefix {
  }
  .fixed_name {
    position: absolute;
    top: 0;
    left: 55px;
  }
  .name_input_box {
    position: absolute;
    top: 0;
    left: 55px;
  }
  .change_button {
    position: absolute;
    right: 2%;
  }
}
</style>
