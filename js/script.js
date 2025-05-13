// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Display current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        const today = new Date();
        currentYearSpan.textContent = today.getFullYear();
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('header nav ul li a');
    const headerElement = document.querySelector('header');
    const headerHeight = headerElement ? headerElement.offsetHeight : 75;
    // PENYESUAIAN: Buffer untuk deteksi section aktif, bisa diubah nilainya
    const scrollOffsetBuffer = headerHeight + 30; // Header height + sedikit buffer tambahan

    function makeLinksInactive() {
        navLinks.forEach(link => link.classList.remove('active'));
    }

    function checkActiveSection() {
        let currentId = '';
        let bottomMostSectionVisible = false;

        // Cek apakah bagian paling bawah dari section terakhir terlihat (untuk Contact)
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
            const lastSectionBottom = lastSection.offsetTop + lastSection.offsetHeight;
            if (window.pageYOffset + window.innerHeight >= lastSectionBottom - 20) { // Toleransi 20px
                currentId = lastSection.getAttribute('id');
                bottomMostSectionVisible = true;
            }
        }
        
        if (!bottomMostSectionVisible) {
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const sectionTop = section.offsetTop;
                
                // Kondisi aktif jika bagian atas section melewati titik referensi (header + buffer)
                if (window.pageYOffset >= sectionTop - scrollOffsetBuffer) {
                    currentId = section.getAttribute('id');
                    break; 
                }
            }
        }
        
        // Jika masih belum ada ID aktif (misalnya di paling atas halaman, sebelum hero section terdeteksi)
        if (!currentId && sections.length > 0 && window.pageYOffset < (sections[0].offsetTop - scrollOffsetBuffer)) {
             currentId = sections[0].getAttribute('id');
        }

        makeLinksInactive();

        navLinks.forEach(link => {
            const hrefAttribute = link.getAttribute('href');
            if (hrefAttribute && typeof hrefAttribute === 'string' && hrefAttribute.substring(1) === currentId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkActiveSection);
    setTimeout(checkActiveSection, 100); // Initial check

    // --- Modal Logic (Handles all modal trigger buttons) ---
    // ... (Sisa kode Modal Logic dan Gallery Slider Logic TETAP SAMA seperti yang sudah kamu berikan) ...
    const allModalTriggers = document.querySelectorAll('.credential-button, .gallery-button'); 
    const closeButtons = document.querySelectorAll('.close-button');

    allModalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            let modalId = button.getAttribute('data-modal-id');
            if (!modalId) { 
                modalId = button.getAttribute('data-gallery-id'); 
            }
            
            if (modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'block';
                    if (modal.classList.contains('gallery-modal')) {
                        const slides = modal.querySelectorAll('.image-gallery-slider .slide');
                        const galleryContainer = modal.querySelector('.image-gallery-container');
                        if (slides.length > 0 && galleryContainer) {
                            galleryContainer.currentSlideIndex = 0; 
                            slides.forEach((slide, i) => {
                                slide.classList.toggle('active-slide', i === 0);
                            });
                        }
                    }
                } else {
                    console.error('Modal not found for ID:', modalId);
                }
            } else {
                console.error('Button does not have data-modal-id or data-gallery-id attribute:', button);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // --- Gallery Slider Logic --- 
    function initializeGallery(galleryModalElement) { 
        if (!galleryModalElement) return; 

        const galleryContainer = galleryModalElement.querySelector('.image-gallery-container'); 
        const slider = galleryModalElement.querySelector('.image-gallery-slider'); 
        const slides = galleryModalElement.querySelectorAll('.image-gallery-slider .slide'); 
        const prevButton = galleryModalElement.querySelector('.prev-slide'); 
        const nextButton = galleryModalElement.querySelector('.next-slide'); 
         
        if (!galleryContainer || !slider || slides.length === 0 || !prevButton || !nextButton) { 
            if (prevButton) prevButton.style.display = 'none';  
            if (nextButton) nextButton.style.display = 'none'; 
            return; 
        } 
         
        galleryContainer.currentSlideIndex = galleryContainer.currentSlideIndex || 0; 
         
        prevButton.style.display = 'block'; 
        nextButton.style.display = 'block'; 

        function showSlide(index) { 
            slides.forEach((slide) => { 
                slide.classList.remove('active-slide'); 
            }); 
            slides[index].classList.add('active-slide'); 
            galleryContainer.currentSlideIndex = index;  
        } 

        showSlide(galleryContainer.currentSlideIndex); 


        prevButton.addEventListener('click', () => { 
            let newIndex = galleryContainer.currentSlideIndex - 1; 
            if (newIndex < 0) { 
                newIndex = slides.length - 1; 
            } 
            showSlide(newIndex); 
        }); 

        nextButton.addEventListener('click', () => { 
            let newIndex = galleryContainer.currentSlideIndex + 1; 
            if (newIndex >= slides.length) { 
                newIndex = 0; 
            } 
            showSlide(newIndex); 
        }); 
    } 

    document.querySelectorAll('.modal.gallery-modal').forEach(galleryModal => { 
        initializeGallery(galleryModal); 
    }); 
});