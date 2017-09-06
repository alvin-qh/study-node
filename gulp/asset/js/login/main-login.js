'use strict';

import parsleyExt from '../common/parsley-ext';

$(() => {
    parsleyExt.parsleyServer();
    parsleyExt.parsleyFormGroup($('#login-form'));

    function _resetAjaxForm() {
        $('.loading').hide();
        $('.btn-question').prop('disabled', false).removeClass('disabled');
    }

    parsleyExt.parsleyFormGroup($('#question-form')).on('submit', e => {
        e.preventDefault();

        let $question = $('input[name=question]');
        let $answer = $('div.answer');
        $.get('/routing/question', {'question': $question.val()}, data => {
            $answer.show('fast').find('p.content').text(data.answer);
            _resetAjaxForm();
        }, 'jsonp').fail(data => {
            alert("Net work failed, please try again later");
            _resetAjaxForm();
        });
    });
});
