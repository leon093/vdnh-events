<script setup>
defineProps({
    data: Array
})
</script>

<template>
    <section class="events-block">
        <h2 class="title">Афиша событий на</h2>

        <div v-if="data?.length" class="events">
            <Event :data="event" v-for="event in data" />
        </div>
        <p v-else class="not-found">Новых событий пока нет</p>
    </section>
</template>

<style>
:root {
    --events-block-bg: #fff;
}

.events-block {
    background: var(--events-block-bg);
    padding: 1rem 2rem;
    border-radius: 1rem;
}

.events {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.event {
    flex: 0 1 23%;
}
</style>
