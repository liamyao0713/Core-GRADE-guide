/**
 * Core GRADE Website - Interactive Features
 * Collapsible navigation and content sections
 */

document.addEventListener('DOMContentLoaded', function() {
    const startInteractiveFeatures = function() {
    // Initialize collapsible navigation
    initCollapsibleNav();

    // Initialize nested navigation collapse (level 3 under level 2)
    initNestedNavCollapse();

    // Initialize collapsible content sections
    initCollapsibleContent();

    // Initialize chapter-level collapse
    initChapterCollapse();

    // Initialize sub-chapter (Level 2) collapse
    initSubChapterCollapse();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize scroll spy
    initScrollSpy();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize reference citation hover popups
    initRefPopups();

    // Initialize search
    initSearch();

    // Video modal - Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var overlay = document.getElementById('videoModal');
            if (overlay && overlay.classList.contains('active')) {
                closeVideoModal();
            }
        }
    });

    // Right sidebar tab switching
    var tabBtns = document.querySelectorAll('.right-sidebar-tabs .tab-btn');
    var tabContents = document.querySelectorAll('#rightSidebar .tab-content');
    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = this.getAttribute('data-tab') + '-tab';
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            tabContents.forEach(function(tc) { tc.classList.remove('active'); });
            var target = document.getElementById(tabId);
            if (target) target.classList.add('active');
        });
    });

    // Default to Collapse All state
    collapseAll();
    };

    if (window.coreGradeContentReady && typeof window.coreGradeContentReady.then === 'function') {
        window.coreGradeContentReady.then(startInteractiveFeatures);
    } else {
        startInteractiveFeatures();
    }
});

/**
 * Collapsible Navigation
 */
function initCollapsibleNav() {
    const navSections = document.querySelectorAll('.nav-section');
    
    navSections.forEach((section, index) => {
        const title = section.querySelector('.nav-section-title');
        const navList = section.querySelector('.nav-list');
        
        if (title && navList) {
            // Add collapse button
            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'nav-collapse-btn';
            collapseBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            collapseBtn.setAttribute('aria-expanded', 'true');
            title.appendChild(collapseBtn);
            
            // Add collapsed class to nav-list
            navList.classList.add('nav-list-collapsible');
            
            // Toggle collapse on click
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleCollapse(navList, collapseBtn);
            });
            
            // Also allow clicking on title
            title.addEventListener('click', function(e) {
                if (e.target !== collapseBtn && !collapseBtn.contains(e.target)) {
                    toggleCollapse(navList, collapseBtn);
                }
            });
        }
    });
}

/**
 * Toggle collapse state
 */
function toggleCollapse(element, button) {
    const isExpanded = element.classList.contains('collapsed');

    if (isExpanded) {
        element.classList.remove('collapsed');
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
        element.classList.add('collapsed');
        button.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }
}

/**
 * Nested Navigation Collapse (Level 3 under Level 2)
 */
function initNestedNavCollapse() {
    const navItemsWithSubnav = document.querySelectorAll('.nav-item-has-subnav');

    navItemsWithSubnav.forEach(item => {
        const link = item.querySelector('.sidebar-link.level-2');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleNestedNavCollapse(item);
            });
        }
    });
}

function toggleNestedNavCollapse(item) {
    const isExpanded = item.classList.contains('expanded');

    if (isExpanded) {
        item.classList.remove('expanded');
    } else {
        item.classList.add('expanded');
    }
}

/**
 * Chapter-level Collapsible Functionality
 */
function initChapterCollapse() {
    const chapterHeaders = document.querySelectorAll('.chapter-header');
    
    chapterHeaders.forEach(header => {
        const collapseBtn = header.querySelector('.chapter-collapse-btn');
        const content = header.nextElementSibling; // .chapter-content
        
        if (collapseBtn && content) {
            // Toggle on button click
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleChapterCollapse(content, collapseBtn);
            });
            
            // Also allow clicking on header
            header.style.cursor = 'pointer';
            header.addEventListener('click', function(e) {
                if (e.target !== collapseBtn && !collapseBtn.contains(e.target)) {
                    toggleChapterCollapse(content, collapseBtn);
                }
            });
        }
    });
}

