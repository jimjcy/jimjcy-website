<script setup>
import constant from "@/constant";
const route = useRoute();
console.log(route.params.id);
constant.req.post("/get_issue", {
  id: route.params.id,
  page: 0
}).then((res) => {
  const data = res.data.result;
  console.log(data);
});
</script>
<template>
  
</template>
<style scoped>

</style>