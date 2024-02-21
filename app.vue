<script setup>
const { data: events } = await useFetch('https://run.mocky.io/v3/cd5e7814-efd2-47fa-89fa-e172db046f30');
</script>

<template>
    <header class="header">
        <div class="container">
            <a class="logo" href="/">
                <img src="https://vdnh.ru/local/templates/russia_forum/img/vdnh-logo.svg" alt="ВДНХ">
                <img src="https://vdnh.ru/local/templates/russia_forum/img/RussiaLogo.svg" alt="Россия">
            </a>
        </div>
    </header>

    <main class="main container">
        <Events :data="events" />
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
