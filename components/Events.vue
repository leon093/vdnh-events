<script setup>
import { computed, ref  } from 'vue';
import { Navigation, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import NextSvg from '~/assets/images/next.svg?component';
import PrevSvg from '~/assets/images/prev.svg?component';
import 'swiper/css';

const props = defineProps({
    events: Array
})

const selectedDate = ref(null);
const selectedType = ref('Все');
const daysInRussian = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const monthsInRussian = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const monthEndings = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const nav = { nextEl: '.carousel__next', prevEl: '.carousel__prev' };
const breakpoints = {
    '650': {
        slidesPerView: 5
    },
    '850': {
        slidesPerView: 10
    },
    '1300': {
        slidesPerView: 15
    }
}

// показываем выбранный день в заголовке
const selectedDay = computed(() => {
    if (!selectedDate.value) return
    const selectedDateTitle = new Date(selectedDate.value);
    const day = selectedDateTitle?.getDate();
    const month = selectedDateTitle?.getMonth(); // месяцы начинаются с  0
    const monthEnding = monthEndings[month];

    return `${day} ${monthEnding}`
})

// типы событий
const allTypes = computed(() => {
    const types = [...new Set(props.events.map(event => event.type))];
    types.unshift("Все");
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

const filterByDate = (date) => selectedDate.value = date;
const filterByType = (type) => selectedType.value = type;

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
</script>

<template>
    <section class="events-block">
        <h2 class="title">
            Афиша событий
            <template v-if="selectedDay">на <span class="title__selected-day"> {{ selectedDay }}</span></template>
        </h2>

        <div class="types">
            <button v-for="(type, i) in allTypes" :key="i" @click="filterByType(type)"
                :class="{ active: selectedType === type }" class="types__btn">
                {{ type }}
            </button>
        </div>

        <div class="carousel">
            <PrevSvg class="carousel__prev" />

            <Swiper slidesPerView="3"
                :space-between="10"
                :navigation="nav"
                :mousewheel="true"
                :modules="[Navigation, Mousewheel]"
                :breakpoints="breakpoints"
                class="days">

                <SwiperSlide v-for="day in allDays" :key="day.date" @click="filterByDate(day.date)" class="days__btn">
                    <div v-if="day.month" class="days__month">{{ day.month }}</div>

                    <div class="days__inner" :class="{ active: selectedDate === day?.date }">
                        <div class="days__name">{{ day.name }}</div>
                        <div class="days__day">{{ day.number }}</div>
                    </div>
                </SwiperSlide>
            </Swiper>

            <NextSvg class="carousel__next"  />
        </div>

        <div class="events">
            <div class="event" v-for="event in filteredEvents" :key="event.id">
                <img class="event__img" :src="event.image" :alt="event.name" width="270" height="195">
                <p class="event__type">{{ event.type }}</p>
                <h3 class="event__name">{{ event.name }}</h3>
                <time class="event__date">
                    {{ getEventStatus(event) }}
                </time>
            </div>
        </div>
    </section>
</template>
