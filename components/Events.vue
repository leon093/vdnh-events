<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    events: Array
})

const filter = ref('All');
const types = computed(() => [...new Set(props.events.map(event => event.type))]);

const filteredEvents = computed(() => {
    if (filter.value === 'All') {
        return props.events;
    } else {
        return props.events.filter(event => event.type === filter.value);
    }
});

const setFilter = (type) => filter.value = type;
</script>

<template>
    <section class="events-block">
        <h2 class="title">Афиша событий на</h2>

        <button @click="setFilter('All')" :class="{ active: filter === 'All' }">
            Все
        </button>
        <button v-for="(type, i) in types" :key="i" @click="setFilter(type)" :class="{ active: filter === type }">
            {{ type }}
        </button>

        <div  class="events">
            <Event :data="event" v-for="event in filteredEvents" :key="event.id" />
        </div>
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
