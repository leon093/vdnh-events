<script setup>
defineProps({ data: Object })
</script>

<template>
    <div class="event">
        <img class="event__img" :src="data.image" :alt="data.name" width="270" height="195">
        <p class="event__type">{{ data.type }}</p>
        <h3 class="event__name">{{ data.name }}</h3>
        <time class="event__date"></time>
    </div>
</template>

<style>
:root {
    --event-bg: #fafafa;
}

.event {
    padding: 8px;
    background: var(--event-bg);
    border-radius: 18px;
}

.event__img {
    object-fit: cover;
    width: 100%;
    height: 195px;
    border-radius: 18px;
}

.event__type {
    text-transform: uppercase;
    font-size: 11px;
}

.event__name {
    font-size: 16px;
}

.event__date {
    font-size: 11px;
}
</style>
