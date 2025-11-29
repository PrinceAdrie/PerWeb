// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set the current year in the footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Function to set theme
        function setTheme(isDark) {
            // Add transition class
            document.documentElement.classList.add('theme-transition');

            // Update theme attribute
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            themeToggle.setAttribute('aria-pressed', String(isDark));

            // Persist
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Update icons
            const sunIcon = themeToggle.querySelector('.fa-sun');
            const moonIcon = themeToggle.querySelector('.fa-moon');
            if (isDark) {
                if (sunIcon) sunIcon.style.opacity = '0';
                if (moonIcon) moonIcon.style.opacity = '1';
            } else {
                if (sunIcon) sunIcon.style.opacity = '1';
                if (moonIcon) moonIcon.style.opacity = '0';
            }

            // Update background videos
            updateBackgroundVideo(isDark);

            // Remove transition helper after animation
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 500);
        }

        // Switch which background video is visible/playing
        function updateBackgroundVideo(isDark) {
            const vLight = document.getElementById('bg-video-light');
            const vDark = document.getElementById('bg-video-dark');

            if (isDark) {
                if (vLight) {
                    try { vLight.pause(); } catch(e){}
                    vLight.style.opacity = '0';
                    vLight.style.visibility = 'hidden';
                }
                if (vDark) {
                    vDark.style.visibility = 'visible';
                    vDark.style.opacity = '1';
                    // attempt to play (some browsers require interaction)
                        const p = vDark.play();
                        if (p && p.catch) p.catch(() => {
                            // autoplay blocked for dark video — leave it and allow user gesture later
                        });
                }
            } else {
                if (vDark) {
                    try { vDark.pause(); } catch(e){}
                    vDark.style.opacity = '0';
                    vDark.style.visibility = 'hidden';
                }
                if (vLight) {
                    vLight.style.visibility = 'visible';
                    vLight.style.opacity = '1';
                        const p = vLight.play();
                        if (p && p.catch) p.catch(() => {
                            // autoplay blocked for light video — install a one-time user-gesture to play
                            const tryPlayOnGesture = () => {
                                try { vLight.play(); } catch(e){}
                            };
                            document.addEventListener('click', tryPlayOnGesture, { once: true });
                        });
                }
            }
        }
        
        // Initialize theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
        
        setTheme(isDark);
        
        // Handle toggle click
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setTheme(!isDark);
            themeToggle.classList.add('theme-toggle-active');
            setTimeout(() => {
                themeToggle.classList.remove('theme-toggle-active');
            }, 500);
        });
    }

    // Initialize mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

// Form submission handler (defined globally as it's used in HTML)
function handleFormSubmit(event) {
    event.preventDefault();
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        formStatus.textContent = 'Message sent successfully!';
    }
    event.target.reset();
    return false;
}