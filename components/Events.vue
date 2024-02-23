<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
    events: Array
})

const selectedDate = ref(null);
const selectedType = ref(null);

const allTypes = computed(() => {
    const types = [...new Set(props.events.map(event => event.type))];
    types.unshift("Все"); // Add "All" as the first option
    return types;
});

// диапазон дней события
const allDays = computed(() => {
    let days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    props.events.forEach(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        while (startDate <= endDate) {
            // Only add dates that are on or after today
            if (startDate >= today) {
                days.push(startDate.toISOString().split('T')[0]);
            }
            startDate.setDate(startDate.getDate() + 1);
        }
    });
    return [...new Set(days)]; // Remove duplicates
});

// Computed property to filter events by the selected date and type
const filteredEvents = computed(() => {
    return props.events.filter(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const eventDates = [];

        while (startDate <= endDate) {
            const dayOfWeek = startDate.toLocaleString('en-US', { weekday: 'long' });
            if (dayOfWeek !== event.weekend) {
                eventDates.push(startDate.toISOString().split('T')[0]);
            }
            startDate.setDate(startDate.getDate() + 1);
        }
        return (!selectedType.value || event.type === selectedType.value || selectedType.value === "Все") &&
            (!selectedDate.value || eventDates.includes(selectedDate.value));
    });
});

const filterByDate = (date) => {
    selectedDate.value = date;
};

const filterByType = (type) => {
    selectedType.value = type;
};


// При монтировании компонента устанавливаем выбранную дату на текущий день
onMounted(() => {
    const today = new Date();
    selectedDate.value = today.toISOString().split('T')[0];
});
</script>

<template>
    <section class="events-block">
        <h2 class="title">Афиша событий на</h2>

        <!-- <button @click="filterByType('All')" :class="{ active: selectedType === 'All' }">
            Все
        </button> -->
        <button v-for="(type, i) in allTypes" :key="i" @click="filterByType(type)"
            :class="{ active: selectedType === type }">
            {{ type }}
        </button>

        <div v-for="day in allDays" :key="day" @click="filterByDate(day)">
            {{ day }}
        </div>

        <div class="events">
            <div class="event" v-for="event in filteredEvents" :key="event.id">
                <img class="event__img" :src="event.image" :alt="event.name" width="270" height="195">
                <p class="event__type">{{ event.type }}</p>
                <h3 class="event__name">{{ event.name }}</h3>
                <time class="event__date"></time>
            </div>
        </div>
    </section>
</template>

<style>
:root {
    --events-block-bg: #fff;
    --event-bg: #fafafa;
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