function toggleChapterCollapse(content, button) {
    const isCollapsed = content.classList.contains('collapsed');

    if (isCollapsed) {
        content.classList.remove('collapsed');
        // Expand inner content-articles that are not individually collapsible
        content.querySelectorAll('.content-article').forEach(article => {
            const parentSection = article.closest('.content-section');
            const hasCollapseBtn = parentSection && parentSection.querySelector('.content-collapse-btn');
            if (!hasCollapseBtn) {
                article.classList.remove('collapsed');
            }
        });
        button.setAttribute('aria-expanded', 'true');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        content.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

/**
 * Sub-chapter (Level 2) Collapsible Functionality
 */
function initSubChapterCollapse() {
    const subChapterHeaders = document.querySelectorAll('.sub-chapter-header');

    subChapterHeaders.forEach(header => {
        const collapseBtn = header.querySelector('.sub-chapter-collapse-btn');
        const content = header.nextElementSibling; // .sub-chapter-content

        if (collapseBtn && content) {
            // Toggle on button click
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleSubChapterCollapse(content, collapseBtn);
            });

            // Also allow clicking on header
            header.style.cursor = 'pointer';
            header.addEventListener('click', function(e) {
                if (e.target !== collapseBtn && !collapseBtn.contains(e.target)) {
                    toggleSubChapterCollapse(content, collapseBtn);
                }
            });
        }
    });
}

function toggleSubChapterCollapse(content, button) {
    const isCollapsed = content.classList.contains('collapsed');

    if (isCollapsed) {
        content.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        content.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

/**
 * Collapsible Content Sections
 */
function initCollapsibleContent() {
    const contentSections = document.querySelectorAll('.content-section');
    
    contentSections.forEach((section, index) => {
        const header = section.querySelector('.section-header');
        const article = section.querySelector('.content-article');
        
        // Get the h3 text to determine if it's a level 2 heading (starts with number like "4.1")
        const h3 = header ? header.querySelector('h3') : null;
        const isLevel2Heading = h3 && /^\d+\.\d+\s/.test(h3.textContent);
        
        // Only add collapse functionality for level 2 headings (e.g., "4.1 ...", "4.2 ...")
        if (header && isLevel2Heading) {
            // Add collapse toggle button
            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'content-collapse-btn';
            collapseBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            collapseBtn.setAttribute('aria-label', 'Toggle section');
            header.appendChild(collapseBtn);
            
            // Find all following sibling sections until next level 2 heading
            const siblingSections = [];
            let nextSibling = section.nextElementSibling;
            
            while (nextSibling) {
                const nextH3 = nextSibling.querySelector('h3');
                if (nextH3 && /^\d+\.\d+\s/.test(nextH3.textContent)) {
                    // Found next level 2 heading, stop
                    break;
                }
                siblingSections.push(nextSibling);
                nextSibling = nextSibling.nextElementSibling;
            }
            
            // Toggle on click - collapse/expand this section and all sibling sections
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleLevel2Section(section, siblingSections, collapseBtn);
            });
            
            // Also allow clicking on header
            header.style.cursor = 'pointer';
            header.addEventListener('click', function(e) {
                if (e.target !== collapseBtn && !collapseBtn.contains(e.target)) {
                    toggleLevel2Section(section, siblingSections, collapseBtn);
                }
            });
        } else {
            // For level 3 headings (no number), remove any existing collapse button and disable collapse
            const existingBtn = header ? header.querySelector('.content-collapse-btn') : null;
            if (existingBtn) {
                existingBtn.remove();
            }
            if (header) {
                header.style.cursor = 'default';
            }
        }
    });
}

