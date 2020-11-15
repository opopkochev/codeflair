// MIXINS IIFE
let mixins = (function() {
    return {
        _removeClass: function (el, cl) {
            if (el.classList.contains(cl)) {
                el.classList.remove(cl);
            }
        },
        _mailTo: function(username, domain) {
            username = window.btoa(username);
            domain = window.btoa(domain);

            window.location.href = `mailto:${window.atob(username)}@${window.atob(domain)}`
        }
    }
})();

// HANDLERS
let handlers = (function(){
    return {
        _init: function() {
            this.emailProtection()
        },
        emailProtection: function() {
            const emailHanler = document.querySelector('.btn--hello-world');

            emailHanler.addEventListener('click', function() {
                mixins._mailTo('info', 'codeflair.ch')
            })
        }
    }
})();

// WINDOW EVENTS IIFE
let windowEvents = (function(){
    return {
        _init: function() {
            this.resize();
        },
        resize: function() {
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 768) {
                    navigation.closeNavigation();
                }
            })
        }
    }
})();

// PROJECTS IIFE
let projects = (function(){
    return {
        _init: function() {
        },
        _destroy: function() {
        }
    }
})();

// NAVIGATION IIFE
let navigation = (function() {
    return {
        // Set body and main as top selectors
        _body: document.querySelector('body'),
        _mainOutput: document.querySelector('main'),
        _lastSelectedContent: null,

        // Define components storage
        _contentStorage: [
            {
                key: 'about',
                title: 'About',
                content: null,
            },
            {
                key: 'cv',
                title: 'CV',
                content: null
            },
            {
                key: 'projects',
                title: 'Projects',
                content: null,
                childrens: projects 
            },
        ],

        // Initialize App
        _init: function() {
            this.initializeContents();
            this.navigationContentLinks();
            this.toggleNavigation();
            this.showContent('about');
        },
        
        // Initialize Contents
        initializeContents: function() {
            const _parent = this;

            // Loop through main content storage
            this._contentStorage.forEach(function(item, index) {
                const temp = document.getElementById(item.key);
                const clone = temp.content.cloneNode(true); 

                // Set items content
                _parent._contentStorage[index].content = clone;
                
                // Remove Template from DOM
                _parent._body.removeChild(temp);
            })
        },
        
        // Display Content
        showContent: function(key) {
            const DEFAULT_INDEX = this._contentStorage.findIndex(function(item) {
                return item.key === key;
            });
            const DEFAULT_CONTENT = this._contentStorage[DEFAULT_INDEX];

            if(this._lastSelectedContent) {
                if (DEFAULT_CONTENT.key !== this._lastSelectedContent.key) {
                    this._mainOutput.removeChild(document.querySelector(`.${this._lastSelectedContent.key}`));
    
                    if(this._lastSelectedContent.hasOwnProperty('childrens')) {
                        if (this._lastSelectedContent.childrens.hasOwnProperty('_destroy')) {
                            this._lastSelectedContent.childrens._destroy();
                        }
                    }
                }
            }

            if (DEFAULT_CONTENT) {
                this._mainOutput.appendChild(DEFAULT_CONTENT.content);
                this._contentStorage[DEFAULT_INDEX].content = document.querySelector(`.${key}`);
                this._lastSelectedContent = this._contentStorage[DEFAULT_INDEX];

                if(DEFAULT_CONTENT.hasOwnProperty('childrens')) {
                    DEFAULT_CONTENT.childrens._init();
                }
            }
        },

        // Navigation Events
        navigationContentLinks: function() {
            const _parent = this;
            const navLinks = document.querySelectorAll('.navbar-link');
            
            navLinks.forEach(el => {
                el.addEventListener('click', function(event) {
                    event.preventDefault();
                    // Href attributes are associated with Content Storage keys
                    let content = event.target.href.split('#')[1];

                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                    })

                    el.classList.add('active');

                    // close navigation
                    _parent.closeNavigation();
                    // set active content
                    _parent.showContent(content)
                })
            })
        },

        // Navigation Toggler
        toggleNavigation: function () {
            const _parent = this;
            const toggler = document.querySelector(".navbar-toggler");
            const closeToggler = document.querySelector('.navbar-close');

            toggler.addEventListener("click", function() {
                this.classList.toggle('active');
                _parent._body.classList.add('prevent-scroll');
            })

            closeToggler.addEventListener("click", function() {
                _parent.closeNavigation();
            })
        },

        // Close Navigation
        closeNavigation: function() {
            const toggler = document.querySelector(".navbar-toggler");
            
            mixins._removeClass(toggler, 'active');
            mixins._removeClass(this._body, 'prevent-scroll');
        }
    }
})();


// APP IIFE
let app = (function() {
    return {
        _init: function() {
            navigation._init();
            windowEvents._init();
            handlers._init();
        }
    }
})();

app._init();