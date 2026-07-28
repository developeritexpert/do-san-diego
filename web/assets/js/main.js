/**
 * DO San Diego - Frontend Interactive Behavior
 */

document.addEventListener('DOMContentLoaded', () => {
    // Filter tag pills toggle interaction
    const pills = document.querySelectorAll('.pill-tag');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Interactive 3-Item Restaurant Slider Logic
    const carouselTrack = id => document.getElementById(id);
    const track = carouselTrack('eatCarouselTrack');
    const activeTitle = document.getElementById('eatActiveTitle');
    const indicatorThumb = document.getElementById('eatIndicatorThumb');

    if (track) {
        let cards = Array.from(track.querySelectorAll('.eat-card-item'));
        if (cards.length > 0) {
            let activeIndex = 0;

            function updateCarousel() {
                // Ensure active index bounds
                if (activeIndex < 0) activeIndex = cards.length - 1;
                if (activeIndex >= cards.length) activeIndex = 0;

                // Mark active card class
                cards.forEach((card, idx) => {
                    if (idx === activeIndex) {
                        card.classList.add('active-slide');
                        // Update active center title (only single title displayed under center card)
                        const img = card.querySelector('img');
                        const titleText = img ? img.getAttribute('alt') : 'Restaurants';
                        if (activeTitle) activeTitle.textContent = titleText || 'Restaurants';
                    } else {
                        card.classList.remove('active-slide');
                    }
                });

                // Calculate horizontal translation shift to center the active item
                const cardWidth = cards[0].offsetWidth + 20; // 20px gap
                // Offset shift so active card is centered (index 1 is middle when activeIndex=1)
                const offsetShift = - (activeIndex - 1) * cardWidth;
                track.style.transform = `translateX(${offsetShift}px)`;

                // Update bottom progress bar position
                if (indicatorThumb) {
                    const maxLeft = 100 - (70 / 220 * 100); // % space
                    const percent = cards.length > 1 ? (activeIndex / (cards.length - 1)) * maxLeft : 0;
                    indicatorThumb.style.left = `${percent}%`;
                }
            }

            // Set initial center card active (index 1 if available)
            if (cards.length >= 3) {
                activeIndex = 1;
            }
            updateCarousel();

            // Enable manual card click selection (no auto scroll)
            cards.forEach((card, index) => {
                card.addEventListener('click', (e) => {
                    if (index !== activeIndex) {
                        e.preventDefault();
                        activeIndex = index;
                        updateCarousel();
                    }
                });
            });
        }
    }

    // Where to Stay Prev/Next Slider Control Logic
    const stayTrack = document.getElementById('stayCarouselTrack');
    const stayPrev = document.getElementById('stayPrevBtn');
    const stayNext = document.getElementById('stayNextBtn');

    if (stayTrack && stayPrev && stayNext) {
        const stayCards = Array.from(stayTrack.querySelectorAll('.stay-card-item'));
        let currentStayIndex = 0;

        function updateStaySlider() {
            if (stayCards.length === 0) return;
            const maxIndex = Math.max(0, stayCards.length - 3);
            if (currentStayIndex < 0) currentStayIndex = 0;
            if (currentStayIndex > maxIndex) currentStayIndex = maxIndex;

            const cardWidth = stayCards[0].offsetWidth + 24; // 24px gap
            stayTrack.style.transform = `translateX(-${currentStayIndex * cardWidth}px)`;
        }

        stayPrev.addEventListener('click', () => {
            if (currentStayIndex > 0) {
                currentStayIndex--;
                updateStaySlider();
            }
        });

        stayNext.addEventListener('click', () => {
            const maxIndex = Math.max(0, stayCards.length - 3);
            if (currentStayIndex < maxIndex) {
                currentStayIndex++;
                updateStaySlider();
            }
        });
    }

    // What To Do Category Slider Prev/Next Control Logic
    const todoTrack = document.getElementById('todoCarouselTrack');
    const todoPrev = document.getElementById('todoPrevBtn');
    const todoNext = document.getElementById('todoNextBtn');

    if (todoTrack && todoPrev && todoNext) {
        const todoCards = Array.from(todoTrack.querySelectorAll('.todo-card-item'));
        let currentTodoIndex = 0;

        function updateTodoSlider() {
            if (todoCards.length === 0) return;
            const maxIndex = Math.max(0, todoCards.length - 3);
            if (currentTodoIndex < 0) currentTodoIndex = 0;
            if (currentTodoIndex > maxIndex) currentTodoIndex = maxIndex;

            const cardWidth = todoCards[0].offsetWidth + 24; // 24px gap
            todoTrack.style.transform = `translateX(-${currentTodoIndex * cardWidth}px)`;
        }

        todoPrev.addEventListener('click', () => {
            if (currentTodoIndex > 0) {
                currentTodoIndex--;
                updateTodoSlider();
            }
        });

        todoNext.addEventListener('click', () => {
            const maxIndex = Math.max(0, todoCards.length - 3);
            if (currentTodoIndex < maxIndex) {
                currentTodoIndex++;
                updateTodoSlider();
            }
        });
    }
});






