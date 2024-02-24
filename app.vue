<script setup>
const { data: events } = await useFetch('https://run.mocky.io/v3/933c458e-8d39-42b8-a9a9-b5d5d93365b6');
</script>

<template>
    <header class="header">
        <div class="container">
            <a class="logo animation" href="/">
                <img src="https://vdnh.ru/local/templates/russia_forum/img/vdnh-logo.svg" alt="ВДНХ">
                <img src="https://vdnh.ru/local/templates/russia_forum/img/RussiaLogo.svg" alt="Россия">
            </a>
        </div>
    </header>

    <main class="main container">
        <Events :events="events" />
    </main>

    <footer class="footer">
        <div class="container">
            <div class="copy">
                1939 – 2024<br>
                Москва<br>
                VDNH CREW
            </div>
        </div>
    </footer>
</template>