/**
 * Toggle content collapse
 */
function toggleContentCollapse(article, button) {
    const isCollapsed = article.classList.contains('collapsed');
    
    if (isCollapsed) {
        article.classList.remove('collapsed');
        button.classList.remove('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        article.classList.add('collapsed');
        button.classList.add('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

/**
 * Toggle content collapse with sibling sections
 */
function toggleContentCollapseWithSiblings(mainArticle, siblingSections, button) {
    const isCollapsed = mainArticle.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Expand all
        mainArticle.classList.remove('collapsed');
        button.classList.remove('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        
        // Expand all sibling sections
        siblingSections.forEach(sibling => {
            const siblingArticle = sibling.querySelector('.content-article');
            if (siblingArticle) {
                siblingArticle.classList.remove('collapsed');
            }
        });
    } else {
        // Collapse all
        mainArticle.classList.add('collapsed');
        button.classList.add('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        // Collapse all sibling sections
        siblingSections.forEach(sibling => {
            const siblingArticle = sibling.querySelector('.content-article');
            if (siblingArticle) {
                siblingArticle.classList.add('collapsed');
            }
        });
    }
}

/**
 * Toggle sibling sections (for level 2 headings without their own article)
 */
function toggleSiblingSections(siblingSections, button) {
    // Check if any sibling is collapsed
    const anyCollapsed = siblingSections.some(sibling => {
        const article = sibling.querySelector('.content-article');
        return article && article.classList.contains('collapsed');
    });
    
    if (anyCollapsed) {
        // Expand all sibling sections
        siblingSections.forEach(sibling => {
            const siblingArticle = sibling.querySelector('.content-article');
            if (siblingArticle) {
                siblingArticle.classList.remove('collapsed');
            }
        });
        button.classList.remove('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        // Collapse all sibling sections
        siblingSections.forEach(sibling => {
            const siblingArticle = sibling.querySelector('.content-article');
            if (siblingArticle) {
                siblingArticle.classList.add('collapsed');
            }
        });
        button.classList.add('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

/**
 * Toggle level 2 section and all its sibling sections (level 3 headings)
 */
function toggleLevel2Section(level2Section, siblingSections, button) {
    // Check the current state based on button class
    const isCurrentlyExpanded = !button.classList.contains('collapsed');
    
    if (isCurrentlyExpanded) {
        // Currently expanded, so collapse
        const level2Article = level2Section.querySelector('.content-article');
        // Collapse level 2 section's article if it exists
        if (level2Article) {
            level2Article.classList.add('collapsed');
        }
        
        // Hide all sibling sections (level 3 headings) completely
        siblingSections.forEach(sibling => {
            sibling.style.display = 'none';
        });
        
        button.classList.add('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
        // Currently collapsed, so expand
        const level2Article = level2Section.querySelector('.content-article');
        // Expand level 2 section's article if it exists
        if (level2Article) {
            level2Article.classList.remove('collapsed');
        }
        
        // Show all sibling sections (level 3 headings)
        siblingSections.forEach(sibling => {
            sibling.style.display = 'block';
            const siblingArticle = sibling.querySelector('.content-article');
            if (siblingArticle) {
                siblingArticle.classList.remove('collapsed');
            }
        });
        
        button.classList.remove('collapsed');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            const icon = toggle.querySelector('i');
            if (sidebar.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !toggle.contains(e.target) && 
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                toggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}

/**
 * Scroll Spy - Highlight active navigation item
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.content-section[id]');
    const navLinks = document.querySelectorAll('.sidebar-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove all active classes
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.sidebar-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    
                    // Scroll to active link in sidebar
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        const linkTop = activeLink.offsetTop;
                        const sidebarHeight = sidebar.clientHeight;
                        sidebar.scrollTop = Math.max(0, linkTop - sidebarHeight / 3);
                    }
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                // Check if target is a level 2 heading or level 3 heading
                const h3 = target.querySelector('h3');
                let targetSection = target;
                
                // If it's a level 3 heading, find its parent level 2 heading section
                if (h3 && !/^\d+\.\d+\s/.test(h3.textContent)) {
                    // Find the previous level 2 heading section
                    let prevSibling = target.previousElementSibling;
                    while (prevSibling) {
                        const prevH3 = prevSibling.querySelector('h3');
                        if (prevH3 && /^\d+\.\d+\s/.test(prevH3.textContent)) {
                            targetSection = prevSibling;
                            break;
                        }
                        prevSibling = prevSibling.previousElementSibling;
                    }
                }
                
                // Expand the target section (level 2 heading)
                const btn = targetSection.querySelector('.content-collapse-btn');
                if (btn) {
                    // Find sibling sections for this level 2 heading
                    const siblingSections = [];
                    let nextSibling = targetSection.nextElementSibling;
                    while (nextSibling) {
                        const nextH3 = nextSibling.querySelector('h3');
                        if (nextH3 && /^\d+\.\d+\s/.test(nextH3.textContent)) {
                            break;
                        }
                        siblingSections.push(nextSibling);
                        nextSibling = nextSibling.nextElementSibling;
                    }
                    
                    // Force expand the level 2 section
                    const level2Article = targetSection.querySelector('.content-article');
                    if (level2Article) {
                        level2Article.classList.remove('collapsed');
                    }
                    
                    // Show all sibling sections (level 3 headings)
                    siblingSections.forEach(sibling => {
                        sibling.style.display = 'block';
                        const siblingArticle = sibling.querySelector('.content-article');
                        if (siblingArticle) {
                            siblingArticle.classList.remove('collapsed');
                        }
                    });
                    
                    btn.classList.remove('collapsed');
                    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
                }
                
                // Expand parent nav section if collapsed
                const parentNav = target.closest('.nav-section');
                if (parentNav) {
                    const navList = parentNav.querySelector('.nav-list');
                    const btn = parentNav.querySelector('.nav-collapse-btn');
                    if (navList && btn && navList.classList.contains('collapsed')) {
                        toggleCollapse(navList, btn);
                    }
                }
                
                // Smooth scroll to target
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
                
                // Close mobile menu if open
                const sidebar = document.getElementById('sidebar');
                const toggle = document.getElementById('mobileMenuToggle');
                if (sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    if (toggle) {
                        toggle.querySelector('i').className = 'fas fa-bars';
                    }
                }
            }
        });
    });
}

/**
 * Utility: Expand all sections
 */
function expandAll() {
    // Expand all chapters
    document.querySelectorAll('.chapter-content.collapsed').forEach(content => {
        content.classList.remove('collapsed');
        const btn = content.parentElement.querySelector('.chapter-collapse-btn');
        if (btn) {
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        }
    });
    
    // Expand all nav sections
    document.querySelectorAll('.nav-list-collapsible.collapsed').forEach(list => {
        list.classList.remove('collapsed');
        const btn = list.parentElement.querySelector('.nav-collapse-btn');
        if (btn) {
            btn.classList.remove('collapsed');
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
    });
    
    // Expand all content sections
    document.querySelectorAll('.content-article.collapsed').forEach(article => {
        article.classList.remove('collapsed');
        const btn = article.parentElement.querySelector('.content-collapse-btn');
        if (btn) {
            btn.classList.remove('collapsed');
            btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        }
    });
}

/**
 * Utility: Collapse all sections
 */
function collapseAll() {
    // Collapse all chapters
    document.querySelectorAll('.chapter-content').forEach(content => {
        content.classList.add('collapsed');
        const btn = content.parentElement.querySelector('.chapter-collapse-btn');
        if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
    });
    
    // Collapse all nav sections
    document.querySelectorAll('.nav-list-collapsible').forEach(list => {
        list.classList.add('collapsed');
        const btn = list.parentElement.querySelector('.nav-collapse-btn');
        if (btn) {
            btn.classList.add('collapsed');
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
    });
    
    // Collapse all content sections
    document.querySelectorAll('.content-article').forEach(article => {
        article.classList.add('collapsed');
        const btn = article.parentElement.querySelector('.content-collapse-btn');
        if (btn) {
            btn.classList.add('collapsed');
            btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
    });
}

// Export functions for global access
window.expandAll = expandAll;
window.collapseAll = collapseAll;

/**
 * Resizable Panels - Draggable Panel Dividers
 */
document.addEventListener('DOMContentLoaded', function() {
    initResizablePanels();
});

function initResizablePanels() {
    const MIN_WIDTH = 200;
    const MAX_WIDTH_PERCENT = 0.5;
    
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const rightSidebar = document.getElementById('rightSidebar');
    const leftHandle = document.getElementById('leftResizeHandle');
    const rightHandle = document.getElementById('rightResizeHandle');
    
    let isDragging = false;
    let currentHandle = null;
    let startX = 0;
    let startWidth = 0;
    
    function onMouseDown(e, handle) {
        e.preventDefault();
        isDragging = true;
        currentHandle = handle;
        startX = e.clientX;
        
        if (handle === leftHandle) {
            startWidth = sidebar.offsetWidth;
        } else {
            startWidth = rightSidebar.offsetWidth;
        }
        
        handle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    function onMouseMove(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const viewportWidth = window.innerWidth;
        const maxWidth = viewportWidth * MAX_WIDTH_PERCENT;

        if (currentHandle === leftHandle) {
            let newWidth = startWidth + deltaX;
            newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth));

            sidebar.style.width = newWidth + 'px';
            document.documentElement.style.setProperty('--sidebar-width', newWidth + 'px');
            mainContent.style.marginLeft = newWidth + 'px';
        } else {
            let newWidth = startWidth - deltaX;
            newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth));

            rightSidebar.style.width = newWidth + 'px';
            document.documentElement.style.setProperty('--right-sidebar-width', newWidth + 'px');
            mainContent.style.marginRight = newWidth + 'px';
        }
    }
    
    function onMouseUp() {
        if (!isDragging) return;
        
        isDragging = false;
        if (currentHandle) {
            currentHandle.classList.remove('dragging');
        }
        currentHandle = null;
        
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    leftHandle.addEventListener('mousedown', function(e) {
        onMouseDown(e, leftHandle);
    });
    
    rightHandle.addEventListener('mousedown', function(e) {
        onMouseDown(e, rightHandle);
    });
}

/**
 * Video Modal - Global functions
 */
function openVideoModal(src, videoTitle) {
    var overlay = document.getElementById('videoModal');
    var player = document.getElementById('videoModalPlayer');
    var titleEl = document.getElementById('videoModalTitle');

    if (!overlay || !player) return;

    var oldSource = player.querySelector('source');
    if (oldSource) oldSource.remove();

    var source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    player.appendChild(source);
    player.load();

    if (titleEl) titleEl.textContent = videoTitle || '';
    overlay.classList.add('active');
}

function closeVideoModal() {
    var overlay = document.getElementById('videoModal');
    var player = document.getElementById('videoModalPlayer');

    if (!overlay || !player) return;

    overlay.classList.remove('active');
    player.pause();

    var srcEl = player.querySelector('source');
    if (srcEl) srcEl.remove();
    player.removeAttribute('src');
    player.load();
}

/**
 * Reference Citation Hover Popups
 */
function initRefPopups() {
    var citations = document.querySelectorAll('.ref-citation');

    citations.forEach(function(citation) {
        var refId = citation.getAttribute('data-ref');
        var popup = document.getElementById('ref-popup-' + refId);
        if (!popup) return;

        var hideTimer = null;

        function show() {
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
            document.querySelectorAll('.ref-popup.visible').forEach(function(p) {
                p.classList.remove('visible');
            });
            var rect = citation.getBoundingClientRect();
            var vw = window.innerWidth || document.documentElement.clientWidth;
            var vh = window.innerHeight || document.documentElement.clientHeight;
            var left = rect.left;
            var top = rect.bottom + 8;
            if (left + 480 > vw - 20) left = vw - 500;
            if (left < 20) left = 20;
            if (top + 280 > vh - 20) top = rect.top - 288;
            if (top < 20) top = 20;
            popup.style.left = left + 'px';
            popup.style.top = top + 'px';
            popup.classList.add('visible');
        }

        function hide() {
            hideTimer = setTimeout(function() {
                popup.classList.remove('visible');
            }, 150);
        }

        citation.addEventListener('mouseenter', show);
        citation.addEventListener('mouseleave', hide);
        popup.addEventListener('mouseenter', function() {
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        });
        popup.addEventListener('mouseleave', function() {
            popup.classList.remove('visible');
        });
    });
}

/**
 * Search Functionality
 * Full-text search with prev/next navigation and jump-to-location
 */
function initSearch() {
    var toggle = document.getElementById('searchToggle');
    var overlay = document.getElementById('searchOverlay');
    var input = document.getElementById('searchInput');
    var clearBtn = document.getElementById('searchClear');
    var closeBtn = document.getElementById('searchClose');
    var resultsEl = document.getElementById('searchResults');
    var infoEl = document.getElementById('searchInfo');
    var navEl = document.getElementById('searchNav');
    var countEl = document.getElementById('searchNavCount');
    var prevBtn = document.getElementById('searchPrev');
    var nextBtn = document.getElementById('searchNext');

    if (!toggle || !overlay || !input) return;

    var results = [];
    var activeIndex = -1;
    var searchTimer = null;

    function openSearch() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(function() { input.focus(); }, 100);
    }

    function closeSearch() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        input.value = '';
        clearBtn.classList.remove('visible');
        results = [];
        activeIndex = -1;
        renderResults();
    }

    toggle.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeSearch();
    });

    // Input handler with debounce
    input.addEventListener('input', function() {
        var val = this.value;
        if (val) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(function() { doSearch(val); }, 200);
    });

    clearBtn.addEventListener('click', function() {
        input.value = '';
        input.focus();
        clearBtn.classList.remove('visible');
        results = [];
        activeIndex = -1;
        renderResults();
    });

    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results.length > 0) {
                if (activeIndex === -1) activeIndex = 0;
                jumpToResult(activeIndex);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (results.length > 0) {
                if (activeIndex < results.length - 1) {
                    activeIndex++;
                    scrollToActive();
                    highlightActive();
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (results.length > 0) {
                if (activeIndex > 0) {
                    activeIndex--;
                    scrollToActive();
                    highlightActive();
                }
            }
        }
    });

    prevBtn.addEventListener('click', function() {
        if (activeIndex > 0) {
            activeIndex--;
            scrollToActive();
            highlightActive();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (activeIndex < results.length - 1) {
            activeIndex++;
            scrollToActive();
            highlightActive();
        }
    });

    function doSearch(query) {
        results = [];
        activeIndex = -1;
        var q = query.trim().toLowerCase();

        if (q.length < 2) {
            renderResults();
            return;
        }

        // Search through all content sections
        var sections = document.querySelectorAll('.content-section');
        sections.forEach(function(section) {
            var article = section.querySelector('.content-article');
            if (!article) return;

            var sectionId = section.id || '';
            var header = section.querySelector('.section-header h3, .section-header h2, .section-header h4');
            var sectionLabel = header ? header.textContent.trim() : sectionId;

            // Get all text paragraphs
            var paragraphs = article.querySelectorAll('p');
            paragraphs.forEach(function(p, pIdx) {
                var text = p.textContent;
                var lower = text.toLowerCase();
                var idx = 0;

                // Find all matches in this paragraph
                while ((idx = lower.indexOf(q, idx)) !== -1) {
                    var start = Math.max(0, idx - 60);
                    var end = Math.min(text.length, idx + q.length + 60);
                    var contextBefore = text.substring(start, idx).replace(/^\S+\s*/, '');
                    var contextAfter = text.substring(idx + q.length, end).replace(/\s*\S+$/, '');
                    var matched = text.substring(idx, idx + q.length);

                    // Find nearest heading above
                    var headingEl = findNearestHeading(p);
                    var sectionHeading = headingEl ? headingEl.textContent.trim() : sectionLabel;

                    results.push({
                        sectionLabel: sectionHeading,
                        sectionId: sectionId,
                        el: p,
                        contextBefore: contextBefore,
                        matched: matched,
                        contextAfter: contextAfter,
                        matchIndex: idx,
                        paragraphIndex: pIdx
                    });

                    idx += q.length;
                }
            });
        });

        renderResults();
    }

    function findNearestHeading(el) {
        var current = el.parentElement;
        while (current) {
            var heading = current.querySelector('h2, h3, h4, h5, .section-header h3, .section-header h2');
            if (heading) return heading;
            current = current.previousElementSibling;
        }
        return null;
    }

    function renderResults() {
        if (results.length === 0) {
            if (!input.value.trim() || input.value.trim().length < 2) {
                resultsEl.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i> Type to search through all content</div>';
            } else {
                resultsEl.innerHTML = '<div class="search-no-results">No results found for &quot;' + escapeHtml(input.value.trim()) + '&quot;</div>';
            }
            infoEl.textContent = '';
            navEl.classList.remove('visible');
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        } else {
            infoEl.textContent = 'Found ' + results.length + ' result' + (results.length > 1 ? 's' : '');
            navEl.classList.add('visible');
            countEl.textContent = (activeIndex >= 0 ? (activeIndex + 1) + ' / ' + results.length : results.length + ' results');
            prevBtn.disabled = activeIndex <= 0;
            nextBtn.disabled = activeIndex >= results.length - 1;

            var html = '';
            results.forEach(function(r, i) {
                var activeClass = (i === activeIndex) ? ' active' : '';
                html += '<div class="search-result' + activeClass + '" data-index="' + i + '">';
                html += '<div class="search-result-section">' + escapeHtml(r.sectionLabel) + '</div>';
                html += '<div class="search-result-context">...' + escapeHtml(r.contextBefore) + '<mark>' + escapeHtml(r.matched) + '</mark>' + escapeHtml(r.contextAfter) + '...</div>';
                html += '</div>';
            });
            resultsEl.innerHTML = html;

            // Click handler for results
            resultsEl.querySelectorAll('.search-result').forEach(function(el) {
                el.addEventListener('click', function() {
                    var idx = parseInt(this.getAttribute('data-index'));
                    activeIndex = idx;
                    highlightActive();
                    jumpToResult(idx);
                });
            });
        }
    }

    function highlightActive() {
        var all = resultsEl.querySelectorAll('.search-result');
        all.forEach(function(el, i) {
            if (i === activeIndex) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        countEl.textContent = (activeIndex + 1) + ' / ' + results.length;
        prevBtn.disabled = activeIndex <= 0;
        nextBtn.disabled = activeIndex >= results.length - 1;
    }

    function scrollToActive() {
        var el = resultsEl.querySelector('.search-result.active');
        if (el) {
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    function jumpToResult(index) {
        var r = results[index];
        if (!r || !r.el) return;

        // Close search panel
        closeSearch();

        // Scroll to the paragraph
        setTimeout(function() {
            r.el.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Briefly highlight the paragraph
            r.el.style.transition = 'background 0.3s';
            r.el.style.background = '#fef08a';
            setTimeout(function() {
                r.el.style.background = '';
                setTimeout(function() {
                    r.el.style.transition = '';
                }, 300);
            }, 1500);
        }, 200);
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
}
