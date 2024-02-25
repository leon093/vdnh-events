<script setup>
import { computed, ref  } from 'vue';

const props = defineProps({
    events: Array
})

const selectedDate = ref(null);
const selectedType = ref('Все');
const monthEndings = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

// показываем выбранный день в заголовке
const selectedDay = computed(() => {
    if (!selectedDate.value) return
    const selectedDateTitle = new Date(selectedDate.value);
    const day = selectedDateTitle?.getDate();
    const month = selectedDateTitle?.getMonth(); // месяцы начинаются с  0
    const monthEnding = monthEndings[month];

    return `${day} ${monthEnding}`
})

// Фильтруем события по выбранной дате и типу, а также не показываем событие если у него стоит выходной в какой-то определённый день
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


// показывает режим работы события за день
const getEventStatus = (event) => {
    const now = new Date();
    const endDate = new Date(event.end_date);
    const todayHours = now.getHours();
    const todayTime = now.getTime();
    const endHours = endDate.getHours();
    const endTime = endDate.getTime();

    if(todayHours >= endHours && endTime >= todayTime) {
        return `Завтра в ${event.start_date.split('T')[1].slice(0, 5)}`
    } else {
        return `Открыто до ${event.end_date.split('T')[1].slice(0, 5)}`
    }
};

// фильтруем по типу события
const filterByType = (type) => selectedType.value = type;

// фильтруем по дате события
const filterByDate = (date) => selectedDate.value = date;
</script>

<template>
    <section class="events-block">
        <h2 class="title">
            Афиша событий
            <template v-if="selectedDay">на <span class="title__selected-day"> {{ selectedDay }}</span></template>
        </h2>

        <Filters
            :events="events"
            :selectedDate="selectedDate"
            :selectedType="selectedType"
            @filter-by-type="filterByType"
            @filter-by-date="filterByDate"
        />

        <transition-group name="list" tag="div" class="events">
            <div class="event" v-for="event in filteredEvents" :key="event.id">
                <img class="event__img" :src="event.image" :alt="event.name" width="270" height="195">
                <p class="event__type">{{ event.type }}</p>
                <h3 class="event__name">{{ event.name }}</h3>
                <time class="event__date">
                    {{ getEventStatus(event) }}
                </time>
            </div>
        </transition-group>
    </section>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
