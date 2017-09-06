;

(function ($) {

    function _validatorHelper() {
        $.each($('small.help-block[data-fv-result=INVALID]'), function (n, small) {
            $(small).closest('div.form-group').addClass('has-error');
        });
        $('form').on('status.field.fv', function (e, data) {
            $(e.target)
                .closest('.form-group')
                .find('small.help-block[data-fv-server=true]')
                .remove();
        });
    }


    $(function() {
        _validatorHelper();
    });

})(jQuery);