<template lang="pug">
    table.ranking
      tr
        th.rank_index
          | RANK
        th
          | NAME
        th
          | TOTAL
        th
          | HIT
        th
          | SPEED
      tr.rank(v-for='rank in ranking')
        td.rank_index
          | {{ranking.indexOf(rank) + 1}}
        td
          | {{rank.username}}
        td
          | {{rank.total_score}}
        td
          | {{rank.score}}
        td
          | {{rank.speed_score === -1 ? '0' : rank.speed_score}}
</template>

<script>
  export default {
    data: function(){
      return {
      };
    },
    name: "ranking",
    props: [
      "ranking",
    ],
    mounted: function(){
      console.log("loaded ui!");
    },
    computed: {
    },
    methods: {
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

</style>
