<template lang="pug">
  .name_input_area
    span.prefix
      | NAME:
    span.fixed_name( v-if="!inputting")
      | {{fullName === "" ? "NONAME" : fullName}}
    img.change_button(@click="setInputMode", v-if="!inputting" src="/images/arrow/pencil.png")
    input.name_input_box(type="text", @blur="onBlur", v-model="rawName", v-if="inputting" ref="name_input_box" maxlength=6)
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
      const sliced = sha.getHash("B64").slice(0, 6);
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
  top: 25%;
  left: 10%;
  width: 80%;
  text-align: center;
  .prefix {
    display: inline-block;
    font-family: 'Cute Font', cursive;
    font-size: 60px;
  }
  .fixed_name {
    display: inline-block;
    font-size: 35px;
  }
  .name_input_box {
    width: 50%;
    display: inline-block;
    font-size: 35px;
  }
  .change_button {
    display: inline-block;
    width: 35px;
    height: 35px;
    vertical-align: text-bottom;
  }
}
</style>
