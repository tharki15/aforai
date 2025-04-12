// Add any interactivity if needed in the future
console.log("Bajrang Dal page loaded");

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile menu toggle functionality
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-toggle';
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('.main-nav .container');
    nav.insertBefore(mobileMenuButton, nav.firstChild);
    
    mobileMenuButton.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to stats when they come into view
    const stats = document.querySelectorAll('.stat-box');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
        stat.style.transition = 'all 0.5s ease-out';
        observer.observe(stat);
    });

    // Image Slider Functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Video Slider Functionality
    const videoSlider = document.querySelector('.video-slider');
    const videos = document.querySelectorAll('.video-player');
    const videoPrevBtn = document.querySelector('.prev-video-btn');
    const videoNextBtn = document.querySelector('.next-video-btn');
    let currentVideoIndex = 0;

    // Function to pause all videos
    function pauseAllVideos() {
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }

    // Function to update video slider position
    function updateVideoSlider() {
        const slideWidth = videoSlider.offsetWidth;
        videoSlider.style.transform = `translateX(-${currentVideoIndex * slideWidth}px)`;
    }

    // Function to play next video
    function playNextVideo() {
        pauseAllVideos();
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        updateVideoSlider();
        videos[currentVideoIndex].play().catch(error => {
            console.log("Autoplay failed:", error);
        });
    }

    // Initialize videos
    videos.forEach((video, index) => {
        // Set video attributes
        video.muted = false; // Enable sound
        video.loop = false; // Don't loop individual videos
        
        // Add event listener for video end
        video.addEventListener('ended', playNextVideo);
        
        // Add event listener for play
        video.addEventListener('play', () => {
            // Pause all other videos when one starts playing
            videos.forEach((otherVideo, otherIndex) => {
                if (otherIndex !== currentVideoIndex) {
                    otherVideo.pause();
                    otherVideo.currentTime = 0;
                }
            });
        });
        
        // Play first video automatically
        if (index === 0) {
            video.play().catch(error => {
                console.log("Autoplay failed:", error);
            });
        }
    });

    // Button click handlers
    videoPrevBtn.addEventListener('click', () => {
        pauseAllVideos();
        currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
        updateVideoSlider();
        videos[currentVideoIndex].play().catch(error => {
            console.log("Autoplay failed:", error);
        });
    });

    videoNextBtn.addEventListener('click', () => {
        pauseAllVideos();
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        updateVideoSlider();
        videos[currentVideoIndex].play().catch(error => {
            console.log("Autoplay failed:", error);
        });
    });

    // Handle window resize
    window.addEventListener('resize', updateVideoSlider);
});
