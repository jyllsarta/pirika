<template lang="pug">
    table.ranking
      tr
        th.rank_index.cute
          | RANK
        th.cute
          | NAME
        th.cute
          | TOTAL
        th.cute
          | TIME
        th.cute
          | DELETE
      tr.rank(v-for='rank in ranking')
        td.rank_index.cute
          | {{ranking.indexOf(rank) + 1}}
        td
          | {{rank.username}}
        td.cute
          | {{rank.score}}
        td.cute
          | {{rank.time_score}}
        td.cute
          | {{rank.remove_score}}
</template>

<script lang="ts">
  export default {
    data: function(){
      return {
      };
    },
    name: "Ranking",
    props: [
      "ranking",
    ],
    mounted: function(){
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  table{
    display: table;
  }
  th, td{
    display: table-cell;
  }
  .ranking{
    padding: 10px;
  }
  .rank_index{
    text-align: center;
  }
  .cute{
    font-family: 'Cute Font', cursive;
    font-size: 1.3em;
  }

</style>
