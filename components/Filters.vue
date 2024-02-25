<script setup>
import { computed } from 'vue';
import { Navigation, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import NextSvg from '~/assets/images/next.svg?component';
import PrevSvg from '~/assets/images/prev.svg?component';
import 'swiper/css';

defineEmits(['filterByType', 'filterByDate'])

const props = defineProps({
    events: Array,
    selectedDate: String,
    selectedType: String
})

const daysInRussian = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const monthsInRussian = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
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
</script>

<template>
    <div class="types">
        <button v-for="(type, i) in allTypes" :key="i" @click="$emit('filterByType', type)"
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

            <SwiperSlide v-for="day in allDays" :key="day.date" @click="$emit('filterByDate', day.date)" class="days__btn">
                <div v-if="day.month" class="days__month">{{ day.month }}</div>

                <div class="days__inner" :class="{ active: selectedDate === day?.date }">
                    <div class="days__name">{{ day.name }}</div>
                    <div class="days__day">{{ day.number }}</div>
                </div>
            </SwiperSlide>
        </Swiper>

        <NextSvg class="carousel__next"  />
    </div>
</template>
