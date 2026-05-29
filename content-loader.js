(function() {
    function whenReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function pagePath() {
        var name = window.location.pathname.split('/').pop();
        return name || 'index.html';
    }

    function findPage(content) {
        if (!content || content.version !== 3 || !Array.isArray(content.pages)) return null;
        var current = pagePath();
        return content.pages.find(function(page) {
            return page && page.path === current;
        });
    }

    function setText(selector, value) {
        if (typeof value !== 'string') return;
        document.querySelectorAll(selector).forEach(function(el) {
            el.textContent = value;
        });
    }

    function setMatchingHashLinks(sectionId, value) {
        if (typeof value !== 'string') return;
        document.querySelectorAll('a[href]').forEach(function(link) {
            if (link.getAttribute('href') === '#' + sectionId) {
                link.textContent = value;
            }
        });
    }

    function applySettings(settings) {
        if (!settings) return;
        if (typeof settings.documentTitle === 'string') document.title = settings.documentTitle;
        setText('.logo span', settings.logoText);
        setText('.page-title h1', settings.pageTitle);
    }

    function applySection(section) {
        if (!section || !section.id) return;
        var el = document.getElementById(section.id);
        if (!el) return;

        if (section.type === 'chapter') {
            setText('#' + section.id + ' .chapter-header h2', section.title);
            return;
        }

        if (section.type === 'content') {
            setText('#' + section.id + ' .section-header h2, #' + section.id + ' .section-header h3, #' + section.id + ' .section-header h4', section.title);
            setMatchingHashLinks(section.id, section.title);
            var article = el.querySelector('.content-article');
            if (article && typeof section.bodyHtml === 'string') {
                article.innerHTML = section.bodyHtml;
            }
        }
    }

    function applyContent(content) {
        var page = findPage(content);
        if (!page) return;
        applySettings(page.settings);
        if (Array.isArray(page.sections)) {
            page.sections.forEach(applySection);
        }
    }

    window.coreGradeContentReady = new Promise(function(resolve) {
        whenReady(function() {
            fetch('content.json?v=' + Date.now(), { cache: 'no-store' })
                .then(function(response) {
                    if (!response.ok) throw new Error('content.json not available');
                    return response.json();
                })
                .then(applyContent)
                .catch(function() {
                    // Keep the hardcoded HTML content if the editable content file is missing.
                })
                .then(resolve);
        });
    });
})();
