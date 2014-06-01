Polymer('fix-placeholder', {
    container: null,
    field: null,
    fixPlaceholder: null,
    fieldComputedStyles: null,

    ready: function() {
        var self = this;
        this.container = this.shadowRoot.querySelector('#container');
        this.fixPlaceholder = this.shadowRoot.querySelector('#fix-placeholder');
        this.field = this.shadowRoot.querySelector('#field');
        this.fieldComputedStyles = window.getComputedStyle(this.field);

        this.setCornerStyles('top');
        this.setCornerStyles('bottom');
        this.setCornerStyles('left');

        this.fixPlaceholder.style.background = this.fieldComputedStyles.getPropertyValue('background');

        var fontSize = parseInt(window.getComputedStyle(this.fixPlaceholder).getPropertyValue('font-size')),
            paddingTotal = Math.floor(((this.field.clientHeight - fontSize) / 2));

        this.fixPlaceholder.style.paddingTop = paddingTotal - 1 + "px";

        if (1 === paddingTotal) {
            paddingTotal = 0;
        }
        this.fixPlaceholder.style.paddingBottom = paddingTotal + "px";

        determineFocusStyle = function(e) {
            setTimeout(function() {
                var fieldOutlineStyles = window.getComputedStyle(self.field).getPropertyValue('outline');
                self.field.blur();
                self.field.classList.add('no-outline');
                self.field.addEventListener('focus', function() {
                    self.container.style.outline = fieldOutlineStyles;
                });
                self.field.addEventListener('blur', function() {
                    self.container.style.outline = 'none';
                });
                self.field.focus();
            }, 0);
        };

        this.field.addEventListener('focus', function(e) {
            determineFocusStyle.call(self, e);
            self.field.removeEventListener('focus', arguments.callee);
        });
    },

    setCornerStyles: function(corner) {
        var styleVariable = 'border' + corner.charAt(0).toUpperCase() + corner.slice(1);

        if ('left' === corner) {
            corner = 'right';
        }
        this.fixPlaceholder.style[styleVariable + 'Style'] = this.fieldComputedStyles.getPropertyValue('border-' + corner + '-style');
        this.fixPlaceholder.style[styleVariable + 'Width'] = this.fieldComputedStyles.getPropertyValue('border-' + corner + '-width');

        // TODO: Default input color is return as black. Do not set it in this case
        var borderColor = this.fieldComputedStyles.getPropertyValue('border-' + corner + '-color'),
            borderColorSum = borderColor.match(/\d+/g).reduce(function(pv, cv) {
                return parseInt(pv) + parseInt(cv);
            }, 0);
        if (borderColorSum > 0) {
            this.fixPlaceholder.style[styleVariable + 'Color'] = borderColor;
        }
    }
});