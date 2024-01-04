(function(win) {
    win.configApp = function configApp() {
        return {
            url() {
                return {
                    dir() {
                        return {
                            base: './',
                            carBrand: 'js/data/carBrand.json',
                            company: 'js/data/company.json'
                        }
                    },
                    xhrUrl() {
                        return {
                            base: 'http://localhost:3000/car'
                        }
                    }
                }
            }
        }
    }
})(window);