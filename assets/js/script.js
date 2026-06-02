document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('#menu');
    const navbar = document.querySelector('.navbar');
    const scrollTop = document.querySelector('#scroll-top');
    const themeToggle = document.querySelector('#theme-toggle');

    // Theme Toggle Logic
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggle.classList.replace('fa-moon', 'fa-sun');
        }
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.classList.replace('fa-moon', 'fa-sun');
        }
    });

    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('nav-toggle');
    });

    window.addEventListener('scroll', () => {
        menu.classList.remove('fa-times');
        navbar.classList.remove('nav-toggle');

        if (window.scrollY > 60) {
            scrollTop.classList.add('active');
        } else {
            scrollTop.classList.remove('active');
        }

        // Scroll spy
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar ul li a');

        sections.forEach(section => {
            const height = section.offsetHeight;
            const offset = section.offsetTop - 200;
            const top = window.scrollY;
            const id = section.getAttribute('id');

            if (top > offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Smooth scrolling for all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

document.addEventListener('visibilitychange', () => {
    const favicon = document.getElementById('favicon');
    if (document.visibilityState === "visible") {
        document.title = "Portfolio | Suryakumar";
        favicon.setAttribute("href", "assets/images/logo.png");
    } else {
        document.title = "Come Back Soon! | Portfolio";
        favicon.setAttribute("href", "assets/images/logo.png");
    }
});

// Typed.js effect
const typed = new Typed(".typing-text", {
    strings: ["MERN Stack Developer", "FreeLancer", "Cloud Enthusiast"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

async function fetchData(type = "skills") {
    let response;
    try {
        if (type === "skills") {
            response = await fetch("skills.json");
        } else {
            response = await fetch("./projects/projects.json");
        }
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error: ", error);
        return [];
    }
}

function showSkills(skills) {
    const skillsContainer = document.querySelector(".skills .skills-container");
    let skillHTML = "<div class='row'>";
    
    skills.forEach(skill => {
        skillHTML += `
        <div class="column">
            <div class="skill tilt">
                <div class="skill-content">
                    <img src="${skill.icon}" alt="${skill.name} Icon" class="skill-icon">
                    <div class="skill-details">
                        <h3>${skill.name}</h3>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${skill.percentage}%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    skillHTML += "</div>";
    
    if (skillsContainer) {
        skillsContainer.innerHTML = skillHTML;
        VanillaTilt.init(document.querySelectorAll(".tilt"), {
            max: 15,
        });
    }
}

function showProjects(projects, filter = "all") {
    const projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    
    let filteredProjects = projects;
    if (filter !== "all") {
        filteredProjects = projects.filter(project => project.category === filter);
    }

    filteredProjects.slice(0, 10)
        .forEach(project => {
            projectHTML += `
            <div class="box tilt">
                <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="${project.name}" />
                <div class="content">
                    <div class="tag">
                        <h3>${project.name}</h3>
                    </div>
                    <div class="desc">
                        <p>${project.desc}</p>
                        <div class="btns">
                            <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                            <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    
    if (projectsContainer) {
        projectsContainer.innerHTML = projectHTML;
        VanillaTilt.init(document.querySelectorAll(".tilt"), {
            max: 15,
        });
        ScrollReveal().reveal('.work .box', { interval: 200 });
    }
}

fetchData("skills").then(data => {
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
    
    // Add event listeners for project filters (if they exist)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showProjects(data, btn.getAttribute('data-filter'));
        });
    });
});

// Initialize VanillaTilt for static elements
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});

// Accordion for Achievements
function toggleAccordion(id) {
    const contents = document.querySelectorAll('.accordion-content');
    contents.forEach(content => {
        content.style.display = 'none';
    });
    
    const target = document.getElementById(id);
    if (target) target.style.display = 'flex';
    
    const headings = document.querySelectorAll('.accordion-heading');
    headings.forEach(heading => {
        heading.classList.remove('active');
        if (heading.getAttribute('data-target') === id) {
            heading.classList.add('active');
        }
    });
}

// Tawk.to Live Chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/65ddf2ab9131ed19d9723ebf/1hnlfns44';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();

// Scroll Reveal Animations
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.home .content h2', { delay: 200 });
srtop.reveal('.home .content p', { delay: 300 });
srtop.reveal('.home .content .btn', { delay: 400 });
srtop.reveal('.home .image', { delay: 500 });
srtop.reveal('.home .social-icons li', { interval: 200 });
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 300 });
srtop.reveal('.about .content p', { delay: 400 });
srtop.reveal('.about .content .box-container', { delay: 500 });
srtop.reveal('.about .content .resumebtn', { delay: 600 });
srtop.reveal('.skills .row', { interval: 200 });
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });
srtop.reveal('.contact .container', { delay: 400 });

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
