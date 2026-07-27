const DOWNLOAD_URL = 'https://developer2.lanrar.com/file/?BmAAPgo7BDUJAAoyAzZQPFdoVGxWWgdrVzEBdwY2AHgALlV4XGhXc1MjATELNgVoVGsEXlNlAmQCOFNmB2tWZQY1AGEKZARhCW0KZANxUDdXflRsVjgHMFdmATQGYwA3ADNVOlwnV3NTdQFqC20FNFQ8BDdTIwIwAjJTegdpVmAGKQBnCm8EZglvCj8DYVBiVzhUaFY/BzVXMgE0Bj8ANwAwVWdcMVc3UzYBbwtoBWFUOQRiUzkCYgI9UzEHY1YzBjYAeQotBDkJLwp6AyJQIldoVCNWYAdhV20BMwZiADYANVU2XDJXN1MjASMLNgVpVGsEZ1MxAjECMlNtB25WZgY0AGEKYARkCW0KcgN5UHdXa1Q9Vn4HOFdgASEGLwBxAHdVP1wwVzRTPQFiC24FNlQ7BDVTPwI2AiNTIAcyVicGOwBmCmYEZwlxCm0DYFBiVyNUY1Y8BytXYQE/BmwALwAmVWZcbld0U2sBCAs8BW9UMwQxUyICJgJxUywHK1YyBlkAIgo2BG0Jbw==&toolsdown';

function downloadSnaply() {
    window.open(DOWNLOAD_URL, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initDemoDragDrop();
    initCopyButton();
    initScrollReveal();
    initDownloadButtons();
});

function initDownloadButtons() {
    const downloadBtns = document.querySelectorAll('.download-btn, .btn-primary');
    downloadBtns.forEach(btn => {
        if (btn.getAttribute('href') === DOWNLOAD_URL) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                downloadSnaply();
            });
        }
    });
}

function initNavigation() {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
}

function initDemoDragDrop() {
    const blocks = document.querySelectorAll('.block-item');
    const workspace = document.querySelector('.workspace');
    const outputContent = document.querySelector('.output-content');
    
    const blockHtmlMap = {
        'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Website</title>\n</head>\n<body>',
        'head': '    <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width">\n        <title>My Page</title>\n    </head>',
        'body': '    <body>\n        <!-- Page Content Here -->\n    </body>',
        'h1': '    <h1>Hello World!</h1>',
        'p': '    <p>This is a paragraph.</p>',
        'div': '    <div>\n        <p>Content inside div</p>\n    </div>',
        'button': '    <button onclick="alert(\'Clicked!\')">Click Me</button>',
        'img': '    <img src="image.jpg" alt="Description">',
        'a': '    <a href="https://example.com">Link</a>',
        'ul': '    <ul>\n        <li>Item 1</li>\n        <li>Item 2</li>\n    </ul>'
    };

    let droppedBlocks = [];

    blocks.forEach(block => {
        block.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.block);
            this.classList.add('dragging');
        });

        block.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });

        block.addEventListener('click', function() {
            const blockType = this.dataset.block;
            if (blockType && blockHtmlMap[blockType]) {
                addBlockToWorkspace(blockType);
                updateOutput();
            }
        });
    });

    workspace.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    workspace.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });

    workspace.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        const blockType = e.dataTransfer.getData('text/plain');
        if (blockType && blockHtmlMap[blockType]) {
            addBlockToWorkspace(blockType);
            updateOutput();
        }
    });

    function addBlockToWorkspace(blockType) {
        const blockName = getBlockName(blockType);
        const blockIcon = getBlockIcon(blockType);
        
        const droppedBlock = document.createElement('div');
        droppedBlock.className = 'dropped-block';
        droppedBlock.dataset.type = blockType;
        droppedBlock.innerHTML = `<span class="block-icon">${blockIcon}</span>${blockName}`;
        
        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.style.marginLeft = 'auto';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '20px';
        removeBtn.style.color = 'rgba(255,255,255,0.7)';
        removeBtn.onmouseenter = function() { this.style.color = 'white'; };
        removeBtn.onmouseleave = function() { this.style.color = 'rgba(255,255,255,0.7)'; };
        
        removeBtn.addEventListener('click', function() {
            droppedBlock.remove();
            droppedBlocks = droppedBlocks.filter(b => b !== blockType);
            updateOutput();
        });
        
        droppedBlock.appendChild(removeBtn);
        workspace.appendChild(droppedBlock);
        
        droppedBlocks.push(blockType);
        
        workspace.querySelector('h4')?.remove();
    }

    function updateOutput() {
        if (droppedBlocks.length === 0) {
            outputContent.textContent = '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Website</title>\n</head>\n<body>\n    <!-- Drag blocks here -->\n</body>\n</html>';
            return;
        }

        let htmlOutput = '';
        
        droppedBlocks.forEach((blockType, index) => {
            if (index > 0) {
                htmlOutput += '\n';
            }
            htmlOutput += blockHtmlMap[blockType];
        });
        
        if (!droppedBlocks.includes('html')) {
            htmlOutput = '<!DOCTYPE html>\n<html>\n' + htmlOutput + '\n</html>';
        }
        
        outputContent.textContent = htmlOutput;
    }

    function getBlockName(type) {
        const names = {
            'html': 'HTML Document',
            'head': 'Head Section',
            'body': 'Body Section',
            'h1': 'Heading 1',
            'p': 'Paragraph',
            'div': 'Div Container',
            'button': 'Button',
            'img': 'Image',
            'a': 'Link',
            'ul': 'List'
        };
        return names[type] || type;
    }

    function getBlockIcon(type) {
        const icons = {
            'html': '<',
            'head': '⚙️',
            'body': '📄',
            'h1': '🔤',
            'p': '📝',
            'div': '📦',
            'button': '🔘',
            'img': '🖼️',
            'a': '🔗',
            'ul': '📋'
        };
        return icons[type] || '📦';
    }
}

function initCopyButton() {
    const copyBtn = document.querySelector('.copy-btn');
    const outputContent = document.querySelector('.output-content');

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(outputContent.textContent).then(function() {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            copyBtn.style.background = '#00CEC9';
            copyBtn.style.color = '#2D3436';
            
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
        });
    });
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.feature-card, .step-item, .download-card');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        smoothScroll(targetId);
    });
});
