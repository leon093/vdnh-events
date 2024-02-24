<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
    events: Array
})

const selectedDate = ref(null);
const selectedType = ref(null);
const daysInRussian = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const monthsInRussian = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const monthEndings = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const selectedDay = computed(() => {
    if(!selectedDate.value) return
    const selectedDateTitle = new Date(selectedDate.value);
    const day = selectedDateTitle?.getDate();
    const month = selectedDateTitle?.getMonth(); // месяцы начинаются с  0
    const monthEnding = monthEndings[month];

    return `${day} ${monthEnding}`
})

const allTypes = computed(() => {
    const types = [...new Set(props.events.map(event => event.type))];
    types.unshift("Все"); // Add "All" as the first option
    return types;
});

// диапазон дней события
const allDays = computed(() => {
    let days = [];
    let firstDayOfMonth = null;
    const today = new Date(); // текущая дата
    today.setHours(0, 0, 0, 0); // сбрасываем текущую дату в часах до 00:00

    props.events.forEach(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);

        while (startDate <= endDate) {
            if (startDate >= today) {
                // Добавляем только те даты, которые находятся в диапазоне от сегодняшнего дня и дальше
                const dayName = daysInRussian[startDate.getDay()];
                const monthName = monthsInRussian[startDate.getMonth()]; // Получение названия месяца

                // Проверяем, является ли текущая дата первым днем месяца
                if (firstDayOfMonth === null || firstDayOfMonth.getMonth() !== startDate.getMonth()) {
                    firstDayOfMonth = new Date(startDate);
                }

                days.push({
                    date: startDate.toISOString().split('T')[0],
                    number: startDate.getDate(),
                    name: dayName,
                    month: firstDayOfMonth.getDate() === startDate.getDate() ? monthName : null // Добавляем название месяца только для первых дней месяца
                });
            }

            startDate.setDate(startDate.getDate() + 1);
        }
    });

    // Удаляем дубликаты, используя Set и map для сохранения только уникальных элементов
    return Array.from(new Set(days.map(day => day.date))).map(date => {
        const day = days.find(d => d.date === date);
        return { date, number: day.number, name: day.name, month: day.month };
    });
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

const isEventActive = computed(() => {
    const now = new Date();
    return props.events.some(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        return now >= startDate && now <= endDate;
    });
});



// При монтировании компонента устанавливаем выбранную дату на текущий день
onMounted(() => {
    // const today = new Date();
    // selectedDate.value = today.toISOString().split('T')[0];
});
</script>

<template>
    <section class="events-block">
        <h2 class="title">
            Афиша событий <span v-if="selectedDay">на {{ selectedDay }}</span>
        </h2>

        <button v-for="(type, i) in allTypes" :key="i" @click="filterByType(type)"
            :class="{ active: selectedType === type }">
            {{ type }}
        </button>

        <div v-for="day in allDays" :key="day.date" @click="filterByDate(day.date)">
            {{ day.number }} {{ day.name }} {{ day.month ? day.month : '' }}
        </div>

        <div class="events">
            <div class="event" v-for="event in filteredEvents" :key="event.id">
                <img class="event__img" :src="event.image" :alt="event.name" width="270" height="195">
                <p class="event__type">{{ event.type }}</p>
                <h3 class="event__name">{{ event.name }}</h3>
                <time class="event__date">
                    <span v-if="isEventActive">Сегодня до</span>
                    <span v-else>Откроется</span>
                    {{ isEventActive ? event.end_date.split('T')[1].slice(0,  5) : event.start_date.split('T')[1].slice(0,  5) }}
                </time>
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
